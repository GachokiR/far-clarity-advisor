
import { validateDocumentName } from './inputValidation';

export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedFile?: File;
}

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const DANGEROUS_EXTENSIONS = ['.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js', '.jar', '.php', '.asp', '.jsp'];

export const validateFileUpload = (file: File): FileValidationResult => {
  const errors: string[] = [];

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    errors.push(`File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
  }

  // Check file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    errors.push(`File type '${file.type}' is not allowed`);
  }

  // Check file extension
  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  if (DANGEROUS_EXTENSIONS.includes(extension)) {
    errors.push(`File extension '${extension}' is not allowed for security reasons`);
  }

  // Validate filename
  const nameValidation = validateDocumentName(file.name);
  if (!nameValidation.isValid) {
    errors.push(...nameValidation.errors);
  }

  // Check for null bytes in filename (path traversal protection)
  if (file.name.includes('\0')) {
    errors.push('Invalid characters in filename');
  }

  // Check for directory traversal attempts
  if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
    errors.push('Invalid path characters in filename');
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedFile: errors.length === 0 ? file : undefined
  };
};

export const scanFileContent = async (file: File): Promise<boolean> => {
  // Basic content scanning - in production, this would integrate with antivirus APIs
  try {
    const content = await file.text();
    
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /vbscript:/i,
      /onload=/i,
      /onclick=/i,
      /onerror=/i,
      /%3Cscript/i
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(content)) {
        return false;
      }
    }

    return true;
  } catch (error) {
    // If we can't read the file content, assume it's safe for binary files
    return true;
  }
};

export const generateSafeFilename = (originalName: string): string => {
  // Remove dangerous characters and generate a safe filename
  const extension = originalName.substring(originalName.lastIndexOf('.'));
  const baseName = originalName.substring(0, originalName.lastIndexOf('.'));
  
  // Sanitize the base name
  const safeName = baseName
    .replace(/[^a-zA-Z0-9\-_]/g, '_')
    .substring(0, 50); // Limit length
  
  // Add timestamp to ensure uniqueness
  const timestamp = Date.now();
  
  return `${safeName}_${timestamp}${extension}`;
};

export const createFileUploadPolicy = () => {
  return {
    maxFileSize: MAX_FILE_SIZE,
    allowedTypes: ALLOWED_FILE_TYPES,
    maxFiles: 10,
    enableVirusScanning: true,
    enableContentScanning: true,
    quarantineOnSuspicious: true
  };
};
