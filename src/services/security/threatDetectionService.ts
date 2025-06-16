
import { validateDocumentContent } from '@/utils/inputValidation';
import { logger } from '@/utils/productionLogger';

export interface ThreatDetectionResult {
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  threats: string[];
  confidence: number;
  recommendations: string[];
}

class ThreatDetectionService {
  async analyzeContentSecurity(content: string, fileName: string): Promise<ThreatDetectionResult> {
    try {
      logger.info('Starting AI content security analysis', { fileName }, 'ThreatDetectionService');

      // Basic threat patterns
      const threatPatterns = [
        { pattern: /<script.*?>.*?<\/script>/gi, threat: 'XSS Script Injection', level: 'critical' as const },
        { pattern: /javascript:/gi, threat: 'JavaScript Protocol', level: 'high' as const },
        { pattern: /data:.*base64/gi, threat: 'Base64 Data URI', level: 'medium' as const },
        { pattern: /\b(?:SELECT|INSERT|UPDATE|DELETE|DROP|UNION)\b.*?\b(?:FROM|INTO|SET|WHERE)\b/gi, threat: 'SQL Injection Pattern', level: 'high' as const },
        { pattern: /\$\{.*?\}/g, threat: 'Template Injection', level: 'medium' as const },
        { pattern: /eval\s*\(/gi, threat: 'Code Evaluation', level: 'critical' as const },
        { pattern: /\.\.\/.*\.\./g, threat: 'Directory Traversal', level: 'high' as const }
      ];

      const detectedThreats: { threat: string; level: 'low' | 'medium' | 'high' | 'critical' }[] = [];
      
      for (const { pattern, threat, level } of threatPatterns) {
        if (pattern.test(content)) {
          detectedThreats.push({ threat, level });
        }
      }

      // Calculate overall threat level
      const maxThreatLevel = detectedThreats.reduce((max, current) => {
        const levels = { low: 1, medium: 2, high: 3, critical: 4 };
        return levels[current.level] > levels[max] ? current.level : max;
      }, 'low' as const);

      const confidence = detectedThreats.length > 0 ? Math.min(0.9, 0.5 + (detectedThreats.length * 0.1)) : 0.1;

      const recommendations = [];
      if (detectedThreats.length > 0) {
        recommendations.push('Quarantine file for manual review');
        recommendations.push('Scan with additional security tools');
        recommendations.push('Notify security team');
      }

      return {
        threatLevel: maxThreatLevel,
        threats: detectedThreats.map(t => t.threat),
        confidence,
        recommendations
      };
    } catch (error) {
      logger.error('AI security analysis failed', error, 'ThreatDetectionService');
      throw error;
    }
  }
}

export const threatDetectionService = new ThreatDetectionService();
