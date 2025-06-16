
import { logger } from '@/utils/productionLogger';
import { logSuspiciousActivity } from '@/utils/securityLogger';

export interface BehavioralPattern {
  userId: string;
  pattern: 'normal' | 'suspicious' | 'anomalous';
  riskScore: number;
  activities: string[];
  timestamp: string;
}

class BehavioralAnalysisService {
  private behavioralPatterns: BehavioralPattern[] = [];

  analyzeBehavioralPattern(userId: string, actions: string[]): BehavioralPattern {
    const suspiciousActions = [
      'rapid_file_uploads',
      'multiple_failed_logins',
      'unusual_access_times',
      'large_data_downloads',
      'admin_privilege_escalation',
      'bulk_data_access'
    ];

    const suspiciousCount = actions.filter(action => 
      suspiciousActions.some(suspicious => action.includes(suspicious))
    ).length;

    const riskScore = Math.min(100, (suspiciousCount / actions.length) * 100);
    
    let pattern: 'normal' | 'suspicious' | 'anomalous' = 'normal';
    if (riskScore > 70) pattern = 'anomalous';
    else if (riskScore > 30) pattern = 'suspicious';

    const behavioralPattern: BehavioralPattern = {
      userId,
      pattern,
      riskScore,
      activities: actions,
      timestamp: new Date().toISOString()
    };

    this.behavioralPatterns.push(behavioralPattern);

    // Log suspicious behavior
    if (pattern !== 'normal') {
      logSuspiciousActivity(userId, `behavioral_pattern_${pattern}`, {
        riskScore,
        activities: actions.slice(0, 5) // Log first 5 activities
      });
    }

    return behavioralPattern;
  }

  getBehavioralPatterns(userId?: string): BehavioralPattern[] {
    if (userId) {
      return this.behavioralPatterns.filter(pattern => pattern.userId === userId);
    }
    return [...this.behavioralPatterns];
  }

  clearBehavioralPatterns(): void {
    this.behavioralPatterns = [];
    logger.info('Behavioral patterns cleared', {}, 'BehavioralAnalysisService');
  }
}

export const behavioralAnalysisService = new BehavioralAnalysisService();
