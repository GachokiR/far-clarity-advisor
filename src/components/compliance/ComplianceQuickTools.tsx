
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  DollarSign, 
  FileText, 
  CheckCircle, 
  Brain, 
  Shield 
} from "lucide-react";

export const ComplianceQuickTools = () => {
  return (
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
  );
};
