
import { supabase } from '@/lib/supabase';

export interface UserProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  company: string | null;
  role: string | null;
  subscription_tier: 'trial' | 'basic' | 'professional' | 'enterprise';
  trial_start_date: string;
  trial_end_date: string;
  usage_limits: {
    max_documents: number;
    max_analyses_per_month: number;
    max_team_members: number;
  };
  subscription_updated_at: string;
  created_at: string;
  updated_at: string;
}

export const getUserProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to fetch profile');
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) throw error;
  return data as UserProfile;
};

export const updateUserProfile = async (updates: Partial<UserProfile>) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to update profile');
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data as UserProfile;
};

export const createUserProfile = async (profileData: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to create profile');
  }

  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      ...profileData
    })
    .select()
    .single();

  if (error) throw error;
  return data as UserProfile;
};

export const upgradeUserTier = async (newTier: 'trial' | 'basic' | 'professional' | 'enterprise') => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to upgrade tier');
  }

  const { error } = await supabase.rpc('upgrade_user_tier', {
    user_id: user.id,
    new_tier: newTier
  });

  if (error) throw error;
};

export const isTrialExpired = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to check trial status');
  }

  const { data, error } = await supabase.rpc('is_trial_expired', {
    user_id: user.id
  });

  if (error) throw error;
  return data as boolean;
};

export const getTierLimits = (tier: 'trial' | 'basic' | 'professional' | 'enterprise') => {
  const limits = {
    trial: { max_documents: 5, max_analyses_per_month: 10, max_team_members: 1 },
    basic: { max_documents: 50, max_analyses_per_month: 100, max_team_members: 5 },
    professional: { max_documents: 500, max_analyses_per_month: 1000, max_team_members: 20 },
    enterprise: { max_documents: -1, max_analyses_per_month: -1, max_team_members: -1 }
  };
  
  return limits[tier];
};
