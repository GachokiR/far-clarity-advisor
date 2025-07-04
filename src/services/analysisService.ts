
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

// Type alias for better readability
type AnalysisResult = Tables<'analysis_results'>;

export const saveAnalysisResult = async (
  documentName: string,
  analysisData: any,
  riskLevel: 'low' | 'medium' | 'high',
  documentUrl?: string
): Promise<AnalysisResult> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to save analysis results');
  }

  const { data, error } = await supabase
    .from('analysis_results')
    .insert({
      user_id: user.id,
      document_name: documentName,
      analysis_data: analysisData,
      risk_level: riskLevel,
      document_url: documentUrl
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getAnalysisResults = async (): Promise<AnalysisResult[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to fetch analysis results');
  }

  const { data, error } = await supabase
    .from('analysis_results')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};
