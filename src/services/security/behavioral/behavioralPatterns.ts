
export interface BehavioralPattern {
  userId: string;
  pattern: 'normal' | 'suspicious' | 'anomalous';
  riskScore: number;
  activities: string[];
  timestamp: string;
}

export interface BehavioralAnalysisResult {
  pattern: BehavioralPattern;
  isAnomalous: boolean;
  shouldAlert: boolean;
}
