
-- Add RLS policy to allow demo user creation
CREATE POLICY "Allow demo user creation" 
ON public.profiles 
FOR INSERT 
WITH CHECK (is_demo_user = true);

-- Add RLS policies for demo users to access their own data
CREATE POLICY "Demo users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (is_demo_user = true AND id = auth.uid());

CREATE POLICY "Demo users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (is_demo_user = true AND id = auth.uid());
