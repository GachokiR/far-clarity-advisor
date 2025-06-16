import { supabase } from '@/lib/supabase';
import { validateDocumentContent, validateDocumentName } from '@/utils/inputValidation';
import { aiAnalysisRateLimiter } from '@/utils/rateLimiting';

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
  // Get current user for rate limiting
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User must be authenticated');
  }

  // Rate limiting check
  if (!aiAnalysisRateLimiter.isAllowed(user.id)) {
    const resetTime = aiAnalysisRateLimiter.getResetTime(user.id);
    const resetDate = new Date(resetTime).toLocaleTimeString();
    throw new Error(`Rate limit exceeded. Try again after ${resetDate}`);
  }

  // Validate and sanitize inputs
  const contentValidation = validateDocumentContent(documentContent);
  if (!contentValidation.isValid) {
    throw new Error(`Invalid document content: ${contentValidation.errors.join(', ')}`);
  }

  const nameValidation = validateDocumentName(documentName);
  if (!nameValidation.isValid) {
    throw new Error(`Invalid document name: ${nameValidation.errors.join(', ')}`);
  }

  // Additional content security checks
  if (contentValidation.sanitizedValue.length < 100) {
    throw new Error('Document content is too short for meaningful analysis (minimum 100 characters)');
  }

  // Check for potentially sensitive information patterns
  const sensitivePatterns = [
    /\b\d{3}-\d{2}-\d{4}\b/, // SSN pattern
    /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/, // Credit card pattern
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g // Email pattern (multiple)
  ];

  const emailMatches = contentValidation.sanitizedValue.match(sensitivePatterns[2]);
  if (emailMatches && emailMatches.length > 5) {
    console.warn('Document contains multiple email addresses - potential PII risk');
  }

  try {
    const { data, error } = await supabase.functions.invoke('ai-compliance-analysis', {
      body: {
        documentContent: contentValidation.sanitizedValue,
        documentName: nameValidation.sanitizedValue,
        documentId
      }
    });

    if (error) {
      console.error('AI Analysis Error:', error);
      throw new Error('Failed to process document analysis. Please try again.');
    }

    return data;
  } catch (error: any) {
    // Don't expose internal error details
    if (error.message.includes('rate limit')) {
      throw error; // Allow rate limit errors to pass through
    }
    throw new Error('Analysis service temporarily unavailable. Please try again later.');
  }
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
