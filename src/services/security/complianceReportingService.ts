
import { logger } from '@/utils/productionLogger';
import { securityLogger } from '@/utils/securityLogger';
import { SecurityAlert } from './securityAlertsService';

class ComplianceReportingService {
  async generateComplianceReport(type: 'gdpr' | 'soc2' | 'hipaa') {
    const events = securityLogger.getEvents();
    const alerts: SecurityAlert[] = []; // This will be injected from the main service

    const report = {
      type,
      generatedAt: new Date().toISOString(),
      summary: {
        totalSecurityEvents: events.length,
        criticalAlerts: alerts.filter(a => a.severity === 'critical').length,
        openIncidents: alerts.filter(a => a.status === 'open').length,
        complianceScore: this.calculateComplianceScore(type, events, alerts)
      },
      details: {
        securityEvents: events.slice(-50), // Last 50 events
        securityAlerts: alerts,
        recommendations: this.getComplianceRecommendations(type)
      }
    };

    logger.info('Compliance report generated', { type, score: report.summary.complianceScore }, 'ComplianceReportingService');
    return report;
  }

  generateComplianceReportWithAlerts(type: 'gdpr' | 'soc2' | 'hipaa', alerts: SecurityAlert[]) {
    const events = securityLogger.getEvents();

    const report = {
      type,
      generatedAt: new Date().toISOString(),
      summary: {
        totalSecurityEvents: events.length,
        criticalAlerts: alerts.filter(a => a.severity === 'critical').length,
        openIncidents: alerts.filter(a => a.status === 'open').length,
        complianceScore: this.calculateComplianceScore(type, events, alerts)
      },
      details: {
        securityEvents: events.slice(-50), // Last 50 events
        securityAlerts: alerts,
        recommendations: this.getComplianceRecommendations(type)
      }
    };

    logger.info('Compliance report generated', { type, score: report.summary.complianceScore }, 'ComplianceReportingService');
    return report;
  }

  private calculateComplianceScore(
    type: string, 
    events: any[], 
    alerts: SecurityAlert[]
  ): number {
    // Simple compliance scoring algorithm
    let score = 100;
    
    // Deduct for security incidents
    score -= alerts.filter(a => a.severity === 'critical').length * 10;
    score -= alerts.filter(a => a.severity === 'high').length * 5;
    score -= alerts.filter(a => a.status === 'open').length * 3;

    // Deduct for security events
    const criticalEvents = events.filter(e => e.severity === 'critical').length;
    score -= criticalEvents * 2;

    return Math.max(0, Math.min(100, score));
  }

  private getComplianceRecommendations(type: string): string[] {
    const baseRecommendations = [
      'Regular security audits and assessments',
      'Employee security training programs',
      'Incident response plan updates',
      'Access control reviews'
    ];

    const typeSpecific = {
      gdpr: [
        'Data processing consent management',
        'Right to be forgotten implementation',
        'Data portability features',
        'Privacy impact assessments'
      ],
      soc2: [
        'Continuous monitoring implementation',
        'Change management procedures',
        'Vendor risk assessments',
        'System availability monitoring'
      ],
      hipaa: [
        'PHI encryption at rest and in transit',
        'Audit log retention policies',
        'Business associate agreements',
        'Risk assessment documentation'
      ]
    };

    return [...baseRecommendations, ...(typeSpecific[type] || [])];
  }
}

export const complianceReportingService = new ComplianceReportingService();
