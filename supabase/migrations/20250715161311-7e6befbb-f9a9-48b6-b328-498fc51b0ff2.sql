-- Continue with remaining security fixes
-- Step 3: Create RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can assign roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- Step 4: Remove role column from profiles table and add audit logging
-- Remove the role column from profiles table to prevent users from modifying their own roles
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;

-- Add audit logging for role changes
CREATE TABLE public.role_audit_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    old_role public.app_role,
    new_role public.app_role,
    assigned_by uuid,
    action text NOT NULL,
    timestamp timestamp with time zone NOT NULL DEFAULT now(),
    reason text
);

-- Enable RLS on audit log
ALTER TABLE public.role_audit_log ENABLE ROW LEVEL SECURITY;

-- Create audit log policies
CREATE POLICY "Admins can view audit logs"
ON public.role_audit_log
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- Create trigger function for role audit logging
CREATE OR REPLACE FUNCTION public.audit_role_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.role_audit_log (user_id, new_role, assigned_by, action)
    VALUES (NEW.user_id, NEW.role, NEW.assigned_by, 'ASSIGNED');
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.role_audit_log (user_id, old_role, new_role, assigned_by, action)
    VALUES (NEW.user_id, OLD.role, NEW.role, NEW.assigned_by, 'UPDATED');
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.role_audit_log (user_id, old_role, assigned_by, action)
    VALUES (OLD.user_id, OLD.role, auth.uid(), 'REMOVED');
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$function$;

-- Create trigger for role audit logging
CREATE TRIGGER audit_role_changes_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
    FOR EACH ROW EXECUTE FUNCTION public.audit_role_changes();

-- Add updated_at trigger to user_roles table
CREATE TRIGGER update_user_roles_updated_at
    BEFORE UPDATE ON public.user_roles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Assign default user role to existing users
INSERT INTO public.user_roles (user_id, role, assigned_by)
SELECT id, 'user'::public.app_role, id
FROM public.profiles
WHERE NOT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_roles.user_id = profiles.id
);

-- Step 5: Security events logging and policies
CREATE POLICY "Admins can view security events"
ON public.security_events
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "System can insert security events"
ON public.security_events
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
    event_type text,
    user_id uuid,
    details jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    INSERT INTO public.security_events (event_type, user_id, details)
    VALUES (event_type, user_id, details);
END;
$function$;

-- Create function to validate session integrity
CREATE OR REPLACE FUNCTION public.validate_session_integrity(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    profile_record RECORD;
BEGIN
    SELECT * INTO profile_record
    FROM public.profiles
    WHERE id = user_id;
    
    -- Check if demo user session is still valid
    IF profile_record.is_demo_user AND profile_record.demo_session_expires_at < now() THEN
        RETURN FALSE;
    END IF;
    
    -- Check if trial user session is still valid
    IF profile_record.subscription_tier = 'trial' AND profile_record.trial_end_date < now() THEN
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$function$;

-- Create function to cleanup old security events
CREATE OR REPLACE FUNCTION public.cleanup_old_security_events()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    DELETE FROM public.security_events
    WHERE timestamp < now() - interval '90 days';
END;
$function$;