
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database tables
export interface AnalysisResult {
  id: string;
  user_id: string;
  document_name: string;
  analysis_data: any;
  risk_level: 'low' | 'medium' | 'high';
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
}
