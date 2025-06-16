
import { SecurityAlert, AlertType, AlertSeverity, AlertStatus } from './alertTypes';

export class AlertFilters {
  filterByStatus(alerts: SecurityAlert[], status: AlertStatus): SecurityAlert[] {
    return alerts.filter(alert => alert.status === status);
  }

  filterByType(alerts: SecurityAlert[], type: AlertType): SecurityAlert[] {
    return alerts.filter(alert => alert.type === type);
  }

  filterBySeverity(alerts: SecurityAlert[], severity: AlertSeverity): SecurityAlert[] {
    return alerts.filter(alert => alert.severity === severity);
  }

  filterByUserId(alerts: SecurityAlert[], userId: string): SecurityAlert[] {
    return alerts.filter(alert => alert.userId === userId);
  }

  filterByTimeRange(alerts: SecurityAlert[], startTime: string, endTime: string): SecurityAlert[] {
    return alerts.filter(alert => {
      const alertTime = new Date(alert.timestamp);
      return alertTime >= new Date(startTime) && alertTime <= new Date(endTime);
    });
  }
}

export const alertFilters = new AlertFilters();
