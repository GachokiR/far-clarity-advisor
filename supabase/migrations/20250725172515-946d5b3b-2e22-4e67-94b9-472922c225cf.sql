-- Remove demo-related database elements

-- Drop the cleanup function for demo users
DROP FUNCTION IF EXISTS public.cleanup_expired_demo_users();

-- Remove demo-related columns from profiles table
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS is_demo_user,
DROP COLUMN IF EXISTS demo_session_expires_at;