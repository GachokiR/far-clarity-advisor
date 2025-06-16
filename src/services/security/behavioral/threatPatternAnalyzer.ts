
import { BehavioralPattern } from './behavioralPatterns';

export class ThreatPatternAnalyzer {
  private readonly suspiciousActions = [
    'rapid_file_uploads',
    'multiple_failed_logins',
    'unusual_access_times',
    'large_data_downloads',
    'admin_privilege_escalation',
    'bulk_data_access'
  ];

  analyzeThreatPattern(userId: string, actions: string[]): BehavioralPattern {
    const suspiciousCount = actions.filter(action => 
      this.suspiciousActions.some(suspicious => action.includes(suspicious))
    ).length;

    const riskScore = Math.min(100, (suspiciousCount / actions.length) * 100);
    
    let pattern: 'normal' | 'suspicious' | 'anomalous' = 'normal';
    if (riskScore > 70) pattern = 'anomalous';
    else if (riskScore > 30) pattern = 'suspicious';

    return {
      userId,
      pattern,
      riskScore,
      activities: actions,
      timestamp: new Date().toISOString()
    };
  }

  private getSuspiciousActions(): string[] {
    return [...this.suspiciousActions];
  }
}

export const threatPatternAnalyzer = new ThreatPatternAnalyzer();
