import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BarChart, FileText, Download, Calendar, TrendingUp, AlertCircle } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { useToast } from "@/hooks/use-toast";

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("30");
  const { toast } = useToast();

  // Mock reports data
  const reportSummary = {
    totalReports: 15,
    completedAnalyses: 42,
    complianceScore: 94,
    criticalFindings: 3
  };

  const availableReports = [
    {
      id: 1,
      title: "Monthly Compliance Report",
      type: "Compliance",
      status: "ready",
      generated: "2024-07-01",
      description: "Comprehensive compliance status and recommendations"
    },
    {
      id: 2,
      title: "Security Assessment Report",
      type: "Security",
      status: "generating",
      generated: "2024-07-01",
      description: "Security posture and threat assessment analysis"
    },
    {
      id: 3,
      title: "FAR Clause Analysis Report",
      type: "Analysis",
      status: "ready",
      generated: "2024-06-30",
      description: "Detailed analysis of FAR clause compliance"
    },
    {
      id: 4,
      title: "Document Processing Summary",
      type: "Operations",
      status: "ready",
      generated: "2024-06-29",
      description: "Summary of document uploads and processing metrics"
    }
  ];

  const recentActivity = [
    {
      action: "Compliance report generated",
      time: "2 hours ago",
      type: "success"
    },
    {
      action: "Security scan completed",
      time: "4 hours ago", 
      type: "info"
    },
    {
      action: "Critical finding detected",
      time: "6 hours ago",
      type: "warning"
    },
    {
      action: "Monthly report scheduled",
      time: "1 day ago",
      type: "info"
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      ready: "bg-green-100 text-green-800",
      generating: "bg-blue-100 text-blue-800",
      failed: "bg-red-100 text-red-800"
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.ready}>
        {status}
      </Badge>
    );
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <div className="w-2 h-2 bg-green-500 rounded-full" />;
      case 'warning':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full" />;
      default:
        return <div className="w-2 h-2 bg-blue-500 rounded-full" />;
    }
  };

  const handleDownloadReport = (reportTitle: string) => {
    toast({
      title: "Download Started",
      description: `Downloading ${reportTitle}...`,
    });
  };

  const handleGenerateReport = () => {
    toast({
      title: "Report Generation",
      description: "Custom report generation started. You'll be notified when it's ready.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground">
              Generate and manage compliance and security reports
            </p>
          </div>
          
          <Button onClick={handleGenerateReport} className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Generate Report</span>
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Report Summary */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{reportSummary.totalReports}</div>
                <p className="text-xs text-muted-foreground">Generated this month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Analyses Completed</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{reportSummary.completedAnalyses}</div>
                <p className="text-xs text-muted-foreground">Documents processed</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{reportSummary.complianceScore}%</div>
                <p className="text-xs text-muted-foreground">Average compliance rating</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical Findings</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{reportSummary.criticalFindings}</div>
                <p className="text-xs text-muted-foreground">Require immediate attention</p>
              </CardContent>
            </Card>
          </div>

          {/* Report Generation */}
          <Card>
            <CardHeader>
              <CardTitle>Generate Custom Report</CardTitle>
              <CardDescription>
                Create customized reports for specific time periods and requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1">
                  <label className="text-sm font-medium text-foreground mb-2 block">Time Period</label>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Last 7 days</SelectItem>
                      <SelectItem value="30">Last 30 days</SelectItem>
                      <SelectItem value="90">Last 3 months</SelectItem>
                      <SelectItem value="365">Last year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button onClick={handleGenerateReport} className="flex items-center space-x-2">
                  <BarChart className="h-4 w-4" />
                  <span>Generate</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Available Reports */}
            <Card>
              <CardHeader>
                <CardTitle>Available Reports</CardTitle>
                <CardDescription>
                  Download and manage your generated reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {availableReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground mb-1">{report.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{report.generated}</span>
                          <span>•</span>
                          <span>{report.type}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {getStatusBadge(report.status)}
                        {report.status === 'ready' && (
                          <Button variant="outline" size="sm" onClick={() => handleDownloadReport(report.title)}>
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest report generation and analysis activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}