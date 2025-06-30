import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Shield, Download, FileText } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { AIRecommendations } from "./AIRecommendations";
import { ComplianceGaps } from "./ComplianceGaps";
import { ComplianceAnalysisHeader } from "./compliance/ComplianceAnalysisHeader";
import { ComplianceChecklistsTab } from "./compliance/ComplianceChecklistsTab";
import { ComplianceQuickTools } from "./compliance/ComplianceQuickTools";
import { SecurityErrorBoundary } from "./SecurityErrorBoundary";
import { ComplianceAnalysisLoading } from "./SecurityLoadingStates";
import { useIsMobile } from "@/hooks/use-mobile";
import { pdfReportService } from "@/utils/pdfReportService";
import { wordReportService } from "@/utils/wordReportService";

// Type alias for better readability
type ComplianceChecklist = Tables<'compliance_checklists'>;

interface ComplianceAnalysisProps {
  analysisResults?: any;
}

export const ComplianceAnalysis = ({ analysisResults }: ComplianceAnalysisProps) => {
  const [checklists, setChecklists] = useState<ComplianceChecklist[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("checklists");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportFormat, setReportFormat] = useState<'pdf' | 'word'>('pdf');
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    initializeMockChecklists();
  }, []);

  const initializeMockChecklists = () => {
    const mockChecklists: ComplianceChecklist[] = [
      {
        id: "demo-1",
        user_id: "demo-user",
        far_clause: "FAR 52.219-14",
        requirements: [
          "Establish subcontracting plan for small business participation",
          "Document prime contractor performance percentage",
          "Submit quarterly subcontracting reports"
        ],
        status: "pending",
        estimated_cost: "$5,000",
        timeframe: "2-3 weeks",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "demo-2", 
        user_id: "demo-user",
        far_clause: "FAR 52.204-10",
        requirements: [
          "Report executive compensation annually",
          "Maintain compensation documentation",
          "Submit required certifications"
        ],
        status: "in_progress",
        estimated_cost: "$2,500", 
        timeframe: "1 week",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    
    setChecklists(mockChecklists);
  };

  const handleStatusUpdate = async (id: string, status: 'pending' | 'in_progress' | 'completed') => {
    try {
      setChecklists(prev => 
        prev.map(item => 
          item.id === id ? { ...item, status } : item
        )
      );
      toast({
        title: "Status Updated",
        description: "Compliance checklist status has been updated.",
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error", 
        description: "Failed to update status.",
        variant: "destructive"
      });
    }
  };

  const generateFARReport = async () => {
    setIsGeneratingReport(true);
    try {
      if (reportFormat === 'pdf') {
        // Create a mock compliance report for PDF generation
        const mockReport = {
          type: 'far',
          summary: {
            totalSecurityEvents: 15,
            criticalAlerts: 2,
            openIncidents: 1,
            complianceScore: 85
          },
          details: {
            recommendations: [
              'Establish a compliance tracking system for ongoing reporting requirements',
              'Implement quarterly review processes for subcontracting performance',
              'Create standardized templates for required documentation',
              'Schedule regular training sessions for compliance team members'
            ],
            securityEvents: [
              {
                type: 'Compliance Check',
                severity: 'info',
                timestamp: new Date().toISOString()
              },
              {
                type: 'Document Review',
                severity: 'low',
                timestamp: new Date(Date.now() - 86400000).toISOString()
              }
            ]
          }
        };
        await pdfReportService.generateComplianceReport(mockReport);
      } else {
        await wordReportService.generateFARComplianceReport(analysisResults);
      }
      
      toast({
        title: "Report Generated",
        description: `FAR compliance report has been downloaded as ${reportFormat.toUpperCase()}.`,
      });
    } catch (error) {
      console.error('Report generation failed:', error);
      toast({
        title: "Error",
        description: "Failed to generate report.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingReport(false);
    }
  };

  if (loading) {
    return <ComplianceAnalysisLoading />;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <SecurityErrorBoundary component="ComplianceAnalysisHeader">
        <ComplianceAnalysisHeader analysisResults={analysisResults} />
      </SecurityErrorBoundary>

      {/* Report Generation Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Generate FAR Compliance Report</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Format:</span>
              <Select value={reportFormat} onValueChange={(value: 'pdf' | 'word') => setReportFormat(value)}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="word">Word</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={generateFARReport}
              disabled={isGeneratingReport}
              className="flex items-center space-x-2"
            >
              {isGeneratingReport ? (
                <>
                  <div className="animate-spin h-4 w-4 border-b-2 border-current rounded-full"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Generate Report</span>
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`${isMobile ? 'grid grid-cols-2 gap-1 h-auto p-1' : 'grid grid-cols-4'} w-full`}>
          <TabsTrigger 
            value="checklists" 
            className={isMobile ? 'text-xs px-2 py-2' : ''}
          >
            {isMobile ? 'Checklists' : 'Compliance Checklists'}
          </TabsTrigger>
          <TabsTrigger 
            value="recommendations" 
            className={isMobile ? 'text-xs px-2 py-2' : ''}
          >
            <Brain className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            {isMobile ? 'AI' : 'AI Recommendations'}
          </TabsTrigger>
          <TabsTrigger 
            value="gaps" 
            className={isMobile ? 'text-xs px-2 py-2' : ''}
          >
            <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            {isMobile ? 'Gaps' : 'Compliance Gaps'}
          </TabsTrigger>
          <TabsTrigger 
            value="tools" 
            className={isMobile ? 'text-xs px-2 py-2' : ''}
          >
            {isMobile ? 'Tools' : 'Quick Tools'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="checklists" className="mt-4 sm:mt-6">
          <SecurityErrorBoundary component="ComplianceChecklistsTab">
            <ComplianceChecklistsTab 
              checklists={checklists}
              loading={loading}
              onStatusUpdate={handleStatusUpdate}
            />
          </SecurityErrorBoundary>
        </TabsContent>

        <TabsContent value="recommendations" className="mt-4 sm:mt-6">
          <SecurityErrorBoundary component="AIRecommendations">
            <AIRecommendations />
          </SecurityErrorBoundary>
        </TabsContent>

        <TabsContent value="gaps" className="mt-4 sm:mt-6">
          <SecurityErrorBoundary component="ComplianceGaps">
            <ComplianceGaps />
          </SecurityErrorBoundary>
        </TabsContent>

        <TabsContent value="tools" className="mt-4 sm:mt-6">
          <SecurityErrorBoundary component="ComplianceQuickTools">
            <ComplianceQuickTools />
          </SecurityErrorBoundary>
        </TabsContent>
      </Tabs>
    </div>
  );
};
