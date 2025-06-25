
-- Create subscription tier enum type
CREATE TYPE public.subscription_tier AS ENUM ('trial', 'basic', 'professional', 'enterprise');

-- Add subscription tier columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN subscription_tier subscription_tier NOT NULL DEFAULT 'trial',
ADD COLUMN trial_start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
ADD COLUMN trial_end_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '14 days'),
ADD COLUMN usage_limits JSONB NOT NULL DEFAULT '{
  "max_documents": 5,
  "max_analyses_per_month": 10,
  "max_team_members": 1
}'::jsonb,
ADD COLUMN subscription_updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();

-- Create function to get default usage limits for each tier
CREATE OR REPLACE FUNCTION public.get_tier_limits(tier subscription_tier)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
AS $$
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
$$;

-- Create helper functions for tier management
CREATE OR REPLACE FUNCTION public.get_user_tier(user_id UUID)
RETURNS subscription_tier
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT subscription_tier 
  FROM public.profiles 
  WHERE id = user_id;
$$;

CREATE OR REPLACE FUNCTION public.is_trial_expired(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT trial_end_date < now() 
  FROM public.profiles 
  WHERE id = user_id;
$$;

CREATE OR REPLACE FUNCTION public.upgrade_user_tier(user_id UUID, new_tier subscription_tier)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles 
  SET 
    subscription_tier = new_tier,
    usage_limits = public.get_tier_limits(new_tier),
    subscription_updated_at = now()
  WHERE id = user_id;
END;
$$;

-- Enable RLS on profiles table if not already enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Update existing users with default tier settings
UPDATE public.profiles 
SET 
  subscription_tier = 'trial',
  trial_start_date = created_at,
  trial_end_date = created_at + INTERVAL '14 days',
  usage_limits = public.get_tier_limits('trial'::subscription_tier),
  subscription_updated_at = now()
WHERE subscription_tier IS NULL;

-- Create index for efficient tier queries
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_tier ON public.profiles(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_profiles_trial_end_date ON public.profiles(trial_end_date);
