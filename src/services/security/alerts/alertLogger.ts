
import { SecurityAlert } from './alertTypes';
import { logger } from '@/utils/productionLogger';
import { securityLogger } from '@/utils/securityLogger';

export class AlertLogger {
  logAlertCreation(alert: SecurityAlert): void {
    // Log to security system
    securityLogger.logEvent({
      type: 'suspicious_activity',
      userId: alert.userId,
      details: {
        alertId: alert.id,
        alertType: alert.type,
        description: alert.description,
        metadata: alert.metadata
      },
      severity: this.mapSeverityToSecurityLogger(alert.severity)
    });

    logger.warn('Security alert created', alert, 'AlertLogger');
  }

  private mapSeverityToSecurityLogger(severity: SecurityAlert['severity']): 'low' | 'medium' | 'high' | 'critical' {
    switch (severity) {
      case 'critical': return 'critical';
      case 'high': return 'high';
      case 'medium': return 'medium';
      case 'low': return 'medium';
      default: return 'medium';
    }
  }
}

export const alertLogger = new AlertLogger();
