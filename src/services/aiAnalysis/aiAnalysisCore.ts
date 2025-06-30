
import { supabase } from '@/integrations/supabase/client';
import { validateDocumentContent, validateDocumentName } from '@/utils/inputValidation';
import { aiAnalysisRateLimiter } from '@/utils/rateLimiting';
import { sanitizeError, handleApiError } from '@/utils/errorSanitizer';
import { logger } from '@/utils/productionLogger';
import { logSuspiciousActivity } from '@/utils/securityLogger';
import { AIAnalysisResult } from '@/types/aiAnalysis';

export const runAIAnalysis = async (documentContent: string, documentName: string, documentId?: string) => {
  try {
    // Get current user for rate limiting
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User must be authenticated');
    }

    logger.info('Starting AI analysis', { documentName, userId: user.id }, 'AIAnalysisService');

    // Rate limiting check
    if (!aiAnalysisRateLimiter.isAllowed(user.id)) {
      const resetTime = aiAnalysisRateLimiter.getResetTime(user.id);
      const resetDate = new Date(resetTime).toLocaleTimeString();
      throw new Error(`Rate limit exceeded. Try again after ${resetDate}`);
    }

    // Validate and sanitize inputs
    const contentValidation = validateDocumentContent(documentContent);
    if (!contentValidation.isValid) {
      throw new Error(`Invalid document content: ${contentValidation.errors.join(', ')}`);
    }

    const nameValidation = validateDocumentName(documentName);
    if (!nameValidation.isValid) {
      throw new Error(`Invalid document name: ${nameValidation.errors.join(', ')}`);
    }

    // Additional content security checks
    if (contentValidation.sanitizedValue.length < 100) {
      throw new Error('Document content is too short for meaningful analysis (minimum 100 characters)');
    }

    // Check for potentially sensitive information patterns
    const sensitivePatterns = [
      /\b\d{3}-\d{2}-\d{4}\b/, // SSN pattern
      /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/, // Credit card pattern
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g // Email pattern (multiple)
    ];

    const emailMatches = contentValidation.sanitizedValue.match(sensitivePatterns[2]);
    if (emailMatches && emailMatches.length > 5) {
      logger.warn('Document contains multiple email addresses - potential PII risk', { documentName, userId: user.id }, 'AIAnalysisService');
      logSuspiciousActivity(user.id, 'multiple_emails_in_document', { documentName, emailCount: emailMatches.length });
    }

    const { data, error } = await supabase.functions.invoke('ai-compliance-analysis', {
      body: {
        documentContent: contentValidation.sanitizedValue,
        documentName: nameValidation.sanitizedValue,
        documentId
      }
    });

    if (error) {
      logger.error('AI Analysis Error', error, 'AIAnalysisService', user.id);
      throw new Error('Failed to process document analysis. Please try again.');
    }

    logger.info('AI analysis completed successfully', { documentName, userId: user.id }, 'AIAnalysisService');
    return data;
  } catch (error: any) {
    return Promise.reject(handleApiError(error, 'runAIAnalysis'));
  }
};

export const getAIAnalysisResults = async (): Promise<AIAnalysisResult[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated');
    }

    const { data, error } = await supabase
      .from('ai_analysis_results')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    throw handleApiError(error, 'getAIAnalysisResults');
  }
};
