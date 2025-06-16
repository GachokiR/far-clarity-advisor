
import { logger } from '@/utils/productionLogger';
import { securityLogger } from '@/utils/securityLogger';

export interface SecurityAlert {
  id: string;
  type: 'threat_detected' | 'behavioral_anomaly' | 'policy_violation' | 'data_breach';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  userId?: string;
  metadata: Record<string, any>;
  timestamp: string;
  status: 'open' | 'investigating' | 'resolved' | 'false_positive';
}

class SecurityAlertsService {
  private securityAlerts: SecurityAlert[] = [];

  createSecurityAlert(
    type: SecurityAlert['type'],
    severity: SecurityAlert['severity'],
    description: string,
    userId?: string,
    metadata: Record<string, any> = {}
  ): SecurityAlert {
    const alert: SecurityAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      severity,
      description,
      userId,
      metadata,
      timestamp: new Date().toISOString(),
      status: 'open'
    };

    this.securityAlerts.push(alert);

    // Log to security system
    securityLogger.logEvent({
      type: 'suspicious_activity',
      userId,
      details: {
        alertId: alert.id,
        alertType: type,
        description,
        metadata
      },
      severity: severity === 'critical' ? 'critical' : severity === 'high' ? 'high' : 'medium'
    });

    logger.warn('Security alert created', alert, 'SecurityAlertsService');

    return alert;
  }

  getSecurityAlerts(status?: SecurityAlert['status']): SecurityAlert[] {
    if (status) {
      return this.securityAlerts.filter(alert => alert.status === status);
    }
    return [...this.securityAlerts];
  }

  updateAlertStatus(alertId: string, status: SecurityAlert['status']): void {
    const alertIndex = this.securityAlerts.findIndex(alert => alert.id === alertId);
    if (alertIndex !== -1) {
      this.securityAlerts[alertIndex].status = status;
      logger.info('Security alert status updated', { alertId, status }, 'SecurityAlertsService');
    }
  }

  clearSecurityAlerts(): void {
    this.securityAlerts = [];
    logger.info('Security alerts cleared', {}, 'SecurityAlertsService');
  }

  getAlertsByType(type: SecurityAlert['type']): SecurityAlert[] {
    return this.securityAlerts.filter(alert => alert.type === type);
  }

  getAlertsBySeverity(severity: SecurityAlert['severity']): SecurityAlert[] {
    return this.securityAlerts.filter(alert => alert.severity === severity);
  }
}

export const securityAlertsService = new SecurityAlertsService();
