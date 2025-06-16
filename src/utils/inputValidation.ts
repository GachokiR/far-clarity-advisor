
import DOMPurify from 'isomorphic-dompurify';

export interface ValidationResult {
  isValid: boolean;
  sanitizedValue: string;
  errors: string[];
}

export const validateAndSanitizeText = (
  input: string,
  maxLength: number = 10000,
  allowHTML: boolean = false
): ValidationResult => {
  const errors: string[] = [];
  
  // Basic validation
  if (!input || typeof input !== 'string') {
    return {
      isValid: false,
      sanitizedValue: '',
      errors: ['Input must be a valid string']
    };
  }

  // Length validation
  if (input.length > maxLength) {
    errors.push(`Input exceeds maximum length of ${maxLength} characters`);
  }

  // Check for potential XSS patterns
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
    /<link/gi
  ];

  const hasXSSPatterns = xssPatterns.some(pattern => pattern.test(input));
  if (hasXSSPatterns && !allowHTML) {
    errors.push('Input contains potentially dangerous content');
  }

  // Sanitize the input
  let sanitizedValue: string;
  if (allowHTML) {
    // Allow basic HTML but sanitize dangerous elements
    sanitizedValue = DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li'],
      ALLOWED_ATTR: []
    });
  } else {
    // Strip all HTML
    sanitizedValue = DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  }

  // Trim whitespace
  sanitizedValue = sanitizedValue.trim();

  return {
    isValid: errors.length === 0 && sanitizedValue.length > 0,
    sanitizedValue,
    errors
  };
};

export const validateDocumentContent = (content: string): ValidationResult => {
  // More lenient validation for document content
  return validateAndSanitizeText(content, 500000, false); // 500KB limit
};

export const validateDocumentName = (name: string): ValidationResult => {
  const result = validateAndSanitizeText(name, 255, false);
  
  // Additional filename validation
  const invalidChars = /[<>:"/\\|?*\x00-\x1f]/g;
  if (invalidChars.test(name)) {
    result.errors.push('Filename contains invalid characters');
    result.isValid = false;
  }

  return result;
};

export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const result = validateAndSanitizeText(email, 254, false);
  
  if (result.isValid && !emailRegex.test(result.sanitizedValue)) {
    result.errors.push('Invalid email format');
    result.isValid = false;
  }

  return result;
};

export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      sanitizedValue: '',
      errors: ['Password is required']
    };
  }

  // Password strength requirements
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    sanitizedValue: password, // Don't sanitize passwords
    errors
  };
};
