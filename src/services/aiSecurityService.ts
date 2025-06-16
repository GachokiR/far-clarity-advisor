
import { threatDetectionService, ThreatDetectionResult } from './security/threatDetectionService';
import { behavioralAnalysisService, BehavioralPattern } from './security/behavioralAnalysisService';
import { securityAlertsService, SecurityAlert } from './security/securityAlertsService';
import { complianceReportingService } from './security/complianceReportingService';

// Re-export types for backward compatibility
export type { ThreatDetectionResult, BehavioralPattern, SecurityAlert };

class AISecurityService {
  // Threat Detection
  async analyzeContentSecurity(content: string, fileName: string): Promise<ThreatDetectionResult> {
    return threatDetectionService.analyzeContentSecurity(content, fileName);
  }

  // Behavioral Analysis
  analyzeBehavioralPattern(userId: string, actions: string[]): BehavioralPattern {
    return behavioralAnalysisService.analyzeBehavioralPattern(userId, actions);
  }

  getBehavioralPatterns(userId?: string): BehavioralPattern[] {
    return behavioralAnalysisService.getBehavioralPatterns(userId);
  }

  // Security Alerts
  createSecurityAlert(
    type: SecurityAlert['type'],
    severity: SecurityAlert['severity'],
    description: string,
    userId?: string,
    metadata: Record<string, any> = {}
  ): SecurityAlert {
    return securityAlertsService.createSecurityAlert(type, severity, description, userId, metadata);
  }

  getSecurityAlerts(status?: SecurityAlert['status']): SecurityAlert[] {
    return securityAlertsService.getSecurityAlerts(status);
  }

  updateAlertStatus(alertId: string, status: SecurityAlert['status']): void {
    securityAlertsService.updateAlertStatus(alertId, status);
  }

  // Compliance Reporting
  async generateComplianceReport(type: 'gdpr' | 'soc2' | 'hipaa') {
    const alerts = this.getSecurityAlerts();
    return complianceReportingService.generateComplianceReportWithAlerts(type, alerts);
  }

  // Utility methods for clearing data (useful for testing)
  clearAllData(): void {
    behavioralAnalysisService.clearBehavioralPatterns();
    securityAlertsService.clearSecurityAlerts();
  }
}

export const aiSecurityService = new AISecurityService();
