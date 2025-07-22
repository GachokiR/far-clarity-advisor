// Approximate token count based on OpenAI's estimation (1 token ≈ 4 characters)
const CHARS_PER_TOKEN = 4;
const DEFAULT_MAX_TOKENS = 4000; // Conservative limit for GPT-4

export const estimateTokenCount = (text: string): number => {
  return Math.ceil(text.length / CHARS_PER_TOKEN);
};

export const truncateToTokenLimit = (
  content: string, 
  maxTokens: number = DEFAULT_MAX_TOKENS
): string => {
  const estimatedTokens = estimateTokenCount(content);
  
  if (estimatedTokens <= maxTokens) {
    return content;
  }

  // Calculate target length
  const targetLength = maxTokens * CHARS_PER_TOKEN;
  
  // Try to preserve document structure by keeping beginning and end
  const keepStart = Math.floor(targetLength * 0.7); // 70% from start
  const keepEnd = Math.floor(targetLength * 0.3); // 30% from end
  
  if (content.length <= targetLength) {
    return content;
  }

  const startPart = content.substring(0, keepStart);
  const endPart = content.substring(content.length - keepEnd);
  
  return `${startPart}\n\n[... content truncated for token limit ...]\n\n${endPart}`;
};

export const smartTruncate = (content: string, maxTokens: number = DEFAULT_MAX_TOKENS): string => {
  const estimatedTokens = estimateTokenCount(content);
  
  if (estimatedTokens <= maxTokens) {
    return content;
  }

  // Try to find natural break points (paragraphs, sections)
  const paragraphs = content.split(/\n\s*\n/);
  let truncated = '';
  let currentTokens = 0;
  
  for (const paragraph of paragraphs) {
    const paragraphTokens = estimateTokenCount(paragraph);
    
    if (currentTokens + paragraphTokens > maxTokens * 0.9) { // Leave some buffer
      break;
    }
    
    truncated += paragraph + '\n\n';
    currentTokens += paragraphTokens;
  }
  
  if (truncated.length === 0) {
    // Fallback to simple truncation if no paragraphs fit
    return truncateToTokenLimit(content, maxTokens);
  }
  
  return truncated.trim();
};
