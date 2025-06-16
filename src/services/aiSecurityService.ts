
import { supabase } from '@/lib/supabase';
import { validateDocumentContent } from '@/utils/inputValidation';
import { logger } from '@/utils/productionLogger';
import { logSuspiciousActivity, securityLogger } from '@/utils/securityLogger';

export interface ThreatDetectionResult {
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  threats: string[];
  confidence: number;
  recommendations: string[];
}

export interface BehavioralPattern {
  userId: string;
  pattern: 'normal' | 'suspicious' | 'anomalous';
  riskScore: number;
  activities: string[];
  timestamp: string;
}

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

class AISecurityService {
  private behavioralPatterns: BehavioralPattern[] = [];
  private securityAlerts: SecurityAlert[] = [];

  async analyzeContentSecurity(content: string, fileName: string): Promise<ThreatDetectionResult> {
    try {
      logger.info('Starting AI content security analysis', { fileName }, 'AISecurityService');

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
      logger.error('AI security analysis failed', error, 'AISecurityService');
      throw error;
    }
  }

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

  createSecurityAlert(
    type: SecurityAlert['type'],
    severity: SecurityAlert['severity'],
    description: string,
    userId?: string,
    metadata: Record<string, any> = {}
  ): SecurityAlert {
    const alert: SecurityAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      severity,
      description,
      userId,
      metadata,
      timestamp: new Date().toISOString(),
      status: 'open'
    };

    this.securityAlerts.push(alert);

    // Log to security system
    securityLogger.logEvent({
      type: 'suspicious_activity',
      userId,
      details: {
        alertId: alert.id,
        alertType: type,
        description,
        metadata
      },
      severity: severity === 'critical' ? 'critical' : severity === 'high' ? 'high' : 'medium'
    });

    logger.warn('Security alert created', alert, 'AISecurityService');

    return alert;
  }

  getSecurityAlerts(status?: SecurityAlert['status']): SecurityAlert[] {
    if (status) {
      return this.securityAlerts.filter(alert => alert.status === status);
    }
    return [...this.securityAlerts];
  }

  updateAlertStatus(alertId: string, status: SecurityAlert['status']) {
    const alertIndex = this.securityAlerts.findIndex(alert => alert.id === alertId);
    if (alertIndex !== -1) {
      this.securityAlerts[alertIndex].status = status;
      logger.info('Security alert status updated', { alertId, status }, 'AISecurityService');
    }
  }

  getBehavioralPatterns(userId?: string): BehavioralPattern[] {
    if (userId) {
      return this.behavioralPatterns.filter(pattern => pattern.userId === userId);
    }
    return [...this.behavioralPatterns];
  }

  async generateComplianceReport(type: 'gdpr' | 'soc2' | 'hipaa') {
    const events = securityLogger.getEvents();
    const alerts = this.getSecurityAlerts();

    const report = {
      type,
      generatedAt: new Date().toISOString(),
      summary: {
        totalSecurityEvents: events.length,
        criticalAlerts: alerts.filter(a => a.severity === 'critical').length,
        openIncidents: alerts.filter(a => a.status === 'open').length,
        complianceScore: this.calculateComplianceScore(type, events, alerts)
      },
      details: {
        securityEvents: events.slice(-50), // Last 50 events
        securityAlerts: alerts,
        recommendations: this.getComplianceRecommendations(type)
      }
    };

    logger.info('Compliance report generated', { type, score: report.summary.complianceScore }, 'AISecurityService');
    return report;
  }

  private calculateComplianceScore(
    type: string, 
    events: any[], 
    alerts: SecurityAlert[]
  ): number {
    // Simple compliance scoring algorithm
    let score = 100;
    
    // Deduct for security incidents
    score -= alerts.filter(a => a.severity === 'critical').length * 10;
    score -= alerts.filter(a => a.severity === 'high').length * 5;
    score -= alerts.filter(a => a.status === 'open').length * 3;

    // Deduct for security events
    const criticalEvents = events.filter(e => e.severity === 'critical').length;
    score -= criticalEvents * 2;

    return Math.max(0, Math.min(100, score));
  }

  private getComplianceRecommendations(type: string): string[] {
    const baseRecommendations = [
      'Regular security audits and assessments',
      'Employee security training programs',
      'Incident response plan updates',
      'Access control reviews'
    ];

    const typeSpecific = {
      gdpr: [
        'Data processing consent management',
        'Right to be forgotten implementation',
        'Data portability features',
        'Privacy impact assessments'
      ],
      soc2: [
        'Continuous monitoring implementation',
        'Change management procedures',
        'Vendor risk assessments',
        'System availability monitoring'
      ],
      hipaa: [
        'PHI encryption at rest and in transit',
        'Audit log retention policies',
        'Business associate agreements',
        'Risk assessment documentation'
      ]
    };

    return [...baseRecommendations, ...(typeSpecific[type] || [])];
  }
}

export const aiSecurityService = new AISecurityService();
