
-- Add demo user fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN is_demo_user boolean NOT NULL DEFAULT false,
ADD COLUMN demo_session_expires_at timestamp with time zone;

-- Create demo data cleanup function
CREATE OR REPLACE FUNCTION public.cleanup_expired_demo_users()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete expired demo users and their associated data
  DELETE FROM public.profiles 
  WHERE is_demo_user = true 
    AND demo_session_expires_at < now();
    
  -- Note: Cascading deletes will handle related data in other tables
END;
$$;

-- Create index for demo user cleanup performance
CREATE INDEX IF NOT EXISTS idx_profiles_demo_cleanup 
ON public.profiles (is_demo_user, demo_session_expires_at) 
WHERE is_demo_user = true;
