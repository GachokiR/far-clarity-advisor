export interface SecurityEvent {
  type: 'auth_attempt' | 'auth_success' | 'auth_failure' | 'session_timeout' | 'suspicious_activity' | 'rate_limit_exceeded';
  userId?: string;
  details: Record<string, any>;
  timestamp: string;
  userAgent: string;
  ipAddress?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

class SecurityLogger {
  private events: SecurityEvent[] = [];
  private maxEvents = 100;

  logEvent(event: Omit<SecurityEvent, 'timestamp' | 'userAgent'>) {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };

    this.events.push(securityEvent);

    // Keep only recent events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Store in localStorage for now (in production, send to monitoring service)
    try {
      localStorage.setItem('security_events', JSON.stringify(this.events));
    } catch (error) {
      // Silent fail for storage errors
    }

    // Log high/critical severity events immediately
    if (event.severity === 'high' || event.severity === 'critical') {
      this.alertSecurityTeam(securityEvent);
    }
  }

  private alertSecurityTeam(event: SecurityEvent) {
    // In production, this would send alerts to security team
    if (process.env.NODE_ENV === 'development') {
      console.warn('SECURITY ALERT:', event);
    }
  }

  getEvents(): SecurityEvent[] {
    return [...this.events];
  }

  getEventsByType(type: SecurityEvent['type']): SecurityEvent[] {
    return this.events.filter(event => event.type === type);
  }

  getEventsBySeverity(severity: SecurityEvent['severity']): SecurityEvent[] {
    return this.events.filter(event => event.severity === severity);
  }

  clearEvents() {
    this.events = [];
    localStorage.removeItem('security_events');
  }
}

export const securityLogger = new SecurityLogger();

// Utility functions for common security events
export const logAuthAttempt = (email: string, success: boolean, details?: Record<string, any>) => {
  securityLogger.logEvent({
    type: success ? 'auth_success' : 'auth_failure',
    details: {
      email: email.replace(/(.{2}).*(@.*)/, '$1***$2'), // Partially mask email
      ...details
    },
    severity: success ? 'low' : 'medium'
  });
};

export const logSuspiciousActivity = (userId: string, activity: string, details?: Record<string, any>) => {
  securityLogger.logEvent({
    type: 'suspicious_activity',
    userId,
    details: {
      activity,
      ...details
    },
    severity: 'high'
  });
};

export const logRateLimitExceeded = (identifier: string, endpoint?: string) => {
  securityLogger.logEvent({
    type: 'rate_limit_exceeded',
    details: {
      identifier,
      endpoint
    },
    severity: 'medium'
  });
};

export const logSessionTimeout = (userId: string) => {
  securityLogger.logEvent({
    type: 'session_timeout',
    userId,
    details: {
      reason: 'inactivity'
    },
    severity: 'low'
  });
};
