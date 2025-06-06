
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { AlertTriangle, CheckCircle, Clock, Download, FileText, TrendingUp } from "lucide-react";
import { getAnalysisResults } from "@/services/analysisService";
import { getComplianceChecklists } from "@/services/complianceService";
import { AnalysisResult, ComplianceChecklist } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const Dashboard = () => {
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [complianceChecklists, setComplianceChecklists] = useState<ComplianceChecklist[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [analyses, checklists] = await Promise.all([
        getAnalysisResults(),
        getComplianceChecklists()
      ]);
      setAnalysisResults(analyses);
      setComplianceChecklists(checklists);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate compliance statistics
  const complianceStats = {
    completed: complianceChecklists.filter(c => c.status === 'completed').length,
    inProgress: complianceChecklists.filter(c => c.status === 'in_progress').length,
    pending: complianceChecklists.filter(c => c.status === 'pending').length
  };

  const complianceData = [
    { name: "Completed", value: complianceStats.completed, color: "#10b981" },
    { name: "In Progress", value: complianceStats.inProgress, color: "#f59e0b" },
    { name: "Pending", value: complianceStats.pending, color: "#ef4444" }
  ];

  // Calculate risk statistics
  const riskStats = {
    high: analysisResults.filter(a => a.risk_level === 'high').length,
    medium: analysisResults.filter(a => a.risk_level === 'medium').length,
    low: analysisResults.filter(a => a.risk_level === 'low').length
  };

  const complianceRate = complianceChecklists.length > 0 
    ? Math.round((complianceStats.completed / complianceChecklists.length) * 100)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Analyses</p>
                <p className="text-2xl font-bold">{analysisResults.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <span>Documents analyzed</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Risk Issues</p>
                <p className="text-2xl font-bold">{riskStats.high}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <div className="mt-4 flex items-center text-sm text-red-600">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Requires attention
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
                <p className="text-2xl font-bold">{complianceRate}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-4">
              <Progress value={complianceRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Checklists</p>
                <p className="text-2xl font-bold">{complianceChecklists.length}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <span>Compliance items</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Compliance Status Overview</CardTitle>
            <CardDescription>Current project compliance status</CardDescription>
          </CardHeader>
          <CardContent>
            {complianceChecklists.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={complianceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                  >
                    {complianceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4" />
                  <p>No compliance data yet</p>
                  <p className="text-sm">Upload documents to see compliance status</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Assessment Summary</CardTitle>
            <CardDescription>Risk distribution across analyzed documents</CardDescription>
          </CardHeader>
          <CardContent>
            {analysisResults.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">High Risk</span>
                  <span className="text-sm text-red-600">{riskStats.high}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Medium Risk</span>
                  <span className="text-sm text-yellow-600">{riskStats.medium}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Low Risk</span>
                  <span className="text-sm text-green-600">{riskStats.low}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[260px] text-gray-500">
                <div className="text-center">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
                  <p>No risk assessment data yet</p>
                  <p className="text-sm">Upload documents to see risk analysis</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Analyses */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Recent Analyses</CardTitle>
              <CardDescription>Latest document compliance reviews</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {analysisResults.length > 0 ? (
            <div className="space-y-4">
              {analysisResults.slice(0, 5).map((analysis) => (
                <div key={analysis.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div>
                      <div className="font-medium">{analysis.document_name}</div>
                      <div className="text-sm text-gray-600">
                        Analyzed on {new Date(analysis.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant={analysis.risk_level === 'high' ? 'destructive' : 
                                  analysis.risk_level === 'medium' ? 'default' : 'secondary'}>
                      {analysis.risk_level} risk
                    </Badge>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Analyses Yet</h3>
              <p className="text-gray-600">Upload documents to see analysis results here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
