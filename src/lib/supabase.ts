
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://qbrncgvscyyvatdgfidt.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFicm5jZ3ZzY3l5dmF0ZGdmaWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxNTI2MzYsImV4cCI6MjA2NDcyODYzNn0.dVLC4qSHbW8kodyecHpQ8uh3DC7bh7ksQXNj4ekrWRE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

export const isSupabaseConnected = true;

// Types for database tables
export interface AnalysisResult {
  id: string;
  user_id: string;
  document_name: string;
  analysis_data: any;
  risk_level: 'low' | 'medium' | 'high';
  document_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ComplianceChecklist {
  id: string;
  user_id: string;
  far_clause: string;
  requirements: string[];
  status: 'pending' | 'in_progress' | 'completed';
  estimated_cost: string;
  timeframe: string;
  created_at: string;
  updated_at: string;
}

// New Phase 3 types
export interface Document {
  id: string;
  user_id: string;
  file_name: string;
  file_size?: number;
  file_type?: string;
  storage_path: string;
  public_url?: string;
  upload_status: 'uploading' | 'completed' | 'error';
  created_at: string;
  updated_at: string;
}

export interface AIAnalysisResult {
  id: string;
  user_id: string;
  document_id?: string;
  analysis_type: string;
  ai_findings: any;
  risk_assessment?: any;
  recommendations?: any;
  confidence_score?: number;
  processing_time_ms?: number;
  model_version?: string;
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
