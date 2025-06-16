
import { BehavioralPattern } from './behavioralPatterns';
import { logger } from '@/utils/productionLogger';

export class BehavioralDataStore {
  private behavioralPatterns: BehavioralPattern[] = [];

  addPattern(pattern: BehavioralPattern): void {
    this.behavioralPatterns.push(pattern);
  }

  getPatterns(userId?: string): BehavioralPattern[] {
    if (userId) {
      return this.behavioralPatterns.filter(pattern => pattern.userId === userId);
    }
    return [...this.behavioralPatterns];
  }

  clearPatterns(): void {
    this.behavioralPatterns = [];
    logger.info('Behavioral patterns cleared', {}, 'BehavioralDataStore');
  }

  getPatternCount(): number {
    return this.behavioralPatterns.length;
  }

  getAnomalousPatterns(): BehavioralPattern[] {
    return this.behavioralPatterns.filter(pattern => pattern.pattern === 'anomalous');
  }

  getSuspiciousPatterns(): BehavioralPattern[] {
    return this.behavioralPatterns.filter(pattern => pattern.pattern === 'suspicious');
  }
}

export const behavioralDataStore = new BehavioralDataStore();
