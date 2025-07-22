import { encoding_for_model, TiktokenModel } from 'tiktoken';

export function truncateToTokenLimit(text: string, maxTokens = 3000, model: TiktokenModel = 'gpt-4'): string {
  try {
    const encoder = encoding_for_model(model);
    const tokens = encoder.encode(text);
    const truncatedTokens = tokens.slice(0, maxTokens);
    return new TextDecoder().decode(encoder.decode(truncatedTokens));
  } catch (error) {
    console.error('Token truncation error:', error);
    return text.slice(0, 12000); // fallback by character count
  }
}

// Keep legacy functions for backward compatibility
export const estimateTokenCount = (text: string): number => {
  try {
    const encoder = encoding_for_model('gpt-4' as TiktokenModel);
    return encoder.encode(text).length;
  } catch (error) {
    // Fallback to character-based estimation
    return Math.ceil(text.length / 4);
  }
};

export const smartTruncate = (content: string, maxTokens: number = 3000): string => {
  return truncateToTokenLimit(content, maxTokens);
};
