
interface SanitizedError {
  message: string;
  code?: string;
  timestamp: string;
  id: string;
}

const SENSITIVE_PATTERNS = [
  /password/i,
  /token/i,
  /secret/i,
  /key/i,
  /api[_-]?key/i,
  /authorization/i,
  /bearer/i,
  /session/i,
  /cookie/i,
  /credential/i
];

const GENERIC_ERROR_MESSAGES = {
  authentication: 'Authentication failed. Please check your credentials.',
  authorization: 'You are not authorized to perform this action.',
  validation: 'The provided data is invalid. Please check your input.',
  network: 'A network error occurred. Please try again.',
  server: 'An internal server error occurred. Please try again later.',
  rateLimit: 'Too many requests. Please wait before trying again.',
  notFound: 'The requested resource was not found.',
  default: 'An unexpected error occurred. Please try again.'
};

export const sanitizeError = (error: any): SanitizedError => {
  const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const timestamp = new Date().toISOString();

  // If it's not an error object, create a generic one
  if (!error || typeof error !== 'object') {
    return {
      message: GENERIC_ERROR_MESSAGES.default,
      id: errorId,
      timestamp
    };
  }

  let message = error.message || error.toString() || 'Unknown error';
  
  // Check if the error message contains sensitive information
  const containsSensitiveInfo = SENSITIVE_PATTERNS.some(pattern => 
    pattern.test(message)
  );

  if (containsSensitiveInfo) {
    message = GENERIC_ERROR_MESSAGES.default;
  }

  // Map common error types to user-friendly messages
  if (message.toLowerCase().includes('invalid login') || 
      message.toLowerCase().includes('authentication')) {
    message = GENERIC_ERROR_MESSAGES.authentication;
  } else if (message.toLowerCase().includes('unauthorized') || 
             message.toLowerCase().includes('forbidden')) {
    message = GENERIC_ERROR_MESSAGES.authorization;
  } else if (message.toLowerCase().includes('validation') || 
             message.toLowerCase().includes('invalid')) {
    message = GENERIC_ERROR_MESSAGES.validation;
  } else if (message.toLowerCase().includes('network') || 
             message.toLowerCase().includes('fetch')) {
    message = GENERIC_ERROR_MESSAGES.network;
  } else if (message.toLowerCase().includes('rate limit') || 
             message.toLowerCase().includes('too many')) {
    message = GENERIC_ERROR_MESSAGES.rateLimit;
  } else if (message.toLowerCase().includes('not found') || 
             message.toLowerCase().includes('404')) {
    message = GENERIC_ERROR_MESSAGES.notFound;
  } else if (message.toLowerCase().includes('server error') || 
             message.toLowerCase().includes('500')) {
    message = GENERIC_ERROR_MESSAGES.server;
  }

  return {
    message,
    code: error.code,
    id: errorId,
    timestamp
  };
};

export const createErrorReport = (error: any, context?: Record<string, any>) => {
  const sanitizedError = sanitizeError(error);
  
  return {
    ...sanitizedError,
    context: context ? sanitizeContext(context) : undefined,
    userAgent: navigator.userAgent,
    url: window.location.href,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  };
};

const sanitizeContext = (context: Record<string, any>): Record<string, any> => {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(context)) {
    const isSensitive = SENSITIVE_PATTERNS.some(pattern => 
      pattern.test(key)
    );
    
    if (isSensitive) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeContext(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

export const handleApiError = (error: any, operation: string) => {
  const sanitized = sanitizeError(error);
  
  // Log to monitoring service
  const errorReport = createErrorReport(error, { operation });
  
  // In production, send to error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Send to error tracking service like Sentry
    console.error('API Error:', errorReport);
  }
  
  return sanitized;
};
