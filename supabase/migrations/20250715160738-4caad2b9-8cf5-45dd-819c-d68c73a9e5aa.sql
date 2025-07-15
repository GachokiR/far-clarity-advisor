-- First, let's fix the previous migration issues and split it into smaller parts
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

-- Create security_events table first
CREATE TABLE public.security_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type text NOT NULL,
    user_id uuid,
    details jsonb DEFAULT '{}'::jsonb,
    ip_address inet,
    user_agent text,
    timestamp timestamp with time zone DEFAULT now()
);

-- Enable RLS on security_events table
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;