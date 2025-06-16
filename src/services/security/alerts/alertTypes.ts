
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

export type AlertType = SecurityAlert['type'];
export type AlertSeverity = SecurityAlert['severity'];
export type AlertStatus = SecurityAlert['status'];
