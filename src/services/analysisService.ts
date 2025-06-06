
import { supabase } from '@/lib/supabase';
import { AnalysisResult } from '@/lib/supabase';

export const saveAnalysisResult = async (
  documentName: string,
  analysisData: any,
  riskLevel: 'low' | 'medium' | 'high',
  documentUrl?: string
) => {
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

export const getAnalysisResults = async () => {
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
  return data;
};
