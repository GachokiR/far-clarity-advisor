
import { SecurityAlert, AlertStatus } from './alertTypes';
import { logger } from '@/utils/productionLogger';

export class AlertStorage {
  private securityAlerts: SecurityAlert[] = [];

  addAlert(alert: SecurityAlert): void {
    this.securityAlerts.push(alert);
  }

  getAllAlerts(): SecurityAlert[] {
    return [...this.securityAlerts];
  }

  updateAlertStatus(alertId: string, status: AlertStatus): boolean {
    const alertIndex = this.securityAlerts.findIndex(alert => alert.id === alertId);
    if (alertIndex !== -1) {
      this.securityAlerts[alertIndex].status = status;
      logger.info('Security alert status updated', { alertId, status }, 'AlertStorage');
      return true;
    }
    return false;
  }

  clearAllAlerts(): void {
    this.securityAlerts = [];
    logger.info('Security alerts cleared', {}, 'AlertStorage');
  }

  getAlertCount(): number {
    return this.securityAlerts.length;
  }
}

export const alertStorage = new AlertStorage();
