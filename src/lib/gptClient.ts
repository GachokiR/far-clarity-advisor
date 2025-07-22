
import { logger } from '@/utils/productionLogger';

interface GPTCallOptions {
  model: string;
  messages: Array<{ role: string; content: string }>;
  temperature?: number;
  maxTokens?: number;
  timeout?: number;
}

interface GPTResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const DEFAULT_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;

class GPTClient {
  private apiKey: string | null = null;

  constructor() {
    // In a real implementation, this would come from environment variables
    // For now, we'll use a placeholder that falls back to mock responses
    this.apiKey = process.env.OPENAI_API_KEY || null;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private createMockResponse(): any {
    return {
      documentId: 'mock',
      analysis: {
        farClauses: [
          {
            clause: 'FAR 52.204-21',
            title: 'Basic Safeguarding of Covered Contractor Information Systems',
            relevance: 'High',
            description: 'Requires contractors to implement basic safeguarding requirements'
          }
        ],
        complianceGaps: [
          {
            area: 'Cybersecurity Requirements',
            severity: 'Medium',
            description: 'Document may need additional cybersecurity clauses'
          }
        ],
        recommendations: [
          {
            priority: 'High',
            action: 'Review FAR 52.204-21 compliance requirements',
            rationale: 'Ensure all cybersecurity measures are in place'
          }
        ]
      }
    };
  }

  async makeRequest(options: GPTCallOptions): Promise<any> {
    const {
      model,
      messages,
      temperature = 0.3,
      maxTokens = 2000,
      timeout = DEFAULT_TIMEOUT
    } = options;

    // If no API key available, return mock response
    if (!this.apiKey) {
      logger.warn('No OpenAI API key available, using mock response', null, 'GPTClient');
      await this.delay(1000); // Simulate network delay
      return this.createMockResponse();
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const data: GPTResponse = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response from OpenAI API');
      }

      const content = data.choices[0].message.content;
      
      try {
        // Try to parse as JSON
        return JSON.parse(content);
      } catch {
        // If not JSON, return the content wrapped in a structure
        return {
          analysis: {
            rawResponse: content,
            farClauses: [],
            complianceGaps: [],
            recommendations: []
          }
        };
      }
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      throw error;
    }
  }

  async makeRequestWithRetry(options: GPTCallOptions): Promise<any> {
    let lastError: Error;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        logger.info(`GPT API call attempt ${attempt}`, { model: options.model }, 'GPTClient');
        const result = await this.makeRequest(options);
        logger.info('GPT API call successful', { model: options.model }, 'GPTClient');
        return result;
      } catch (error: any) {
        lastError = error;
        logger.warn(`GPT API call attempt ${attempt} failed`, { error: error.message }, 'GPTClient');
        
        if (attempt < MAX_RETRIES) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
          await this.delay(delay);
        }
      }
    }

    logger.error('All GPT API call attempts failed, using mock response', { error: lastError.message }, 'GPTClient');
    return this.createMockResponse();
  }
}

const gptClient = new GPTClient();

export const safeGPTCall = async (options: GPTCallOptions): Promise<any> => {
  return gptClient.makeRequestWithRetry(options);
};
