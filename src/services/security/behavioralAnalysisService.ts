
import { logger } from '@/utils/productionLogger';
import { BehavioralPattern } from './behavioral/behavioralPatterns';
import { threatPatternAnalyzer } from './behavioral/threatPatternAnalyzer';
import { behavioralDataStore } from './behavioral/behavioralDataStore';
import { behavioralAlertsManager } from './behavioral/behavioralAlertsManager';

// Re-export types for backward compatibility
export type { BehavioralPattern };

class BehavioralAnalysisService {
  analyzeBehavioralPattern(userId: string, actions: string[]): BehavioralPattern {
    // Analyze the pattern
    const behavioralPattern = threatPatternAnalyzer.analyzeThreatPattern(userId, actions);

    // Store the pattern
    behavioralDataStore.addPattern(behavioralPattern);

    // Process alerts if needed
    behavioralAlertsManager.processAlert(behavioralPattern);

    return behavioralPattern;
  }

  getBehavioralPatterns(userId?: string): BehavioralPattern[] {
    return behavioralDataStore.getPatterns(userId);
  }

  clearBehavioralPatterns(): void {
    behavioralDataStore.clearPatterns();
    logger.info('Behavioral patterns cleared', {}, 'BehavioralAnalysisService');
  }

  // Additional utility methods
  getAnomalousPatterns(): BehavioralPattern[] {
    return behavioralDataStore.getAnomalousPatterns();
  }

  getSuspiciousPatterns(): BehavioralPattern[] {
    return behavioralDataStore.getSuspiciousPatterns();
  }

  getPatternCount(): number {
    return behavioralDataStore.getPatternCount();
  }
}

export const behavioralAnalysisService = new BehavioralAnalysisService();
