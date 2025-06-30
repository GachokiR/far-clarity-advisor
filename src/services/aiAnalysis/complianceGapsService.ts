
import { supabase } from '@/integrations/supabase/client';
import { handleApiError } from '@/utils/errorSanitizer';
import { ComplianceGap } from '@/types/aiAnalysis';

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
    return data || [];
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
    return data;
  } catch (error: any) {
    throw handleApiError(error, 'updateComplianceGapStatus');
  }
};
