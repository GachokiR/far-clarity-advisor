
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain } from "lucide-react";

interface ComplianceAnalysisHeaderProps {
  analysisResults?: any;
}

export const ComplianceAnalysisHeader = ({ analysisResults }: ComplianceAnalysisHeaderProps) => {
  if (!analysisResults) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-blue-600" />
          <span>AI Analysis Results</span>
        </CardTitle>
        <CardDescription>Enhanced AI-powered compliance analysis and recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-1">Documents Analyzed</h4>
            <p className="text-2xl font-bold text-blue-700">{analysisResults.documentsAnalyzed || 0}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-1">FAR Clauses Detected</h4>
            <p className="text-2xl font-bold text-green-700">{analysisResults.farClausesDetected?.length || 0}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-medium text-orange-900 mb-1">Est. Compliance Cost</h4>
            <p className="text-2xl font-bold text-orange-700">{analysisResults.estimatedComplianceCost || 'TBD'}</p>
          </div>
        </div>

        {analysisResults.farClausesDetected && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Detected FAR Clauses:</h4>
            {analysisResults.farClausesDetected.map((clause: any, index: number) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h5 className="font-medium">{clause.clause}</h5>
                    <p className="text-sm text-gray-600">{clause.title}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={
                      clause.risk === 'high' ? 'bg-red-100 text-red-800' :
                      clause.risk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }>
                      {clause.risk} risk
                    </Badge>
                    <Badge variant="outline">{clause.cost}</Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-2">{clause.description}</p>
                <div className="text-xs text-gray-500">
                  Timeframe: {clause.timeframe}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
