type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
  component?: string;
  userId?: string;
}

class ProductionLogger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private logs: LogEntry[] = [];
  private maxLogs = 50;

  private createLogEntry(
    level: LogLevel, 
    message: string, 
    data?: any, 
    component?: string,
    userId?: string
  ): LogEntry {
    return {
      level,
      message,
      data: this.sanitizeData(data),
      timestamp: new Date().toISOString(),
      component,
      userId
    };
  }

  private sanitizeData(data: any): any {
    if (!data) return data;
    
    // Remove sensitive information
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'authorization'];
    
    const sanitize = (obj: any): any => {
      if (typeof obj !== 'object' || obj === null) return obj;
      
      if (Array.isArray(obj)) {
        return obj.map(sanitize);
      }
      
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
          sanitized[key] = '[REDACTED]';
        } else if (typeof value === 'object') {
          sanitized[key] = sanitize(value);
        } else {
          sanitized[key] = value;
        }
      }
      return sanitized;
    };
    
    return sanitize(data);
  }

  private storeLog(entry: LogEntry) {
    this.logs.push(entry);
    
    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // In production, send to logging service
    if (!this.isDevelopment && entry.level === 'error') {
      this.sendToLoggingService(entry);
    }
  }

  private sendToLoggingService(entry: LogEntry) {
    // In production, this would send to a logging service like Sentry, LogRocket, etc.
    // For now, we'll store in localStorage
    try {
      const existingLogs = localStorage.getItem('production_logs');
      const logs = existingLogs ? JSON.parse(existingLogs) : [];
      logs.push(entry);
      
      // Keep only last 20 error logs
      if (logs.length > 20) {
        logs.splice(0, logs.length - 20);
      }
      
      localStorage.setItem('production_logs', JSON.stringify(logs));
    } catch (error) {
      // Silent fail
    }
  }

  info(message: string, data?: any, component?: string, userId?: string) {
    const entry = this.createLogEntry('info', message, data, component, userId);
    this.storeLog(entry);
    
    if (this.isDevelopment) {
      console.info(`[${component || 'App'}] ${message}`, data);
    }
  }

  warn(message: string, data?: any, component?: string, userId?: string) {
    const entry = this.createLogEntry('warn', message, data, component, userId);
    this.storeLog(entry);
    
    if (this.isDevelopment) {
      console.warn(`[${component || 'App'}] ${message}`, data);
    }
  }

  error(message: string, data?: any, component?: string, userId?: string) {
    const entry = this.createLogEntry('error', message, data, component, userId);
    this.storeLog(entry);
    
    if (this.isDevelopment) {
      console.error(`[${component || 'App'}] ${message}`, data);
    }
  }

  debug(message: string, data?: any, component?: string, userId?: string) {
    const entry = this.createLogEntry('debug', message, data, component, userId);
    
    if (this.isDevelopment) {
      this.storeLog(entry);
      console.debug(`[${component || 'App'}] ${message}`, data);
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
    localStorage.removeItem('production_logs');
  }
}

export const logger = new ProductionLogger();
