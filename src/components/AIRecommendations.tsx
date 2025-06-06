
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  Target,
  TrendingUp,
  FileText
} from "lucide-react";
import { getAIRecommendations, updateRecommendationStatus, AIRecommendation } from "@/services/aiAnalysisService";
import { useToast } from "@/hooks/use-toast";

interface AIRecommendationsProps {
  analysisId?: string;
}

export const AIRecommendations = ({ analysisId }: AIRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRecommendations();
  }, [analysisId]);

  const fetchRecommendations = async () => {
    try {
      const data = await getAIRecommendations(analysisId);
      setRecommendations(data);
    } catch (error) {
      console.error('Error fetching AI recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to load AI recommendations.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: AIRecommendation['status']) => {
    try {
      await updateRecommendationStatus(id, status);
      setRecommendations(prev => 
        prev.map(rec => 
          rec.id === id ? { ...rec, status } : rec
        )
      );
      toast({
        title: "Status Updated",
        description: "Recommendation status has been updated.",
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-800 border-red-200";
      case "high": return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "action_item": return <Target className="h-4 w-4" />;
      case "risk_mitigation": return <AlertTriangle className="h-4 w-4" />;
      case "compliance_step": return <CheckCircle className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const completedCount = recommendations.filter(r => r.status === 'completed').length;
  const progressPercentage = recommendations.length > 0 ? (completedCount / recommendations.length) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading AI recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span>Recommendation Progress</span>
            </CardTitle>
            <CardDescription>
              {completedCount} of {recommendations.length} recommendations completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progressPercentage} className="mb-2" />
            <div className="text-sm text-gray-600">
              {Math.round(progressPercentage)}% complete
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations List */}
      {recommendations.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No AI Recommendations</h3>
            <p className="text-gray-600">AI recommendations will appear here after document analysis.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {recommendations.map((recommendation) => (
            <Card key={recommendation.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-50 rounded-md">
                      {getTypeIcon(recommendation.recommendation_type)}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {recommendation.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Badge className={getPriorityColor(recommendation.priority)}>
                      {recommendation.priority}
                    </Badge>
                    {recommendation.auto_generated && (
                      <Badge variant="outline" className="text-xs">
                        <Brain className="h-3 w-3 mr-1" />
                        AI Generated
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {recommendation.far_clause_reference && (
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-sm font-medium">FAR Clause</div>
                        <div className="text-sm text-gray-600">{recommendation.far_clause_reference}</div>
                      </div>
                    </div>
                  )}
                  {recommendation.estimated_effort && (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-sm font-medium">Effort</div>
                        <div className="text-sm text-gray-600 capitalize">{recommendation.estimated_effort}</div>
                      </div>
                    </div>
                  )}
                  {recommendation.due_date && (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-sm font-medium">Due Date</div>
                        <div className="text-sm text-gray-600">
                          {new Date(recommendation.due_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  )}
                  {recommendation.metadata?.estimatedHours && (
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-sm font-medium">Est. Hours</div>
                        <div className="text-sm text-gray-600">{recommendation.metadata.estimatedHours}h</div>
                      </div>
                    </div>
                  )}
                </div>

                {recommendation.metadata?.requiredResources && (
                  <div className="mb-4">
                    <div className="text-sm font-medium mb-2">Required Resources:</div>
                    <div className="flex flex-wrap gap-2">
                      {recommendation.metadata.requiredResources.map((resource: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {resource}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <Badge 
                    variant={recommendation.status === 'completed' ? 'default' : 'secondary'}
                    className={
                      recommendation.status === 'completed' ? 'bg-green-100 text-green-800' :
                      recommendation.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }
                  >
                    {recommendation.status.replace('_', ' ')}
                  </Badge>
                  
                  <div className="flex space-x-2">
                    {recommendation.status === 'pending' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleStatusUpdate(recommendation.id, 'in_progress')}
                      >
                        Start Work <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    )}
                    {recommendation.status === 'in_progress' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleStatusUpdate(recommendation.id, 'completed')}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Complete
                      </Button>
                    )}
                    {recommendation.status === 'completed' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStatusUpdate(recommendation.id, 'in_progress')}
                      >
                        Reopen
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleStatusUpdate(recommendation.id, 'dismissed')}
                    >
                      Dismiss
                    </Button>
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
