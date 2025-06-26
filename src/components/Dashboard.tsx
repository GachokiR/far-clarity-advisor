
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload, BarChart3, Users, Shield, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TrialLimitsIndicator } from "@/components/TrialLimitsIndicator";

export const Dashboard = () => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    // TODO: Implement upgrade flow
    console.log('Upgrade clicked');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome to Compliance Pro</h2>
        <p className="text-muted-foreground">
          Your comprehensive FAR compliance and security management platform
        </p>
      </div>

      {/* Trial Limits Indicator - Compact variant for header */}
      <TrialLimitsIndicator 
        variant="compact" 
        onUpgrade={handleUpgrade}
        className="mb-6"
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Document Analysis</span>
            </CardTitle>
            <CardDescription>
              Upload and analyze documents for FAR compliance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              Upload Documents
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Compliance Analytics</span>
            </CardTitle>
            <CardDescription>
              View detailed compliance reports and metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              View Analytics
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Compliance Checklists</span>
            </CardTitle>
            <CardDescription>
              Track your compliance requirements and progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              View Checklists
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>AI Recommendations</span>
            </CardTitle>
            <CardDescription>
              Get intelligent recommendations for compliance improvements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              View Recommendations
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Security Center</span>
            </CardTitle>
            <CardDescription>
              Advanced security monitoring and threat detection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/security')}
            >
              Access Security Center
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>User Management</span>
            </CardTitle>
            <CardDescription>
              Manage user accounts and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Manage Users
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest compliance and security events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="text-sm">
                  <p className="font-medium">Document analysis completed</p>
                  <p className="text-muted-foreground">Contract_v2.pdf - 2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="text-sm">
                  <p className="font-medium">Security scan initiated</p>
                  <p className="text-muted-foreground">Automated security check - 15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="text-sm">
                  <p className="font-medium">Compliance alert</p>
                  <p className="text-muted-foreground">FAR 52.219-14 review needed - 1 hour ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current system health and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Security Status</span>
                <span className="text-sm text-green-600 font-medium">Secure</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Compliance Score</span>
                <span className="text-sm text-blue-600 font-medium">94%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Active Threats</span>
                <span className="text-sm text-green-600 font-medium">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">System Uptime</span>
                <span className="text-sm text-green-600 font-medium">99.9%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
