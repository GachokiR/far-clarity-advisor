
import { SecurityAlert, AlertType, AlertSeverity } from './alertTypes';

export class AlertFactory {
  createAlert(
    type: AlertType,
    severity: AlertSeverity,
    description: string,
    userId?: string,
    metadata: Record<string, any> = {}
  ): SecurityAlert {
    return {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      severity,
      description,
      userId,
      metadata,
      timestamp: new Date().toISOString(),
      status: 'open'
    };
  }
}

export const alertFactory = new AlertFactory();
