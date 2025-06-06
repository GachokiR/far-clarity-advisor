
import { supabase } from '@/lib/supabase';

export interface AIAnalysisResult {
  id: string;
  user_id: string;
  document_id?: string;
  analysis_type: string;
  ai_findings: any;
  risk_assessment: any;
  recommendations: any;
  confidence_score: number;
  processing_time_ms: number;
  model_version: string;
  created_at: string;
  updated_at: string;
}

export interface AIRecommendation {
  id: string;
  user_id: string;
  analysis_id: string;
  recommendation_type: 'action_item' | 'risk_mitigation' | 'compliance_step';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  far_clause_reference?: string;
  estimated_effort?: 'low' | 'medium' | 'high';
  due_date?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'dismissed';
  auto_generated: boolean;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface ComplianceGap {
  id: string;
  user_id: string;
  analysis_id: string;
  gap_type: 'missing_clause' | 'incomplete_requirement' | 'conflicting_terms';
  severity: 'low' | 'medium' | 'high' | 'critical';
  far_clause: string;
  description: string;
  suggested_action?: string;
  regulatory_reference?: string;
  impact_assessment?: string;
  resolution_status: 'open' | 'investigating' | 'resolved' | 'waived';
  created_at: string;
  updated_at: string;
}

export const runAIAnalysis = async (documentContent: string, documentName: string, documentId?: string) => {
  const { data, error } = await supabase.functions.invoke('ai-compliance-analysis', {
    body: {
      documentContent,
      documentName,
      documentId
    }
  });

  if (error) throw error;
  return data;
};

export const getAIAnalysisResults = async (): Promise<AIAnalysisResult[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated');
  }

  const { data, error } = await supabase
    .from('ai_analysis_results')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getAIRecommendations = async (analysisId?: string): Promise<AIRecommendation[]> => {
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
  return data || [];
};

export const updateRecommendationStatus = async (
  id: string, 
  status: 'pending' | 'in_progress' | 'completed' | 'dismissed'
) => {
  const { data, error } = await supabase
    .from('ai_recommendations')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getComplianceGaps = async (analysisId?: string): Promise<ComplianceGap[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated');
  }

  let query = supabase
    .from('compliance_gaps')
    .select('*')
    .eq('user_id', user.id);

  if (analysisId) {
    query = query.eq('analysis_id', analysisId);
  }

  const { data, error } = await query.order('severity', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const updateComplianceGapStatus = async (
  id: string, 
  status: 'open' | 'investigating' | 'resolved' | 'waived'
) => {
  const { data, error } = await supabase
    .from('compliance_gaps')
    .update({ resolution_status: status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};
