
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

// Type alias for better readability
type ComplianceChecklist = Tables<'compliance_checklists'>;

export const saveComplianceChecklist = async (
  farClause: string,
  requirements: string[],
  estimatedCost: string,
  timeframe: string
): Promise<ComplianceChecklist> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to save compliance checklists');
  }

  const { data, error } = await supabase
    .from('compliance_checklists')
    .insert({
      user_id: user.id,
      far_clause: farClause,
      requirements: requirements,
      estimated_cost: estimatedCost,
      timeframe: timeframe,
      status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getComplianceChecklists = async (): Promise<ComplianceChecklist[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to fetch compliance checklists');
  }

  const { data, error } = await supabase
    .from('compliance_checklists')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const updateComplianceStatus = async (
  id: string,
  status: 'pending' | 'in_progress' | 'completed'
): Promise<ComplianceChecklist> => {
  const { data, error } = await supabase
    .from('compliance_checklists')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};
