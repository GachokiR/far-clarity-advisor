import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Search, DollarSign, Clock, FileText, CheckCircle } from "lucide-react";
import { ComplianceChecklist } from "@/integrations/supabase/types";

interface ComplianceChecklistsTabProps {
  checklists: ComplianceChecklist[];
  loading: boolean;
  onStatusUpdate: (id: string, status: 'pending' | 'in_progress' | 'completed') => void;
}

export const ComplianceChecklistsTab = ({ 
  checklists, 
  loading, 
  onStatusUpdate 
}: ComplianceChecklistsTabProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [completedRequirements, setCompletedRequirements] = useState<Record<string, boolean[]>>({});

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

  const initializeRequirements = (checklistId: string, requirementsCount: number) => {
    if (!completedRequirements[checklistId]) {
      setCompletedRequirements(prev => ({
        ...prev,
        [checklistId]: new Array(requirementsCount).fill(false)
      }));
    }
  };

  const toggleRequirement = (checklistId: string, requirementIndex: number) => {
    setCompletedRequirements(prev => {
      const current = prev[checklistId] || [];
      const updated = [...current];
      updated[requirementIndex] = !updated[requirementIndex];
      return {
        ...prev,
        [checklistId]: updated
      };
    });
  };

  const getCompletionStats = (checklistId: string, totalRequirements: number) => {
    const completed = completedRequirements[checklistId] || [];
    const completedCount = completed.filter(Boolean).length;
    const percentage = totalRequirements > 0 ? (completedCount / totalRequirements) * 100 : 0;
    return { completedCount, totalRequirements, percentage };
  };

  const isAllRequirementsCompleted = (checklistId: string, totalRequirements: number) => {
    const { completedCount } = getCompletionStats(checklistId, totalRequirements);
    return completedCount === totalRequirements && totalRequirements > 0;
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
    <Card>
      <CardHeader>
        <CardTitle>Compliance Checklists</CardTitle>
        <CardDescription>Manage your FAR compliance requirements and track completion progress</CardDescription>
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

        {filteredChecklists.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Compliance Checklists</h3>
            <p className="text-gray-600">Upload documents to generate compliance checklists and see analysis results here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredChecklists.map((checklist) => {
              // Initialize requirements tracking for this checklist
              initializeRequirements(checklist.id, checklist.requirements.length);
              
              const { completedCount, totalRequirements, percentage } = getCompletionStats(
                checklist.id, 
                checklist.requirements.length
              );
              const allCompleted = isAllRequirementsCompleted(checklist.id, checklist.requirements.length);

              return (
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

                    {/* Progress tracking */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm font-medium">Requirements Progress</div>
                        <div className="text-sm text-gray-600">
                          {completedCount} of {totalRequirements} completed
                        </div>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="text-sm font-medium">Requirements:</div>
                      {checklist.requirements.map((req, index) => {
                        const isCompleted = completedRequirements[checklist.id]?.[index] || false;
                        return (
                          <div key={index} className="flex items-start space-x-3 group">
                            <Checkbox
                              id={`${checklist.id}-req-${index}`}
                              checked={isCompleted}
                              onCheckedChange={() => toggleRequirement(checklist.id, index)}
                              className="mt-0.5"
                            />
                            <label
                              htmlFor={`${checklist.id}-req-${index}`}
                              className={`text-sm cursor-pointer flex-1 transition-all ${
                                isCompleted 
                                  ? 'line-through text-gray-500' 
                                  : 'text-gray-700 group-hover:text-gray-900'
                              }`}
                            >
                              {req}
                            </label>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex space-x-2">
                      {checklist.status === 'pending' && (
                        <Button 
                          size="sm" 
                          onClick={() => onStatusUpdate(checklist.id, 'in_progress')}
                        >
                          Start Work
                        </Button>
                      )}
                      {checklist.status === 'in_progress' && (
                        <Button 
                          size="sm" 
                          onClick={() => onStatusUpdate(checklist.id, 'completed')}
                          disabled={!allCompleted}
                          className={allCompleted 
                            ? 'bg-green-600 hover:bg-green-700 text-white' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {allCompleted ? 'Mark Complete' : `Complete ${completedCount}/${totalRequirements} first`}
                        </Button>
                      )}
                      {checklist.status === 'completed' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onStatusUpdate(checklist.id, 'in_progress')}
                        >
                          Reopen
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
