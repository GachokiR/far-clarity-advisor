
// Re-export all functions and types from the refactored modules
export { runAIAnalysis, getAIAnalysisResults } from './aiAnalysis/aiAnalysisCore';
export { getAIRecommendations, updateRecommendationStatus } from './aiAnalysis/recommendationsService';
export { getComplianceGaps, updateComplianceGapStatus } from './aiAnalysis/complianceGapsService';
export type { AIAnalysisResult, AIRecommendation, ComplianceGap } from '@/types/aiAnalysis';
