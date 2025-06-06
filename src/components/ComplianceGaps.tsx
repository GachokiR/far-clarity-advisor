
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  AlertCircle, 
  Shield, 
  FileText, 
  ExternalLink,
  CheckCircle,
  Eye,
  XCircle
} from "lucide-react";
import { getComplianceGaps, updateComplianceGapStatus, ComplianceGap } from "@/services/aiAnalysisService";
import { useToast } from "@/hooks/use-toast";

interface ComplianceGapsProps {
  analysisId?: string;
}

export const ComplianceGaps = ({ analysisId }: ComplianceGapsProps) => {
  const [gaps, setGaps] = useState<ComplianceGap[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchGaps();
  }, [analysisId]);

  const fetchGaps = async () => {
    try {
      const data = await getComplianceGaps(analysisId);
      setGaps(data);
    } catch (error) {
      console.error('Error fetching compliance gaps:', error);
      toast({
        title: "Error",
        description: "Failed to load compliance gaps.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: ComplianceGap['resolution_status']) => {
    try {
      await updateComplianceGapStatus(id, status);
      setGaps(prev => 
        prev.map(gap => 
          gap.id === id ? { ...gap, resolution_status: status } : gap
        )
      );
      toast({
        title: "Status Updated",
        description: "Compliance gap status has been updated.",
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-100 text-red-800 border-red-200";
      case "high": return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "missing_clause": return <XCircle className="h-4 w-4" />;
      case "incomplete_requirement": return <AlertCircle className="h-4 w-4" />;
      case "conflicting_terms": return <AlertTriangle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "investigating": return <Eye className="h-4 w-4 text-blue-600" />;
      case "waived": return <Shield className="h-4 w-4 text-gray-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-red-600" />;
    }
  };

  const criticalGaps = gaps.filter(gap => gap.severity === 'critical').length;
  const highGaps = gaps.filter(gap => gap.severity === 'high').length;
  const openGaps = gaps.filter(gap => gap.resolution_status === 'open').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading compliance gaps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {gaps.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Critical Issues</p>
                  <p className="text-2xl font-bold text-red-600">{criticalGaps}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">High Priority</p>
                  <p className="text-2xl font-bold text-orange-600">{highGaps}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Open Issues</p>
                  <p className="text-2xl font-bold text-blue-600">{openGaps}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Gaps List */}
      {gaps.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Compliance Gaps Detected</h3>
            <p className="text-gray-600">Great! No significant compliance gaps were found in your analysis.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {gaps.map((gap) => (
            <Card key={gap.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-md ${
                      gap.severity === 'critical' ? 'bg-red-50' :
                      gap.severity === 'high' ? 'bg-orange-50' :
                      gap.severity === 'medium' ? 'bg-yellow-50' : 'bg-blue-50'
                    }`}>
                      {getTypeIcon(gap.gap_type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <CardTitle className="text-lg">
                          {gap.gap_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </CardTitle>
                        <Badge className={getSeverityColor(gap.severity)}>
                          {gap.severity}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">{gap.far_clause}</span>
                      </div>
                      <CardDescription>
                        {gap.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(gap.resolution_status)}
                    <Badge variant="outline">
                      {gap.resolution_status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {gap.suggested_action && (
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Suggested Action</h4>
                    <p className="text-blue-800 text-sm">{gap.suggested_action}</p>
                  </div>
                )}

                {gap.impact_assessment && (
                  <div className="mb-4 p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-yellow-900 mb-2">Impact Assessment</h4>
                    <p className="text-yellow-800 text-sm">{gap.impact_assessment}</p>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    {gap.regulatory_reference && (
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        {gap.regulatory_reference}
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    {gap.resolution_status === 'open' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleStatusUpdate(gap.id, 'investigating')}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Investigate
                      </Button>
                    )}
                    {gap.resolution_status === 'investigating' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleStatusUpdate(gap.id, 'resolved')}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Mark Resolved
                      </Button>
                    )}
                    {gap.resolution_status !== 'waived' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStatusUpdate(gap.id, 'waived')}
                      >
                        Waive
                      </Button>
                    )}
                    {gap.resolution_status !== 'open' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStatusUpdate(gap.id, 'open')}
                      >
                        Reopen
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
