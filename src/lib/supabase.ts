
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock client when Supabase is not configured
const createMockClient = () => ({
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: () => Promise.resolve({ error: new Error('Supabase not configured') }),
    signUp: () => Promise.resolve({ error: new Error('Supabase not configured') }),
    signOut: () => Promise.resolve({ error: new Error('Supabase not configured') }),
  },
  from: () => ({
    select: () => ({ error: new Error('Supabase not configured') }),
    insert: () => ({ error: new Error('Supabase not configured') }),
    update: () => ({ error: new Error('Supabase not configured') }),
    delete: () => ({ error: new Error('Supabase not configured') }),
  }),
});

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();

export const isSupabaseConnected = !!(supabaseUrl && supabaseAnonKey);

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
