
import { BehavioralPattern } from './behavioralPatterns';
import { logSuspiciousActivity } from '@/utils/securityLogger';

export class BehavioralAlertsManager {
  shouldTriggerAlert(pattern: BehavioralPattern): boolean {
    return pattern.pattern !== 'normal';
  }

  processAlert(pattern: BehavioralPattern): void {
    if (this.shouldTriggerAlert(pattern)) {
      logSuspiciousActivity(pattern.userId, `behavioral_pattern_${pattern.pattern}`, {
        riskScore: pattern.riskScore,
        activities: pattern.activities.slice(0, 5) // Log first 5 activities
      });
    }
  }

  getAlertSeverity(pattern: BehavioralPattern): 'low' | 'medium' | 'high' | 'critical' {
    switch (pattern.pattern) {
      case 'anomalous':
        return pattern.riskScore > 80 ? 'critical' : 'high';
      case 'suspicious':
        return pattern.riskScore > 50 ? 'medium' : 'low';
      default:
        return 'low';
    }
  }
}

export const behavioralAlertsManager = new BehavioralAlertsManager();
