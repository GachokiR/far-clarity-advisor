
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
  // Enhanced content scanning - in production, this would integrate with antivirus APIs
  try {
    // Skip binary files that we can't safely scan as text
    if (file.type === 'application/pdf' || file.type.startsWith('application/vnd.')) {
      return await scanBinaryFile(file);
    }

    const content = await file.text();
    
    // Enhanced suspicious patterns detection
    const suspiciousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /vbscript:/gi,
      /on\w+\s*=/gi, // Event handlers
      /<iframe/gi,
      /<object/gi,
      /<embed/gi,
      /<form/gi,
      /data:text\/html/gi,
      /eval\s*\(/gi,
      /document\.write/gi,
      /window\.location/gi,
      /%3Cscript/gi, // URL encoded
      /\.\.\/\.\.\//g, // Path traversal
      /\x00/g, // Null bytes
      /<!ENTITY/gi, // XML entities
      /\$\{.*\}/g, // Template literals
      /exec\s*\(/gi, // Command execution
      /system\s*\(/gi
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(content)) {
        console.warn(`Suspicious pattern detected in file ${file.name}:`, pattern);
        return false;
      }
    }

    // Check file size vs content ratio (potential steganography detection)
    const contentSize = new Blob([content]).size;
    if (file.size > contentSize * 3) {
      console.warn(`File size anomaly detected in ${file.name}: file=${file.size}, content=${contentSize}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error scanning file content:', error);
    // If we can't read the file content, be more cautious
    return file.size < 1024 * 1024; // Only allow small files if we can't scan them
  }
};

const scanBinaryFile = async (file: File): Promise<boolean> => {
  // For binary files, we do basic header validation
  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Check for known safe file signatures
    const fileSignatures = {
      pdf: [0x25, 0x50, 0x44, 0x46], // %PDF
      docx: [0x50, 0x4B, 0x03, 0x04], // ZIP signature (DOCX is ZIP-based)
      doc: [0xD0, 0xCF, 0x11, 0xE0] // MS Office old format
    };
    
    let validSignature = false;
    for (const [type, signature] of Object.entries(fileSignatures)) {
      if (signature.every((byte, index) => uint8Array[index] === byte)) {
        validSignature = true;
        break;
      }
    }
    
    if (!validSignature) {
      console.warn(`Invalid file signature for ${file.name}`);
      return false;
    }
    
    // Check for embedded executables in binary files
    const suspiciousBinaryPatterns = [
      [0x4D, 0x5A], // MZ header (Windows executable)
      [0x7F, 0x45, 0x4C, 0x46], // ELF header (Linux executable)
      [0xFE, 0xED, 0xFA], // Mach-O header (macOS executable)
    ];
    
    for (let i = 0; i < uint8Array.length - 4; i++) {
      for (const pattern of suspiciousBinaryPatterns) {
        if (pattern.every((byte, index) => uint8Array[i + index] === byte)) {
          console.warn(`Suspicious binary pattern detected in ${file.name}`);
          return false;
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error scanning binary file:', error);
    return false;
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
