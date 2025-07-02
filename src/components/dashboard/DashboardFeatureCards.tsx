import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload, BarChart3, Users, Shield, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { debug } from "@/utils/debug";

interface DashboardFeatureCardsProps {
  onUploadDocuments: () => void;
}

export const DashboardFeatureCards = ({ onUploadDocuments }: DashboardFeatureCardsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleViewAnalytics = () => {
    debug.log('View analytics button clicked');
    toast({
      title: "Analytics",
      description: "Analytics dashboard coming soon.",
    });
  };

  const handleViewChecklists = () => {
    debug.log('View checklists button clicked');
    toast({
      title: "Compliance Checklists",
      description: "Compliance checklists feature coming soon.",
    });
  };

  const handleViewRecommendations = () => {
    debug.log('View recommendations button clicked');
    toast({
      title: "AI Recommendations",
      description: "AI recommendations feature coming soon.",
    });
  };

  const handleManageUsers = () => {
    debug.log('Manage users button clicked');
    toast({
      title: "User Management",
      description: "User management feature coming soon.",
    });
  };

  return (
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
          <Button className="w-full" onClick={onUploadDocuments}>
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
          <Button variant="outline" className="w-full" onClick={handleViewAnalytics}>
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
          <Button variant="outline" className="w-full" onClick={handleViewChecklists}>
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
          <Button variant="outline" className="w-full" onClick={handleViewRecommendations}>
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
          <Button variant="outline" className="w-full" onClick={handleManageUsers}>
            Manage Users
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};