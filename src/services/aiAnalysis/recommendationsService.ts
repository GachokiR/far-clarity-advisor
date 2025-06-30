
import { supabase } from '@/integrations/supabase/client';
import { handleApiError } from '@/utils/errorSanitizer';
import { AIRecommendation } from '@/types/aiAnalysis';
import { Tables } from '@/integrations/supabase/types';

// Type adapter to convert database row to AI type
const adaptAIRecommendation = (dbRow: Tables<'ai_recommendations'>): AIRecommendation => {
  return {
    ...dbRow,
    recommendation_type: dbRow.recommendation_type as 'action_item' | 'risk_mitigation' | 'compliance_step',
    priority: dbRow.priority as 'low' | 'medium' | 'high' | 'critical',
    status: dbRow.status as 'pending' | 'in_progress' | 'completed' | 'dismissed',
    estimated_effort: dbRow.estimated_effort as 'low' | 'medium' | 'high' | undefined
  };
};

export const getAIRecommendations = async (analysisId?: string): Promise<AIRecommendation[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated');
    }

    let query = supabase
      .from('ai_recommendations')
      .select('*')
      .eq('user_id', user.id);

    if (analysisId) {
      query = query.eq('analysis_id', analysisId);
    }

    const { data, error } = await query.order('priority', { ascending: false });

    if (error) throw error;
    return (data || []).map(adaptAIRecommendation);
  } catch (error: any) {
    throw handleApiError(error, 'getAIRecommendations');
  }
};

export const updateRecommendationStatus = async (
  id: string, 
  status: 'pending' | 'in_progress' | 'completed' | 'dismissed'
) => {
  try {
    const { data, error } = await supabase
      .from('ai_recommendations')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return adaptAIRecommendation(data);
  } catch (error: any) {
    throw handleApiError(error, 'updateRecommendationStatus');
  }
};
