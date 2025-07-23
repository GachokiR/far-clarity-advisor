import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { getUserProfile, type UserProfile } from '@/services/profileService';
import { supabase } from '@/integrations/supabase/client';

interface UsageStats {
  documents: number;
  analyses_this_month: number;
  team_members: number;
}

export const useUsageLimits = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [usage, setUsage] = useState<UsageStats>({
    documents: 0,
    analyses_this_month: 0,
    team_members: 1
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUsageData();
    }
  }, [user]);

  const fetchUsageData = async () => {
    try {
      const profileData = await getUserProfile();
      setProfile(profileData);

      // Get current usage stats
      const [documentsResult, analysesResult] = await Promise.all([
        supabase
          .from('documents')
          .select('id', { count: 'exact' })
          .eq('user_id', user?.id),
        supabase
          .from('ai_analysis_results')
          .select('id', { count: 'exact' })
          .eq('user_id', user?.id)
          .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
      ]);

      setUsage({
        documents: documentsResult.count || 0,
        analyses_this_month: analysesResult.count || 0,
        team_members: 1 // TODO: Implement team members tracking
      });
    } catch (error) {
      console.error('Error fetching usage data:', error);
    } finally {
      setLoading(false);
    }
  };

  const canUploadDocument = () => {
    if (!profile) return false;
    if (profile.usage_limits.max_documents === -1) return true;
    return usage.documents < profile.usage_limits.max_documents;
  };

  const canRunAnalysis = () => {
    if (!profile) return false;
    if (profile.usage_limits.max_analyses_per_month === -1) return true;
    return usage.analyses_this_month < profile.usage_limits.max_analyses_per_month;
  };

  const canAddTeamMember = () => {
    if (!profile) return false;
    if (profile.usage_limits.max_team_members === -1) return true;
    return usage.team_members < profile.usage_limits.max_team_members;
  };

  const getUsagePercentage = (type: 'documents' | 'analyses' | 'team_members') => {
    if (!profile) return 0;
    
    const limits = profile.usage_limits;
    const currentUsage = usage;
    
    switch (type) {
      case 'documents':
        if (limits.max_documents === -1) return 0;
        return (currentUsage.documents / limits.max_documents) * 100;
      case 'analyses':
        if (limits.max_analyses_per_month === -1) return 0;
        return (currentUsage.analyses_this_month / limits.max_analyses_per_month) * 100;
      case 'team_members':
        if (limits.max_team_members === -1) return 0;
        return (currentUsage.team_members / limits.max_team_members) * 100;
      default:
        return 0;
    }
  };

  // New trial-specific functions
  const getTrialDaysRemaining = () => {
    if (!profile) return 0;
    const trialEndDate = new Date(profile.trial_end_date);
    const currentDate = new Date();
    return Math.ceil((trialEndDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  const isTrialExpiring = () => {
    return getTrialDaysRemaining() <= 3;
  };

  const isTrialExpired = () => {
    return getTrialDaysRemaining() <= 0;
  };

  const hasReachedAnyLimit = () => {
    return !canUploadDocument() || !canRunAnalysis() || !canAddTeamMember();
  };

  const isApproachingLimits = () => {
    const docPercentage = getUsagePercentage('documents');
    const analysisPercentage = getUsagePercentage('analyses');
    const teamPercentage = getUsagePercentage('team_members');
    
    return docPercentage >= 80 || analysisPercentage >= 80 || teamPercentage >= 80;
  };

  return {
    profile,
    usage,
    loading,
    canUploadDocument,
    canRunAnalysis,
    canAddTeamMember,
    getUsagePercentage,
    refreshUsage: fetchUsageData,
    // New trial functions
    getTrialDaysRemaining,
    isTrialExpiring,
    isTrialExpired,
    hasReachedAnyLimit,
    isApproachingLimits
  };
};
