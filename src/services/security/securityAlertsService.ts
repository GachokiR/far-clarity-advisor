
import { SecurityAlert, AlertType, AlertSeverity, AlertStatus } from './alerts/alertTypes';
import { alertStorage } from './alerts/alertStorage';
import { alertLogger } from './alerts/alertLogger';
import { alertFilters } from './alerts/alertFilters';
import { alertFactory } from './alerts/alertFactory';

// Re-export types for backward compatibility
export type { SecurityAlert, AlertType, AlertSeverity, AlertStatus };

class SecurityAlertsService {
  createSecurityAlert(
    type: AlertType,
    severity: AlertSeverity,
    description: string,
    userId?: string,
    metadata: Record<string, any> = {}
  ): SecurityAlert {
    const alert = alertFactory.createAlert(type, severity, description, userId, metadata);
    
    alertStorage.addAlert(alert);
    alertLogger.logAlertCreation(alert);

    return alert;
  }

  getSecurityAlerts(status?: AlertStatus): SecurityAlert[] {
    const allAlerts = alertStorage.getAllAlerts();
    
    if (status) {
      return alertFilters.filterByStatus(allAlerts, status);
    }
    
    return allAlerts;
  }

  updateAlertStatus(alertId: string, status: AlertStatus): void {
    alertStorage.updateAlertStatus(alertId, status);
  }

  clearSecurityAlerts(): void {
    alertStorage.clearAllAlerts();
  }

  getAlertsByType(type: AlertType): SecurityAlert[] {
    const allAlerts = alertStorage.getAllAlerts();
    return alertFilters.filterByType(allAlerts, type);
  }

  getAlertsBySeverity(severity: AlertSeverity): SecurityAlert[] {
    const allAlerts = alertStorage.getAllAlerts();
    return alertFilters.filterBySeverity(allAlerts, severity);
  }

  getAlertsByUserId(userId: string): SecurityAlert[] {
    const allAlerts = alertStorage.getAllAlerts();
    return alertFilters.filterByUserId(allAlerts, userId);
  }

  getAlertsByTimeRange(startTime: string, endTime: string): SecurityAlert[] {
    const allAlerts = alertStorage.getAllAlerts();
    return alertFilters.filterByTimeRange(allAlerts, startTime, endTime);
  }
}

export const securityAlertsService = new SecurityAlertsService();
