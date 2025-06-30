import { supabase } from '@/integrations/supabase/client';

export interface DemoData {
  userId: string;
  company: string;
  documents: any[];
  analyses: any[];
  complianceGaps: any[];
  recommendations: any[];
  teamMembers: any[];
}

export class DemoDataSeeder {
  private readonly DEMO_COMPANY = "Time Defense Solutions";
  private readonly DEMO_SESSION_MINUTES = 30;

  async createDemoUser(): Promise<string> {
    const timestamp = Date.now();
    const demoUserId = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + this.DEMO_SESSION_MINUTES);

    try {
      console.log('Creating demo user with direct profile creation...');

      // Create demo user profile directly
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: demoUserId,
          email: `demo-${timestamp}@demo.internal`,
          first_name: 'Demo',
          last_name: 'User',
          company: this.DEMO_COMPANY,
          role: 'Contract Manager',
          is_demo_user: true,
          demo_session_expires_at: expiresAt.toISOString(),
          subscription_tier: 'professional'
        });

      if (profileError) {
        console.error('Failed to create demo profile:', profileError);
        throw new Error(`Demo profile creation failed: ${profileError.message}`);
      }

      // Create demo data with error handling
      try {
        await this.seedDemoData(demoUserId);
      } catch (seedError) {
        console.error('Demo data seeding failed, cleaning up:', seedError);
        await this.cleanupDemoUser(demoUserId);
        throw new Error('Demo data seeding failed');
      }
      
      console.log('Demo user created successfully:', demoUserId);
      return demoUserId;
    } catch (error) {
      console.error('Demo user creation failed:', error);
      await this.cleanupDemoUser(demoUserId);
      throw error;
    }
  }

  private async seedDemoData(userId: string): Promise<void> {
    await Promise.all([
      this.createDemoDocuments(userId),
      this.createDemoAnalyses(userId),
      this.createDemoComplianceGaps(userId),
      this.createDemoRecommendations(userId)
    ]);
  }

  private async createDemoDocuments(userId: string): Promise<void> {
    const documents = [
      {
        id: crypto.randomUUID(),
        user_id: userId,
        file_name: 'IT_Support_Services_Agreement.pdf',
        file_size: 245760,
        file_type: 'application/pdf',
        storage_path: 'demo/contracts/it-support.pdf',
        upload_status: 'completed',
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: crypto.randomUUID(),
        user_id: userId,
        file_name: 'Cybersecurity_Consulting_RFP.pdf',
        file_size: 387520,
        file_type: 'application/pdf',
        storage_path: 'demo/contracts/cybersecurity-rfp.pdf',
        upload_status: 'completed',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: crypto.randomUUID(),
        user_id: userId,
        file_name: 'Defense_Systems_Integration.pdf',
        file_size: 512000,
        file_type: 'application/pdf',
        storage_path: 'demo/contracts/defense-systems.pdf',
        upload_status: 'completed',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    const { error } = await supabase.from('documents').insert(documents);
    if (error) {
      console.error('Failed to create demo documents:', error);
      throw new Error(`Demo documents creation failed: ${error.message}`);
    }
  }

  private async createDemoAnalyses(userId: string): Promise<void> {
    const analyses = [
      {
        user_id: userId,
        analysis_type: 'far_compliance',
        ai_findings: {
          compliance_score: 92,
          risk_level: 'low',
          issues_found: 3,
          clauses_reviewed: 24,
          summary: 'Well-structured contract with minor compliance issues. Good adherence to FAR requirements.'
        },
        risk_assessment: {
          overall_risk: 'low',
          financial_risk: 'low',
          compliance_risk: 'low',
          operational_risk: 'low'
        },
        confidence_score: 94.5,
        processing_time_ms: 2340,
        model_version: 'gpt-4-compliance-v2.1',
        created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        user_id: userId,
        analysis_type: 'security_assessment',
        ai_findings: {
          compliance_score: 61,
          risk_level: 'high',
          issues_found: 12,
          clauses_reviewed: 34,
          summary: 'Critical security and compliance gaps identified. Immediate attention required for DFARS compliance.'
        },
        risk_assessment: {
          overall_risk: 'high',
          financial_risk: 'high',
          compliance_risk: 'critical',
          operational_risk: 'medium'
        },
        confidence_score: 91.2,
        processing_time_ms: 4120,
        model_version: 'gpt-4-security-v1.8',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    const { error } = await supabase.from('ai_analysis_results').insert(analyses);
    if (error) {
      console.error('Failed to create demo analyses:', error);
      throw new Error(`Demo analyses creation failed: ${error.message}`);
    }
  }

  private async createDemoComplianceGaps(userId: string): Promise<void> {
    const gaps = [
      {
        user_id: userId,
        gap_type: 'missing_clause',
        severity: 'medium',
        far_clause: 'FAR 52.204-21',
        description: 'Basic Safeguarding of Covered Contractor Information Systems clause is missing',
        suggested_action: 'Add FAR 52.204-21 clause to ensure basic cybersecurity requirements are met',
        regulatory_reference: 'FAR 52.204-21 - Basic Safeguarding of Covered Contractor Information Systems',
        impact_assessment: 'Medium risk - Could affect contract award and compliance standing',
        resolution_status: 'open'
      },
      {
        user_id: userId,
        gap_type: 'incomplete_requirement',
        severity: 'high',
        far_clause: 'DFARS 252.204-7012',
        description: 'Safeguarding Covered Defense Information clause implementation is incomplete',
        suggested_action: 'Implement comprehensive NIST SP 800-171 controls and documentation',
        regulatory_reference: 'DFARS 252.204-7012 - Safeguarding Covered Defense Information',
        impact_assessment: 'High risk - Non-compliance may result in contract termination',
        resolution_status: 'investigating'
      },
      {
        user_id: userId,
        gap_type: 'conflicting_terms',
        severity: 'low',
        far_clause: 'FAR 52.219-14',
        description: 'Small business subcontracting plan requirements have conflicting timelines',
        suggested_action: 'Clarify subcontracting plan submission and reporting timelines',
        regulatory_reference: 'FAR 52.219-14 - Limitations on Subcontracting',
        impact_assessment: 'Low risk - Administrative issue that can be resolved through amendment',
        resolution_status: 'open'
      }
    ];

    const { error } = await supabase.from('compliance_gaps').insert(gaps);
    if (error) {
      console.error('Failed to create demo compliance gaps:', error);
      throw new Error(`Demo compliance gaps creation failed: ${error.message}`);
    }
  }

  private async createDemoRecommendations(userId: string): Promise<void> {
    const recommendations = [
      {
        user_id: userId,
        recommendation_type: 'compliance_step',
        priority: 'high',
        title: 'Implement NIST SP 800-171 Controls',
        description: 'Deploy comprehensive cybersecurity controls as required by DFARS 252.204-7012',
        far_clause_reference: 'DFARS 252.204-7012',
        estimated_effort: 'high',
        status: 'pending',
        auto_generated: true,
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        metadata: {
          category: 'cybersecurity',
          urgency: 'critical',
          estimated_hours: 120
        }
      },
      {
        user_id: userId,
        recommendation_type: 'action_item',
        priority: 'medium',
        title: 'Add Basic Safeguarding Clause',
        description: 'Include FAR 52.204-21 clause in contract to meet basic cybersecurity requirements',
        far_clause_reference: 'FAR 52.204-21',
        estimated_effort: 'low',
        status: 'pending',
        auto_generated: true,
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        metadata: {
          category: 'contract_amendment',
          urgency: 'normal',
          estimated_hours: 4
        }
      },
      {
        user_id: userId,
        recommendation_type: 'risk_mitigation',
        priority: 'low',
        title: 'Clarify Subcontracting Timeline',
        description: 'Resolve conflicting timelines in small business subcontracting plan requirements',
        far_clause_reference: 'FAR 52.219-14',
        estimated_effort: 'low',
        status: 'pending',
        auto_generated: true,
        due_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        metadata: {
          category: 'administrative',
          urgency: 'low',
          estimated_hours: 2
        }
      }
    ];

    const { error } = await supabase.from('ai_recommendations').insert(recommendations);
    if (error) {
      console.error('Failed to create demo recommendations:', error);
      throw new Error(`Demo recommendations creation failed: ${error.message}`);
    }
  }

  async cleanupDemoUser(userId: string): Promise<void> {
    try {
      // Delete in reverse order to handle any foreign key constraints
      await Promise.all([
        supabase.from('ai_recommendations').delete().eq('user_id', userId),
        supabase.from('compliance_gaps').delete().eq('user_id', userId),
        supabase.from('ai_analysis_results').delete().eq('user_id', userId),
        supabase.from('documents').delete().eq('user_id', userId)
      ]);
      
      await supabase.from('profiles').delete().eq('id', userId);
      
      console.log('Cleaned up demo user:', userId);
    } catch (error) {
      console.error('Failed to cleanup demo user:', error);
    }
  }

  async cleanupExpiredDemoUsers(): Promise<void> {
    try {
      // Get expired demo users
      const { data: expiredUsers, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('is_demo_user', true)
        .lt('demo_session_expires_at', new Date().toISOString());

      if (fetchError) throw fetchError;

      if (expiredUsers && expiredUsers.length > 0) {
        // Cleanup each expired demo user
        await Promise.all(
          expiredUsers.map(user => this.cleanupDemoUser(user.id))
        );
        console.log(`Cleaned up ${expiredUsers.length} expired demo users`);
      }
    } catch (error) {
      console.error('Failed to cleanup expired demo users:', error);
      throw error;
    }
  }
}

export const demoDataSeeder = new DemoDataSeeder();
