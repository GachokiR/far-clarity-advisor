-- Phase 1: Fix Critical RLS Policy Issues

-- 1. Add missing DELETE policies for ai_analysis_results and compliance_gaps
CREATE POLICY "Users can delete their own AI analysis results" 
ON public.ai_analysis_results 
FOR DELETE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own compliance gaps" 
ON public.compliance_gaps 
FOR DELETE 
USING (auth.uid() = user_id);

-- 2. Clean up duplicate RLS policies on profiles table
-- Drop redundant policies (keeping the most permissive ones)
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- 3. Enhance demo user validation with proper time constraints
-- Add a trigger to automatically clean up expired demo users
CREATE OR REPLACE FUNCTION public.validate_demo_session()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure demo session doesn't exceed 2 hours
  IF NEW.is_demo_user = true THEN
    IF NEW.demo_session_expires_at IS NULL THEN
      NEW.demo_session_expires_at := now() + interval '2 hours';
    END IF;
    
    -- Ensure demo session doesn't exceed maximum allowed time
    IF NEW.demo_session_expires_at > now() + interval '2 hours' THEN
      NEW.demo_session_expires_at := now() + interval '2 hours';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for demo user validation
DROP TRIGGER IF EXISTS validate_demo_session_trigger ON public.profiles;
CREATE TRIGGER validate_demo_session_trigger
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_demo_session();

-- 4. Add indexes for better security query performance
CREATE INDEX IF NOT EXISTS idx_profiles_demo_expires ON public.profiles(demo_session_expires_at) WHERE is_demo_user = true;
CREATE INDEX IF NOT EXISTS idx_ai_analysis_user_created ON public.ai_analysis_results(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_compliance_gaps_user_created ON public.compliance_gaps(user_id, created_at);