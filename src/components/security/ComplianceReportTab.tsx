
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface ComplianceReportTabProps {
  complianceReport: any;
}

export const ComplianceReportTab = ({ complianceReport }: ComplianceReportTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance Report</CardTitle>
        <CardDescription>Current compliance status and recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        {complianceReport && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-1">Security Events</h4>
                <p className="text-2xl font-bold text-blue-700">
                  {complianceReport.summary.totalSecurityEvents}
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-red-900 mb-1">Critical Alerts</h4>
                <p className="text-2xl font-bold text-red-700">
                  {complianceReport.summary.criticalAlerts}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-1">Compliance Score</h4>
                <p className="text-2xl font-bold text-green-700">
                  {complianceReport.summary.complianceScore}%
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Recommendations</h4>
              <ul className="space-y-2">
                {complianceReport.details.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Full Report
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
