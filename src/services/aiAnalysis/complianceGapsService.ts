
import { supabase } from '@/integrations/supabase/client';
import { handleApiError } from '@/utils/errorSanitizer';
import { ComplianceGap } from '@/types/aiAnalysis';
import { Tables } from '@/integrations/supabase/types';

// Type adapter to convert database row to AI type
const adaptComplianceGap = (dbRow: Tables<'compliance_gaps'>): ComplianceGap => {
  return {
    ...dbRow,
    gap_type: dbRow.gap_type as 'missing_clause' | 'incomplete_requirement' | 'conflicting_terms',
    severity: dbRow.severity as 'low' | 'medium' | 'high' | 'critical',
    resolution_status: dbRow.resolution_status as 'open' | 'investigating' | 'resolved' | 'waived'
  };
};

export const getComplianceGaps = async (analysisId?: string): Promise<ComplianceGap[]> => {
  try {
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
    return (data || []).map(adaptComplianceGap);
  } catch (error: any) {
    throw handleApiError(error, 'getComplianceGaps');
  }
};

export const updateComplianceGapStatus = async (
  id: string, 
  status: 'open' | 'investigating' | 'resolved' | 'waived'
) => {
  try {
    const { data, error } = await supabase
      .from('compliance_gaps')
      .update({ resolution_status: status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return adaptComplianceGap(data);
  } catch (error: any) {
    throw handleApiError(error, 'updateComplianceGapStatus');
  }
};
