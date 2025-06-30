
import { logger } from './productionLogger';

const isDevelopment = import.meta.env.DEV;
const isDebugMode = isDevelopment && localStorage.getItem('debug-mode') === 'true';

interface Timer {
  start: number;
  label: string;
  end: (message?: string) => void;
}

class DebugLogger {
  private timers: Map<string, number> = new Map();

  private formatMessage(level: string, component: string, message: string): string {
    const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
    return `[${timestamp}] [${level.toUpperCase()}] [${component}] ${message}`;
  }

  private getColors() {
    return {
      log: '#2563eb', // blue
      warn: '#d97706', // amber
      error: '#dc2626', // red
      auth: '#7c3aed', // purple
      demo: '#059669', // emerald
      data: '#0891b2', // cyan
    };
  }

  log(message: string, data?: any, component: string = 'App') {
    if (isDevelopment) {
      const formatted = this.formatMessage('log', component, message);
      console.log(
        `%c${formatted}`,
        `color: ${this.getColors().log}; font-weight: bold;`,
        data || ''
      );
      logger.debug(message, data, component);
    }
  }

  warn(message: string, data?: any, component: string = 'App') {
    if (isDevelopment) {
      const formatted = this.formatMessage('warn', component, message);
      console.warn(
        `%c${formatted}`,
        `color: ${this.getColors().warn}; font-weight: bold;`,
        data || ''
      );
      logger.warn(message, data, component);
    }
  }

  error(message: string, error?: any, component: string = 'App') {
    if (isDevelopment) {
      const formatted = this.formatMessage('error', component, message);
      console.error(
        `%c${formatted}`,
        `color: ${this.getColors().error}; font-weight: bold;`,
        error || ''
      );
      if (error?.stack) {
        console.error('Stack trace:', error.stack);
      }
      logger.error(message, error, component);
    }
  }

  auth(message: string, data?: any) {
    if (isDevelopment) {
      const formatted = this.formatMessage('auth', 'AUTH', message);
      console.log(
        `%c${formatted}`,
        `color: ${this.getColors().auth}; font-weight: bold;`,
        data || ''
      );
      logger.debug(message, data, 'AUTH');
    }
  }

  demo(message: string, data?: any) {
    if (isDevelopment) {
      const formatted = this.formatMessage('demo', 'DEMO', message);
      console.log(
        `%c${formatted}`,
        `color: ${this.getColors().demo}; font-weight: bold;`,
        data || ''
      );
      logger.debug(message, data, 'DEMO');
    }
  }

  data(message: string, data?: any) {
    if (isDevelopment) {
      const formatted = this.formatMessage('data', 'DATA', message);
      console.log(
        `%c${formatted}`,
        `color: ${this.getColors().data}; font-weight: bold;`,
        data || ''
      );
      logger.debug(message, data, 'DATA');
    }
  }

  startTimer(label: string): Timer {
    const start = performance.now();
    this.timers.set(label, start);
    
    return {
      start,
      label,
      end: (message?: string) => {
        const end = performance.now();
        const duration = end - start;
        const endMessage = message || `${label} completed`;
        this.log(`${endMessage} (${duration.toFixed(2)}ms)`, { duration, label }, 'TIMER');
        this.timers.delete(label);
      }
    };
  }

  createLogger(component: string) {
    return {
      log: (message: string, data?: any) => this.log(message, data, component),
      warn: (message: string, data?: any) => this.warn(message, data, component),
      error: (message: string, error?: any) => this.error(message, error, component),
    };
  }

  inspect(obj: any, label?: string) {
    if (isDevelopment) {
      const inspectLabel = label || 'Object inspection';
      console.group(`%c${inspectLabel}`, 'color: #6366f1; font-weight: bold;');
      console.table(obj);
      console.groupEnd();
    }
  }

  group(label: string, fn: () => void) {
    if (isDevelopment) {
      console.group(`%c${label}`, 'color: #8b5cf6; font-weight: bold;');
      fn();
      console.groupEnd();
    }
  }
}

export const debug = new DebugLogger();
