
import { supabase } from '@/integrations/supabase/client';
import { validateDocumentContent, validateDocumentName } from '@/utils/inputValidation';
import { aiAnalysisRateLimiter } from '@/utils/rateLimiting';
import { sanitizeError, handleApiError } from '@/utils/errorSanitizer';
import { logger } from '@/utils/productionLogger';
import { logSuspiciousActivity } from '@/utils/securityLogger';
import { getCachedAnalysis, setCachedAnalysis } from '@/services/cacheService';
import { truncateToTokenLimit } from '@/utils/tokenLimiter';
import { safeGPTCall } from '@/lib/gptClient';
import { AIAnalysisResult } from '@/types/aiAnalysis';

export const runAIAnalysis = async (documentContent: string, documentName: string, documentId?: string) => {
  let userId = 'unknown';

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User must be authenticated');
    userId = user.id;

    logger.info('Starting AI analysis', { documentName, userId }, 'AIAnalysisService');

    if (!aiAnalysisRateLimiter.isAllowed(user.id)) {
      const resetTime = aiAnalysisRateLimiter.getResetTime(user.id);
      throw new Error(`Rate limit exceeded. Try again after ${new Date(resetTime).toLocaleTimeString()}`);
    }

    const contentValidation = validateDocumentContent(documentContent);
    if (!contentValidation.isValid) throw new Error(`Invalid document content: ${contentValidation.errors.join(', ')}`);

    const nameValidation = validateDocumentName(documentName);
    if (!nameValidation.isValid) throw new Error(`Invalid document name: ${nameValidation.errors.join(', ')}`);

    const sanitized = contentValidation.sanitizedValue;
    if (sanitized.length < 100) throw new Error('Document content too short for meaningful analysis (minimum 100 characters)');

    const sensitivePatterns = {
      ssn: /\b\d{3}-\d{2}-\d{4}\b/,
      creditCard: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/,
      emails: sanitized.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || []
    };

    if (sensitivePatterns.ssn.test(sanitized)) {
      logSuspiciousActivity(userId, 'sensitive_data_detected', { type: 'ssn', documentName });
      throw new Error('Document contains Social Security Numbers');
    }

    if (sensitivePatterns.creditCard.test(sanitized)) {
      logSuspiciousActivity(userId, 'sensitive_data_detected', { type: 'credit_card', documentName });
      throw new Error('Document contains credit card numbers');
    }

    if (sensitivePatterns.emails.length > 5) {
      logger.warn('Document contains multiple email addresses - potential PII risk', { documentName, userId, emailCount: sensitivePatterns.emails.length }, 'AIAnalysisService');
      logSuspiciousActivity(userId, 'multiple_emails_in_document', { documentName, emailCount: sensitivePatterns.emails.length });
    }

    if (documentId) {
      const cached = getCachedAnalysis(documentId);
      if (cached) {
        logger.info('Using cached analysis result', { documentName, userId }, 'AIAnalysisService');
        return cached;
      }
    }

    const truncatedContent = truncateToTokenLimit(sanitized, 3000);

    const prompt = `Analyze the following Federal RFP document content and extract relevant FAR (Federal Acquisition Regulation) clauses. Respond in JSON format with the following structure:
    {
      "farClauses": [
        {
          "clause": "FAR section number",
          "title": "Clause title",
          "relevance": "High/Medium/Low",
          "description": "Brief description of the clause"
        }
      ],
      "complianceGaps": [
        {
          "area": "Compliance area",
          "severity": "High/Medium/Low",
          "description": "Description of the gap"
        }
      ],
      "recommendations": [
        {
          "priority": "High/Medium/Low",
          "action": "Recommended action",
          "rationale": "Explanation for the recommendation"
        }
      ]
    }

    Document Content:
    ${truncatedContent}`;

    let gptResult;
    try {
      // Try direct GPT call first
      gptResult = await safeGPTCall({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3
      });

      logger.info('AI analysis completed successfully via direct GPT call', { documentName, userId }, 'AIAnalysisService');
    } catch (gptError) {
      logger.warn('Direct GPT call failed, falling back to Supabase function', { error: gptError, documentName, userId }, 'AIAnalysisService');
      
      // Fallback to Supabase edge function
      const { data, error } = await supabase.functions.invoke('ai-compliance-analysis', {
        body: {
          documentContent: truncatedContent,
          documentName: nameValidation.sanitizedValue,
          documentId
        }
      });

      if (error) {
        logger.error('Supabase AI Analysis Error', error, 'AIAnalysisService', userId);
        throw new Error('Failed to process document analysis. Please try again.');
      }

      gptResult = data;
      logger.info('AI analysis completed successfully via Supabase function', { documentName, userId }, 'AIAnalysisService');
    }

    const analysisResult = {
      documentId: documentId || 'unknown',
      userId,
      result: gptResult,
      timestamp: new Date().toISOString()
    };

    // Cache the result
    if (documentId) {
      setCachedAnalysis(documentId, analysisResult);
    }

    return analysisResult;

  } catch (error: any) {
    logger.error('AI analysis failed', error, 'AIAnalysisService');
    logSuspiciousActivity(userId, 'ai_analysis_error', { error: error.message, documentName });
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
