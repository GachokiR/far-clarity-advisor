import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, ArrowLeft } from 'lucide-react';
import { pdfReportService } from '@/utils/pdfReportService';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface ComplianceReportTabProps {
  complianceReport: any;
  onTabChange?: (tab: string) => void;
}

export const ComplianceReportTab = ({ complianceReport, onTabChange }: ComplianceReportTabProps) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const downloadJSONReport = () => {
    if (!complianceReport) return;
    
    const blob = new Blob([JSON.stringify(complianceReport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compliance-report-${complianceReport.type}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadPDFReport = async () => {
    if (!complianceReport) {
      toast({
        title: "No Data",
        description: "No compliance report available to generate PDF.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingPDF(true);
    try {
      await pdfReportService.generateComplianceReport(complianceReport);
      toast({
        title: "PDF Generated",
        description: "Compliance report PDF has been downloaded.",
      });
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF report.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Compliance Report</CardTitle>
            <CardDescription>Current compliance status and recommendations</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onTabChange ? onTabChange('dashboard') : navigate('/security')}
              className="flex items-center space-x-1"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Security</span>
            </Button>
          </div>
        </div>
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

            <div className="flex space-x-2">
              <Button className="flex-1" onClick={downloadJSONReport}>
                <Download className="h-4 w-4 mr-2" />
                Download JSON Report
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={downloadPDFReport}
                disabled={isGeneratingPDF}
              >
                {isGeneratingPDF ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-b-2 border-current rounded-full mr-2"></div>
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Download PDF Report
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
