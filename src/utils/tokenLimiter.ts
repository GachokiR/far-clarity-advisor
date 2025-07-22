// Improved token estimation using character analysis
const CHARS_PER_TOKEN = 4; // OpenAI's rough estimation
const DEFAULT_MAX_TOKENS = 3000;

export function truncateToTokenLimit(text: string, maxTokens = 3000): string {
  const estimatedTokens = estimateTokenCount(text);
  
  if (estimatedTokens <= maxTokens) {
    return text;
  }

  // Calculate target length with more precision
  const targetLength = maxTokens * CHARS_PER_TOKEN;
  
  if (text.length <= targetLength) {
    return text;
  }

  // Simple truncation to target length
  return text.substring(0, targetLength);
}

// Keep legacy functions for backward compatibility
export const estimateTokenCount = (text: string): number => {
  // More accurate estimation considering word boundaries and punctuation
  const words = text.split(/\s+/).length;
  const punctuation = (text.match(/[.,!?;:]/g) || []).length;
  
  // Rough estimation: 1 token per word + additional tokens for punctuation
  return Math.ceil(words * 1.3 + punctuation * 0.3);
};

export const smartTruncate = (content: string, maxTokens: number = DEFAULT_MAX_TOKENS): string => {
  return truncateToTokenLimit(content, maxTokens);
};
