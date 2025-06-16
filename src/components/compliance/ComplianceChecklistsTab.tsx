
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, DollarSign, Clock, FileText, CheckCircle } from "lucide-react";
import { ComplianceChecklist } from "@/lib/supabase";

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
                        onClick={() => onStatusUpdate(checklist.id, 'in_progress')}
                      >
                        Start Work
                      </Button>
                    )}
                    {checklist.status === 'in_progress' && (
                      <Button 
                        size="sm" 
                        onClick={() => onStatusUpdate(checklist.id, 'completed')}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Complete
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
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
