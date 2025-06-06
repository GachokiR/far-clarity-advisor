
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, AlertTriangle, DollarSign, Clock, FileText, CheckCircle, Brain, Shield } from "lucide-react";
import { getComplianceChecklists, updateComplianceStatus } from "@/services/complianceService";
import { ComplianceChecklist } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { AIRecommendations } from "./AIRecommendations";
import { ComplianceGaps } from "./ComplianceGaps";

interface ComplianceAnalysisProps {
  analysisResults?: any;
}

export const ComplianceAnalysis = ({ analysisResults }: ComplianceAnalysisProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [checklists, setChecklists] = useState<ComplianceChecklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("checklists");
  const { toast } = useToast();

  useEffect(() => {
    fetchChecklists();
  }, []);

  const fetchChecklists = async () => {
    try {
      const data = await getComplianceChecklists();
      setChecklists(data);
    } catch (error) {
      console.error('Error fetching checklists:', error);
      toast({
        title: "Error",
        description: "Failed to load compliance checklists.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: 'pending' | 'in_progress' | 'completed') => {
    try {
      await updateComplianceStatus(id, status);
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

  const filteredChecklists = checklists.filter(checklist =>
    checklist.far_clause.toLowerCase().includes(searchQuery.toLowerCase()) ||
    searchQuery === ""
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in_progress": return "bg-yellow-100 text-yellow-800";
      case "pending": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading compliance analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analysis Results Section */}
      {analysisResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-blue-600" />
              <span>AI Analysis Results</span>
            </CardTitle>
            <CardDescription>Enhanced AI-powered compliance analysis and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-1">Documents Analyzed</h4>
                <p className="text-2xl font-bold text-blue-700">{analysisResults.documentsAnalyzed || 0}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-1">FAR Clauses Detected</h4>
                <p className="text-2xl font-bold text-green-700">{analysisResults.farClausesDetected?.length || 0}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-medium text-orange-900 mb-1">Est. Compliance Cost</h4>
                <p className="text-2xl font-bold text-orange-700">{analysisResults.estimatedComplianceCost || 'TBD'}</p>
              </div>
            </div>

            {analysisResults.farClausesDetected && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Detected FAR Clauses:</h4>
                {analysisResults.farClausesDetected.map((clause: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="font-medium">{clause.clause}</h5>
                        <p className="text-sm text-gray-600">{clause.title}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Badge className={
                          clause.risk === 'high' ? 'bg-red-100 text-red-800' :
                          clause.risk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }>
                          {clause.risk} risk
                        </Badge>
                        <Badge variant="outline">{clause.cost}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{clause.description}</p>
                    <div className="text-xs text-gray-500">
                      Timeframe: {clause.timeframe}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Enhanced Tabs with AI Features */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="checklists">Compliance Checklists</TabsTrigger>
          <TabsTrigger value="recommendations">
            <Brain className="h-4 w-4 mr-2" />
            AI Recommendations
          </TabsTrigger>
          <TabsTrigger value="gaps">
            <Shield className="h-4 w-4 mr-2" />
            Compliance Gaps
          </TabsTrigger>
          <TabsTrigger value="tools">Quick Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="checklists" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Checklists</CardTitle>
              <CardDescription>Manage your FAR compliance requirements and analysis results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-6">
                <div className="flex-1">
                  <Label htmlFor="search">Search FAR Clauses</Label>
                  <Input
                    id="search"
                    placeholder="Enter FAR clause number (e.g., 52.219-14) or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button className="mt-6">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              {/* Checklist Items */}
              {filteredChecklists.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Compliance Checklists</h3>
                  <p className="text-gray-600">Upload documents to generate compliance checklists and see analysis results here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {filteredChecklists.map((checklist) => (
                    <Card key={checklist.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{checklist.far_clause}</CardTitle>
                            <CardDescription className="text-sm text-gray-600">
                              Created: {new Date(checklist.created_at).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <Badge className={getStatusColor(checklist.status)}>
                            {checklist.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          {checklist.estimated_cost && (
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <div>
                                <div className="text-sm font-medium">Est. Cost</div>
                                <div className="text-sm text-gray-600">{checklist.estimated_cost}</div>
                              </div>
                            </div>
                          )}
                          {checklist.timeframe && (
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-blue-600" />
                              <div>
                                <div className="text-sm font-medium">Timeframe</div>
                                <div className="text-sm text-gray-600">{checklist.timeframe}</div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="text-sm font-medium">Requirements:</div>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {checklist.requirements.map((req, index) => (
                              <li key={index} className="flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex space-x-2">
                          {checklist.status === 'pending' && (
                            <Button 
                              size="sm" 
                              onClick={() => handleStatusUpdate(checklist.id, 'in_progress')}
                            >
                              Start Work
                            </Button>
                          )}
                          {checklist.status === 'in_progress' && (
                            <Button 
                              size="sm" 
                              onClick={() => handleStatusUpdate(checklist.id, 'completed')}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark Complete
                            </Button>
                          )}
                          {checklist.status === 'completed' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleStatusUpdate(checklist.id, 'in_progress')}
                            >
                              Reopen
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="mt-6">
          <AIRecommendations />
        </TabsContent>

        <TabsContent value="gaps" className="mt-6">
          <ComplianceGaps />
        </TabsContent>

        <TabsContent value="tools" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Compliance Tools</CardTitle>
              <CardDescription>Common compliance tasks and enhanced AI-powered tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <FileText className="h-6 w-6 mb-2" />
                  Generate Report
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <AlertTriangle className="h-6 w-6 mb-2" />
                  Risk Assessment
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <DollarSign className="h-6 w-6 mb-2" />
                  Cost Estimator
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Brain className="h-6 w-6 mb-2" />
                  AI Analysis
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Shield className="h-6 w-6 mb-2" />
                  Gap Analysis
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <CheckCircle className="h-6 w-6 mb-2" />
                  Compliance Score
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
