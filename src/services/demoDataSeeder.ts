import { supabase } from '@/integrations/supabase/client';
import { debug } from '@/utils/debug';

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
    const timer = debug.startTimer('demo-user-creation');
    const timestamp = Date.now();
    const demoUserEmail = `demo-${timestamp}@demo.farclarity.app`;
    const demoPassword = 'DemoPass123!';

    try {
      debug.data('Creating demo user with Supabase Auth', { email: demoUserEmail });

      // Step 1: Create auth user with proper signup
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: demoUserEmail,
        password: demoPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: 'Demo',
            last_name: 'User',
            company: this.DEMO_COMPANY,
            role: 'Contract Manager',
            company_size: '11-50',
            primary_agency: 'Department of Defense',
            referral_source: 'Demo Mode'
          }
        }
      });

      if (authError) {
        debug.error('Auth signup error', authError, 'DATA');
        throw new Error(`Demo user creation failed: ${authError.message}`);
      }

      if (!authData.user) {
        throw new Error('No user data returned from signup');
      }

      const userId = authData.user.id;
      debug.data('Demo auth user created', { userId });

      // Step 2: Sign in the demo user to establish session
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: demoUserEmail,
        password: demoPassword
      });

      if (signInError) {
        debug.error('Demo user sign-in error', signInError, 'DATA');
        throw new Error(`Failed to sign in demo user: ${signInError.message}`);
      }

      debug.data('Demo user signed in successfully');

      // Step 3: Wait for profile creation trigger and update with demo settings
      await new Promise(resolve => setTimeout(resolve, 1500));

      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + this.DEMO_SESSION_MINUTES);

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          is_demo_user: true,
          demo_session_expires_at: expiresAt.toISOString(),
          subscription_tier: 'professional',
          company: this.DEMO_COMPANY,
          role: 'Contract Manager'
        })
        .eq('id', userId);

      if (profileError) {
        debug.error('Failed to update demo profile', profileError, 'DATA');
        // Continue anyway as this is not critical
      } else {
        debug.data('Demo profile updated successfully');
      }

      // Step 4: Seed demo data
      await this.seedDemoData(userId);
      
      debug.data('Demo user created successfully', { userId });
      timer.end('Demo user creation completed');
      return userId;
    } catch (error) {
      debug.error('Demo user creation failed', error, 'DATA');
      timer.end('Demo user creation failed');
      // Clean up on failure
      await supabase.auth.signOut();
      throw error;
    }
  }

  private async seedDemoData(userId: string): Promise<void> {
    const timer = debug.startTimer('demo-data-seeding');
    debug.data('Starting demo data seeding', { userId });

    await Promise.all([
      this.createDemoDocuments(userId),
      this.createDemoAnalyses(userId),
      this.createDemoComplianceGaps(userId),
      this.createDemoRecommendations(userId)
    ]);

    timer.end('Demo data seeding completed');
    debug.data('Demo data seeding completed successfully');
  }

  private async createDemoDocuments(userId: string): Promise<void> {
    debug.data('Creating demo documents', { userId });
    
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
      debug.error('Failed to create demo documents', error, 'DATA');
      throw new Error(`Demo documents creation failed: ${error.message}`);
    }
    
    debug.data('Demo documents created successfully', { count: documents.length });
  }

  private async createDemoAnalyses(userId: string): Promise<void> {
    debug.data('Creating demo analyses', { userId });
    
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
      debug.error('Failed to create demo analyses', error, 'DATA');
      throw new Error(`Demo analyses creation failed: ${error.message}`);
    }
    
    debug.data('Demo analyses created successfully', { count: analyses.length });
  }

  private async createDemoComplianceGaps(userId: string): Promise<void> {
    debug.data('Creating demo compliance gaps', { userId });
    
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
      debug.error('Failed to create demo compliance gaps', error, 'DATA');
      throw new Error(`Demo compliance gaps creation failed: ${error.message}`);
    }
    
    debug.data('Demo compliance gaps created successfully', { count: gaps.length });
  }

  private async createDemoRecommendations(userId: string): Promise<void> {
    debug.data('Creating demo recommendations', { userId });
    
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
      debug.error('Failed to create demo recommendations', error, 'DATA');
      throw new Error(`Demo recommendations creation failed: ${error.message}`);
    }
    
    debug.data('Demo recommendations created successfully', { count: recommendations.length });
  }

  async cleanupDemoUser(userId: string): Promise<void> {
    debug.data('Starting demo user cleanup', { userId });
    
    try {
      // Sign out the demo user
      await supabase.auth.signOut();
      
      // Note: The database cleanup function will handle removing expired demo users
      // via the cleanup_expired_demo_users() function and cascading deletes
      
      debug.data('Demo user session ended', { userId });
    } catch (error) {
      debug.error('Failed to cleanup demo user', error, 'DATA');
    }
  }

  async cleanupExpiredDemoUsers(): Promise<void> {
    debug.data('Starting cleanup of expired demo users');
    
    try {
      // This will be handled by the database function
      // We can call it if needed for manual cleanup
      const { error } = await supabase.rpc('cleanup_expired_demo_users');
      
      if (error) {
        debug.error('Failed to cleanup expired demo users', error, 'DATA');
      } else {
        debug.data('Expired demo users cleaned up successfully');
      }
    } catch (error) {
      debug.error('Failed to cleanup expired demo users', error, 'DATA');
      throw error;
    }
  }
}

export const demoDataSeeder = new DemoDataSeeder();
