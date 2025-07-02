import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, Clock, FileText, Plus } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { useToast } from "@/hooks/use-toast";

export default function Compliance() {
  const { toast } = useToast();

  // Mock compliance data
  const complianceOverview = {
    overallScore: 87,
    totalRequirements: 24,
    completedRequirements: 21,
    pendingRequirements: 3,
    criticalIssues: 1
  };

  const complianceChecks = [
    {
      id: 1,
      title: "FAR 52.219-14 - Limitations on Subcontracting",
      status: "completed",
      progress: 100,
      dueDate: "2024-07-15",
      description: "Verify subcontracting limitations compliance"
    },
    {
      id: 2,
      title: "FAR 52.204-10 - Reporting Executive Compensation",
      status: "in-progress",
      progress: 65,
      dueDate: "2024-07-20",
      description: "Complete executive compensation reporting requirements"
    },
    {
      id: 3,
      title: "FAR 52.225-13 - Restrictions on Certain Foreign Purchases",
      status: "pending",
      progress: 0,
      dueDate: "2024-07-25",
      description: "Review and implement foreign purchase restrictions"
    },
    {
      id: 4,
      title: "FAR 52.203-13 - Contractor Code of Business Ethics",
      status: "critical",
      progress: 30,
      dueDate: "2024-07-10",
      description: "Update business ethics code and training materials"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "bg-green-100 text-green-800",
      'in-progress': "bg-blue-100 text-blue-800",
      pending: "bg-yellow-100 text-yellow-800",
      critical: "bg-red-100 text-red-800"
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.pending}>
        {status.replace('-', ' ')}
      </Badge>
    );
  };

  const handleCreateChecklist = () => {
    toast({
      title: "Create Checklist",
      description: "New compliance checklist creation coming soon.",
    });
  };

  const handleViewDetails = (title: string) => {
    toast({
      title: "View Details",
      description: `Opening details for ${title}...`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <div className="container mx-auto px-4 py-8" data-tour="compliance">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Compliance Management</h1>
            <p className="text-muted-foreground">
              Track and manage your FAR compliance requirements
            </p>
          </div>
          
          <Button onClick={handleCreateChecklist} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Create Checklist</span>
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Compliance Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{complianceOverview.overallScore}%</div>
                <Progress value={complianceOverview.overallScore} className="mt-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {complianceOverview.completedRequirements}/{complianceOverview.totalRequirements}
                </div>
                <p className="text-xs text-muted-foreground">Requirements completed</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{complianceOverview.pendingRequirements}</div>
                <p className="text-xs text-muted-foreground">Items need attention</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{complianceOverview.criticalIssues}</div>
                <p className="text-xs text-muted-foreground">Urgent items</p>
              </CardContent>
            </Card>
          </div>

          {/* Compliance Checklist */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Checklist</CardTitle>
              <CardDescription>
                Track progress on your FAR compliance requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceChecks.map((check) => (
                  <div key={check.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-start space-x-4 flex-1">
                      {getStatusIcon(check.status)}
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground mb-1">{check.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{check.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Due: {check.dueDate}</span>
                          <span>Progress: {check.progress}%</span>
                        </div>
                        <Progress value={check.progress} className="mt-2 w-full max-w-md" />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {getStatusBadge(check.status)}
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(check.title)}>
                        <FileText className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common compliance management tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Button variant="outline" className="h-16 flex flex-col items-center space-y-2">
                  <FileText className="h-6 w-6" />
                  <span>Generate Report</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col items-center space-y-2">
                  <CheckCircle className="h-6 w-6" />
                  <span>Run Audit</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col items-center space-y-2">
                  <AlertCircle className="h-6 w-6" />
                  <span>View Alerts</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}