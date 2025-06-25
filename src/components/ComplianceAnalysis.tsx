
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Shield } from "lucide-react";
import { ComplianceChecklist } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { AIRecommendations } from "./AIRecommendations";
import { ComplianceGaps } from "./ComplianceGaps";
import { ComplianceAnalysisHeader } from "./compliance/ComplianceAnalysisHeader";
import { ComplianceChecklistsTab } from "./compliance/ComplianceChecklistsTab";
import { ComplianceQuickTools } from "./compliance/ComplianceQuickTools";
import { SecurityErrorBoundary } from "./SecurityErrorBoundary";
import { ComplianceAnalysisLoading } from "./SecurityLoadingStates";
import { useIsMobile } from "@/hooks/use-mobile";

interface ComplianceAnalysisProps {
  analysisResults?: any;
}

export const ComplianceAnalysis = ({ analysisResults }: ComplianceAnalysisProps) => {
  const [checklists, setChecklists] = useState<ComplianceChecklist[]>([]);
  const [loading, setLoading] = useState(false); // Changed from true to false since we're in demo mode
  const [activeTab, setActiveTab] = useState("checklists");
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    // In demo mode, we'll use mock data instead of fetching from database
    initializeMockChecklists();
  }, []);

  const initializeMockChecklists = () => {
    // Create mock compliance checklists for demo
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
      // In demo mode, just update local state
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

  if (loading) {
    return <ComplianceAnalysisLoading />;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <SecurityErrorBoundary component="ComplianceAnalysisHeader">
        <ComplianceAnalysisHeader analysisResults={analysisResults} />
      </SecurityErrorBoundary>

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
