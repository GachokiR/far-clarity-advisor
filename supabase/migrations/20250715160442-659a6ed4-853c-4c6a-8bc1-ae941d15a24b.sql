-- Step 1: Fix Database Function Security (Critical)
-- Update all database functions to use proper search_path

-- Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name'
  );
  RETURN new;
END;
$function$;

-- Fix handle_updated_at function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;

-- Fix validate_demo_session function
CREATE OR REPLACE FUNCTION public.validate_demo_session()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  -- Ensure demo session doesn't exceed 2 hours
  IF NEW.is_demo_user = true THEN
    IF NEW.demo_session_expires_at IS NULL THEN
      NEW.demo_session_expires_at = now() + interval '2 hours';
    END IF;
    
    -- Ensure demo session doesn't exceed maximum allowed time
    IF NEW.demo_session_expires_at > now() + interval '2 hours' THEN
      NEW.demo_session_expires_at = now() + interval '2 hours';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Fix cleanup_expired_demo_users function
CREATE OR REPLACE FUNCTION public.cleanup_expired_demo_users()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  -- Delete expired demo users and their associated data
  DELETE FROM public.profiles 
  WHERE is_demo_user = true 
    AND demo_session_expires_at < now();
    
  -- Note: Cascading deletes will handle related data in other tables
END;
$function$;

-- Fix get_tier_limits function
CREATE OR REPLACE FUNCTION public.get_tier_limits(tier public.subscription_tier)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  CASE tier
    WHEN 'trial' THEN
      RETURN '{
        "max_documents": 5,
        "max_analyses_per_month": 10,
        "max_team_members": 1
      }'::jsonb;
    WHEN 'basic' THEN
      RETURN '{
        "max_documents": 50,
        "max_analyses_per_month": 100,
        "max_team_members": 5
      }'::jsonb;
    WHEN 'professional' THEN
      RETURN '{
        "max_documents": 500,
        "max_analyses_per_month": 1000,
        "max_team_members": 20
      }'::jsonb;
    WHEN 'enterprise' THEN
      RETURN '{
        "max_documents": -1,
        "max_analyses_per_month": -1,
        "max_team_members": -1
      }'::jsonb;
    ELSE
      RETURN '{
        "max_documents": 5,
        "max_analyses_per_month": 10,
        "max_team_members": 1
      }'::jsonb;
  END CASE;
END;
$function$;

-- Fix get_user_tier function
CREATE OR REPLACE FUNCTION public.get_user_tier(user_id uuid)
RETURNS public.subscription_tier
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT subscription_tier 
  FROM public.profiles 
  WHERE id = user_id;
$function$;

-- Fix is_trial_expired function
CREATE OR REPLACE FUNCTION public.is_trial_expired(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT trial_end_date < now() 
  FROM public.profiles 
  WHERE id = user_id;
$function$;

-- Fix upgrade_user_tier function
CREATE OR REPLACE FUNCTION public.upgrade_user_tier(user_id uuid, new_tier public.subscription_tier)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  UPDATE public.profiles 
  SET 
    subscription_tier = new_tier,
    usage_limits = public.get_tier_limits(new_tier),
    subscription_updated_at = now()
  WHERE id = user_id;
END;
$function$;

-- Step 2: Implement Proper Role-Based Access Control (Critical)
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'analyst', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    role public.app_role NOT NULL,
    assigned_at timestamp with time zone NOT NULL DEFAULT now(),
    assigned_by uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS public.app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT role 
  FROM public.user_roles 
  WHERE user_id = user_id 
  ORDER BY assigned_at DESC 
  LIMIT 1;
$function$;

-- Create security definer function to check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(user_id uuid, check_role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = user_id
      AND role = check_role
  );
$function$;

-- Create security definer function to check if user has any admin role
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = user_id
      AND role IN ('admin', 'moderator')
  );
$function$;

-- Create RLS policies for user_roles table
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

-- Step 3: Remove role column from profiles table and restrict role modifications
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

-- Step 4: Enhance existing RLS policies with role-based access control
-- Update analysis_results policies to include role-based access
DROP POLICY IF EXISTS "Users can view their own analysis results" ON public.analysis_results;
CREATE POLICY "Users can view their own analysis results"
ON public.analysis_results
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Users can update their own analysis results" ON public.analysis_results;
CREATE POLICY "Users can update their own analysis results"
ON public.analysis_results
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own analysis results" ON public.analysis_results;
CREATE POLICY "Users can delete their own analysis results"
ON public.analysis_results
FOR DELETE
TO authenticated
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- Update AI analysis results policies
DROP POLICY IF EXISTS "Users can view their own AI analysis results" ON public.ai_analysis_results;
CREATE POLICY "Users can view their own AI analysis results"
ON public.ai_analysis_results
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Users can update their own AI analysis results" ON public.ai_analysis_results;
CREATE POLICY "Users can update their own AI analysis results"
ON public.ai_analysis_results
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own AI analysis results" ON public.ai_analysis_results;
CREATE POLICY "Users can delete their own AI analysis results"
ON public.ai_analysis_results
FOR DELETE
TO authenticated
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- Update documents policies
DROP POLICY IF EXISTS "Users can view their own documents" ON public.documents;
CREATE POLICY "Users can view their own documents"
ON public.documents
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Users can update their own documents" ON public.documents;
CREATE POLICY "Users can update their own documents"
ON public.documents
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own documents" ON public.documents;
CREATE POLICY "Users can delete their own documents"
ON public.documents
FOR DELETE
TO authenticated
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- Update profiles policies to prevent role modification
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Add policy for admins to manage all profiles
CREATE POLICY "Admins can manage all profiles"
ON public.profiles
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Step 5: Add session security enhancements
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
    -- In a real implementation, this would log to a security events table
    -- For now, we'll create a simple logging table
    
    -- Create security_events table if it doesn't exist
    CREATE TABLE IF NOT EXISTS public.security_events (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        event_type text NOT NULL,
        user_id uuid,
        details jsonb DEFAULT '{}'::jsonb,
        ip_address inet,
        user_agent text,
        timestamp timestamp with time zone DEFAULT now()
    );
    
    INSERT INTO public.security_events (event_type, user_id, details)
    VALUES (event_type, user_id, details);
END;
$function$;

-- Add RLS to security_events table
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

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