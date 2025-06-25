
-- Critical performance indexes for instant improvement
-- Using IF NOT EXISTS to avoid conflicts with existing indexes

-- 1. User-based data access indexes (most critical for multi-tenant app)
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_compliance_checklists_user_id ON compliance_checklists(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_results_user_id ON ai_analysis_results(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_user_id ON ai_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_compliance_gaps_user_id ON compliance_gaps(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_results_user_id ON analysis_results(user_id);

-- 2. Status and filtering indexes for improved UI performance
CREATE INDEX IF NOT EXISTS idx_compliance_checklists_status ON compliance_checklists(status);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_status_priority ON ai_recommendations(status, priority);
CREATE INDEX IF NOT EXISTS idx_compliance_gaps_resolution_severity ON compliance_gaps(resolution_status, severity);

-- 3. FAR clause reference indexes for search functionality
CREATE INDEX IF NOT EXISTS idx_compliance_checklists_far_clause ON compliance_checklists(far_clause);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_far_clause ON ai_recommendations(far_clause_reference) WHERE far_clause_reference IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_compliance_gaps_far_clause ON compliance_gaps(far_clause);

-- 4. Date-based indexes for chronological queries and deadline tracking
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_due_date ON ai_recommendations(due_date) WHERE due_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ai_analysis_results_created_at ON ai_analysis_results(created_at DESC);

-- 5. Foreign key relationship indexes for join performance
CREATE INDEX IF NOT EXISTS idx_ai_analysis_results_document_id ON ai_analysis_results(document_id) WHERE document_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_analysis_id ON ai_recommendations(analysis_id) WHERE analysis_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_compliance_gaps_analysis_id ON compliance_gaps(analysis_id) WHERE analysis_id IS NOT NULL;

-- 6. Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_user_status ON ai_recommendations(user_id, status);
CREATE INDEX IF NOT EXISTS idx_compliance_checklists_user_status ON compliance_checklists(user_id, status);
CREATE INDEX IF NOT EXISTS idx_documents_user_created ON documents(user_id, created_at DESC);
