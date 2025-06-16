
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
