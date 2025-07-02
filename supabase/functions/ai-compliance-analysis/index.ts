
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Security-Policy': "default-src 'self'",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

interface AnalysisRequest {
  documentContent: string;
  documentName: string;
  documentId?: string;
}

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_MAX_REQUESTS = 10;

// Input validation functions
function validateInput(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.documentContent || typeof data.documentContent !== 'string') {
    errors.push('Document content is required and must be a string');
  } else if (data.documentContent.length > 1000000) { // 1MB limit
    errors.push('Document content exceeds maximum size limit');
  }
  
  if (!data.documentName || typeof data.documentName !== 'string') {
    errors.push('Document name is required and must be a string');
  } else if (data.documentName.length > 255) {
    errors.push('Document name exceeds maximum length');
  }
  
  // Check for potentially malicious content
  const maliciousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /\.\.\//g, // Path traversal
    /\x00/g // Null bytes
  ];
  
  for (const pattern of maliciousPatterns) {
    if (pattern.test(data.documentContent) || pattern.test(data.documentName)) {
      errors.push('Content contains potentially dangerous patterns');
      break;
    }
  }
  
  return { isValid: errors.length === 0, errors };
}

function checkRateLimit(userId: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }
  
  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, retryAfter: Math.ceil((userLimit.resetTime - now) / 1000) };
  }
  
  userLimit.count++;
  return { allowed: true };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const requestId = crypto.randomUUID();
  const startTime = Date.now();
  
  console.log(`[${requestId}] AI analysis request started at ${new Date().toISOString()}`);

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Enhanced authentication check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log(`[${requestId}] Missing or invalid authorization header`);
      return new Response(JSON.stringify({ error: 'Missing or invalid authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      console.log(`[${requestId}] Authentication failed:`, authError?.message);
      return new Response(JSON.stringify({ error: 'Unauthorized - Invalid or expired token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Rate limiting
    const rateLimitCheck = checkRateLimit(user.id);
    if (!rateLimitCheck.allowed) {
      console.log(`[${requestId}] Rate limit exceeded for user ${user.id}`);
      return new Response(JSON.stringify({ 
        error: 'Rate limit exceeded. Please try again later.',
        retryAfter: rateLimitCheck.retryAfter 
      }), {
        status: 429,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Retry-After': rateLimitCheck.retryAfter?.toString() || '300'
        },
      });
    }

    // Parse and validate request body
    let requestData: AnalysisRequest;
    try {
      requestData = await req.json();
    } catch (error) {
      console.log(`[${requestId}] Invalid JSON in request body`);
      return new Response(JSON.stringify({ error: 'Invalid JSON in request body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Input validation
    const validation = validateInput(requestData);
    if (!validation.isValid) {
      console.log(`[${requestId}] Input validation failed:`, validation.errors);
      return new Response(JSON.stringify({ 
        error: 'Input validation failed', 
        details: validation.errors 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { documentContent, documentName, documentId } = requestData;
    console.log(`[${requestId}] Processing analysis for user ${user.id}, document: ${documentName}`);

    // Enhanced AI analysis simulation (in production, this would use actual AI/ML services)
    const analysisResults = await performAdvancedAnalysis(documentContent, documentName, requestId);

    // Store AI analysis results
    const { data: aiAnalysis, error: analysisError } = await supabaseClient
      .from('ai_analysis_results')
      .insert({
        user_id: user.id,
        document_id: documentId,
        ai_findings: analysisResults.findings,
        risk_assessment: analysisResults.riskAssessment,
        recommendations: analysisResults.recommendations,
        confidence_score: analysisResults.confidenceScore,
        processing_time_ms: analysisResults.processingTime,
        model_version: 'far-v2.1-advanced'
      })
      .select()
      .single();

    if (analysisError) throw analysisError;

    // Store intelligent recommendations
    for (const recommendation of analysisResults.intelligentRecommendations) {
      await supabaseClient
        .from('ai_recommendations')
        .insert({
          user_id: user.id,
          analysis_id: aiAnalysis.id,
          recommendation_type: recommendation.type,
          priority: recommendation.priority,
          title: recommendation.title,
          description: recommendation.description,
          far_clause_reference: recommendation.farClause,
          estimated_effort: recommendation.effort,
          due_date: recommendation.dueDate,
          metadata: recommendation.metadata
        });
    }

    // Store compliance gaps
    for (const gap of analysisResults.complianceGaps) {
      await supabaseClient
        .from('compliance_gaps')
        .insert({
          user_id: user.id,
          analysis_id: aiAnalysis.id,
          gap_type: gap.type,
          severity: gap.severity,
          far_clause: gap.farClause,
          description: gap.description,
          suggested_action: gap.suggestedAction,
          regulatory_reference: gap.regulatoryReference,
          impact_assessment: gap.impactAssessment
        });
    }

    return new Response(JSON.stringify({
      success: true,
      analysisId: aiAnalysis.id,
      results: analysisResults
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI compliance analysis:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function performAdvancedAnalysis(content: string, documentName: string, requestId: string) {
  const startTime = Date.now();
  console.log(`[${requestId}] Starting advanced analysis for document: ${documentName}`);
  
  // Simulate advanced AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log(`[${requestId}] Analysis processing completed in ${Date.now() - startTime}ms`);

  // Enhanced mock analysis with more sophisticated results
  const findings = {
    documentType: detectDocumentType(content, documentName),
    farClauses: [
      {
        clause: "FAR 52.219-14",
        title: "Limitations on Subcontracting",
        confidence: 0.92,
        location: "Section 3.2.1",
        requirements: [
          "Prime contractor must perform at least 50% of cost with own employees",
          "Subcontracting plan required for contracts over $750,000",
          "Monthly reporting of subcontracting activities"
        ],
        riskLevel: "high",
        complianceStatus: "needs_attention"
      },
      {
        clause: "FAR 52.204-10",
        title: "Reporting Executive Compensation",
        confidence: 0.87,
        location: "Section 4.1.3",
        requirements: [
          "Annual compensation reporting for executives",
          "Public disclosure requirements",
          "SAM.gov registration maintenance"
        ],
        riskLevel: "medium",
        complianceStatus: "compliant"
      },
      {
        clause: "FAR 52.222-50",
        title: "Combating Trafficking in Persons",
        confidence: 0.95,
        location: "Section 5.2",
        requirements: [
          "Anti-trafficking compliance plan",
          "Employee awareness program",
          "Supply chain monitoring"
        ],
        riskLevel: "low",
        complianceStatus: "compliant"
      }
    ],
    keyTerms: ["small business", "subcontracting", "compliance", "reporting"],
    contractValue: extractContractValue(content),
    performancePeriod: "24 months",
    criticalDeadlines: [
      { item: "Proposal Submission", date: "2024-07-15", daysRemaining: 45 },
      { item: "Small Business Plan", date: "2024-06-30", daysRemaining: 30 }
    ]
  };

  const riskAssessment = {
    overallRisk: "medium",
    riskFactors: [
      {
        factor: "Subcontracting Compliance",
        severity: "high",
        probability: 0.7,
        impact: "Contract award delay or rejection",
        mitigation: "Develop comprehensive subcontracting plan"
      },
      {
        factor: "Documentation Requirements",
        severity: "medium",
        probability: 0.4,
        impact: "Administrative burden",
        mitigation: "Implement automated tracking system"
      }
    ],
    complianceCost: {
      initial: 8500,
      annual: 3200,
      breakdown: {
        legal: 3000,
        administrative: 2500,
        training: 1500,
        monitoring: 1500
      }
    }
  };

  const intelligentRecommendations = [
    {
      type: "action_item",
      priority: "high",
      title: "Develop Subcontracting Plan",
      description: "Create a comprehensive subcontracting plan addressing FAR 52.219-14 requirements",
      farClause: "FAR 52.219-14",
      effort: "high",
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      metadata: {
        estimatedHours: 40,
        requiredResources: ["Legal counsel", "Procurement specialist"],
        dependencies: ["Small business certification verification"]
      }
    },
    {
      type: "risk_mitigation",
      priority: "medium",
      title: "Implement Compliance Tracking System",
      description: "Set up automated system to track and report compliance activities",
      farClause: "Multiple",
      effort: "medium",
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      metadata: {
        estimatedHours: 20,
        requiredResources: ["IT support", "Compliance officer"],
        benefits: ["Reduced manual effort", "Improved accuracy"]
      }
    },
    {
      type: "compliance_step",
      priority: "medium",
      title: "Conduct Training Program",
      description: "Train staff on anti-trafficking and compliance requirements",
      farClause: "FAR 52.222-50",
      effort: "low",
      dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      metadata: {
        estimatedHours: 8,
        requiredResources: ["HR department", "Training materials"],
        frequency: "Annual"
      }
    }
  ];

  const complianceGaps = [
    {
      type: "missing_clause",
      severity: "high",
      farClause: "FAR 52.219-14",
      description: "Subcontracting plan template not included in proposal",
      suggestedAction: "Add detailed subcontracting plan with small business utilization goals",
      regulatoryReference: "FAR 19.702",
      impactAssessment: "Could result in proposal rejection or significant point deduction"
    },
    {
      type: "incomplete_requirement",
      severity: "medium",
      farClause: "FAR 52.204-10",
      description: "Executive compensation disclosure partially completed",
      suggestedAction: "Complete all required compensation fields in SAM.gov",
      regulatoryReference: "FAR 4.1402",
      impactAssessment: "May delay contract award process"
    }
  ];

  return {
    findings,
    riskAssessment,
    recommendations: findings.farClauses.map(clause => ({
      clause: clause.clause,
      requirements: clause.requirements,
      risk: clause.riskLevel,
      status: clause.complianceStatus
    })),
    intelligentRecommendations,
    complianceGaps,
    confidenceScore: 0.89,
    processingTime: Date.now() - startTime
  };
}

function detectDocumentType(content: string, filename: string): string {
  const lowerContent = content.toLowerCase();
  const lowerFilename = filename.toLowerCase();
  
  if (lowerContent.includes('solicitation') || lowerFilename.includes('rfp')) return 'RFP';
  if (lowerContent.includes('request for quote') || lowerFilename.includes('rfq')) return 'RFQ';
  if (lowerContent.includes('invitation for bid') || lowerFilename.includes('ifb')) return 'IFB';
  if (lowerContent.includes('contract') || lowerFilename.includes('contract')) return 'Contract';
  if (lowerContent.includes('proposal') || lowerFilename.includes('proposal')) return 'Proposal';
  
  return 'Government Document';
}

function extractContractValue(content: string): string {
  const dollarMatches = content.match(/\$[\d,]+(?:\.\d{2})?/g);
  if (dollarMatches && dollarMatches.length > 0) {
    const amounts = dollarMatches.map(match => {
      const num = parseFloat(match.replace(/[$,]/g, ''));
      return num;
    }).sort((a, b) => b - a);
    
    if (amounts[0] > 10000) {
      return `$${amounts[0].toLocaleString()}`;
    }
  }
  return "Not specified";
}
