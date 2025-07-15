-- Step 6: Enhance existing RLS policies with role-based access control
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

-- Update AI recommendations policies
DROP POLICY IF EXISTS "Users can view their own AI recommendations" ON public.ai_recommendations;
CREATE POLICY "Users can view their own AI recommendations"
ON public.ai_recommendations
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Users can update their own AI recommendations" ON public.ai_recommendations;
CREATE POLICY "Users can update their own AI recommendations"
ON public.ai_recommendations
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own AI recommendations" ON public.ai_recommendations;
CREATE POLICY "Users can delete their own AI recommendations"
ON public.ai_recommendations
FOR DELETE
TO authenticated
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- Update compliance gaps policies
DROP POLICY IF EXISTS "Users can view their own compliance gaps" ON public.compliance_gaps;
CREATE POLICY "Users can view their own compliance gaps"
ON public.compliance_gaps
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Users can update their own compliance gaps" ON public.compliance_gaps;
CREATE POLICY "Users can update their own compliance gaps"
ON public.compliance_gaps
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own compliance gaps" ON public.compliance_gaps;
CREATE POLICY "Users can delete their own compliance gaps"
ON public.compliance_gaps
FOR DELETE
TO authenticated
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- Update compliance checklists policies
DROP POLICY IF EXISTS "Users can view their own compliance checklists" ON public.compliance_checklists;
CREATE POLICY "Users can view their own compliance checklists"
ON public.compliance_checklists
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Users can update their own compliance checklists" ON public.compliance_checklists;
CREATE POLICY "Users can update their own compliance checklists"
ON public.compliance_checklists
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own compliance checklists" ON public.compliance_checklists;
CREATE POLICY "Users can delete their own compliance checklists"
ON public.compliance_checklists
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

-- Update profiles policies to prevent unauthorized role modification
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

-- Create function to assign admin role to first user (for initial setup)
CREATE OR REPLACE FUNCTION public.assign_first_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    -- Only assign admin if no admins exist
    IF NOT EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE role IN ('admin', 'moderator')
    ) THEN
        -- Assign admin role to the first user created
        INSERT INTO public.user_roles (user_id, role, assigned_by)
        SELECT id, 'admin'::public.app_role, id
        FROM public.profiles
        ORDER BY created_at ASC
        LIMIT 1
        ON CONFLICT (user_id, role) DO NOTHING;
    END IF;
END;
$function$;