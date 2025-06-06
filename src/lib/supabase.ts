
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
