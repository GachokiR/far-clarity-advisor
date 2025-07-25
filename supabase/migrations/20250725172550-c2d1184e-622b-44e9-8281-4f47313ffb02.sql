-- Remove demo-related database elements properly

-- First drop policies that depend on demo columns
DROP POLICY IF EXISTS "Allow demo user creation" ON public.profiles;
DROP POLICY IF EXISTS "Demo users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Demo users can update their own profile" ON public.profiles;

-- Drop the demo validation trigger
DROP TRIGGER IF EXISTS validate_demo_session_trigger ON public.profiles;

-- Drop demo-related functions
DROP FUNCTION IF EXISTS public.cleanup_expired_demo_users();
DROP FUNCTION IF EXISTS public.validate_demo_session();
DROP FUNCTION IF EXISTS public.validate_session_integrity(uuid);

-- Now remove demo-related columns from profiles table
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS is_demo_user,
DROP COLUMN IF EXISTS demo_session_expires_at;