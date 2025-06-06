
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { saveAnalysisResult } from "@/services/analysisService";
import { saveComplianceChecklist } from "@/services/complianceService";

interface FileUploadProps {
  onAnalysisComplete: (results: any) => void;
}

export const FileUpload = ({ onAnalysisComplete }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = async (files: File[]) => {
    setUploadedFiles(files);
    setIsAnalyzing(true);
    setUploadProgress(0);

    try {
      // Simulate file upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Simulate FAR analysis
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate mock analysis results
      const mockResults = {
        documentsAnalyzed: files.length,
        farClausesDetected: [
          { clause: "FAR 52.219-14", title: "Limitations on Subcontracting", risk: "High", cost: "$5,000", timeframe: "2-3 weeks" },
          { clause: "FAR 52.204-10", title: "Reporting Executive Compensation", risk: "Medium", cost: "$2,500", timeframe: "1 week" },
          { clause: "FAR 52.222-50", title: "Combating Trafficking in Persons", risk: "Low", cost: "$1,000", timeframe: "3-5 days" }
        ],
        riskAssessment: {
          highRisk: 1,
          mediumRisk: 1,
          lowRisk: 1
        },
        estimatedComplianceCost: "$8,500",
        estimatedTimeframe: "4-6 weeks"
      };

      // Save analysis result to database
      const analysisResult = await saveAnalysisResult(
        files[0].name,
        mockResults,
        'medium' // Risk level based on the analysis
      );

      // Save compliance checklists for each detected FAR clause
      for (const clause of mockResults.farClausesDetected) {
        await saveComplianceChecklist(
          clause.clause,
          [
            "Review contract requirements",
            "Implement compliance procedures",
            "Train staff on requirements",
            "Establish monitoring system"
          ],
          clause.cost,
          clause.timeframe
        );
      }

      setIsAnalyzing(false);
      onAnalysisComplete({ ...mockResults, id: analysisResult.id });

      toast({
        title: "Analysis Complete",
        description: `Successfully analyzed ${files.length} document(s) and saved ${mockResults.farClausesDetected.length} compliance checklists.`,
      });

    } catch (error) {
      setIsAnalyzing(false);
      console.error('Error saving analysis:', error);
      toast({
        title: "Error",
        description: "Failed to save analysis results. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const files = Array.from(e.dataTransfer.files);
          handleFiles(files);
        }}
      >
        <CardContent className="p-8 text-center">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Upload Government Documents
          </h3>
          <p className="text-gray-600 mb-4">
            Drop files here or click to browse. Supports PDF, DOC, DOCX files.
          </p>
          <Button onClick={() => fileInputRef.current?.click()}>
            Select Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              if (e.target.files) {
                const files = Array.from(e.target.files);
                handleFiles(files);
              }
            }}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {isAnalyzing && (
        <Card>
          <CardHeader>
            <CardTitle>Analyzing Documents</CardTitle>
            <CardDescription>Processing files and detecting FAR clauses...</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={uploadProgress} className="mb-4" />
            <div className="text-sm text-gray-600">
              {uploadProgress < 100 ? `Uploading... ${uploadProgress}%` : "Analyzing compliance requirements..."}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && !isAnalyzing && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Documents</CardTitle>
            <CardDescription>{uploadedFiles.length} file(s) ready for analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <div className="font-medium">{file.name}</div>
                    <div className="text-sm text-gray-600">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Supported File Types */}
      <Card>
        <CardHeader>
          <CardTitle>Supported Document Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-md">
              <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="font-medium">Solicitations</div>
              <div className="text-sm text-gray-600">RFPs, RFQs, IFBs</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-md">
              <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="font-medium">Contracts</div>
              <div className="text-sm text-gray-600">Awards, Modifications</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-md">
              <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="font-medium">Proposals</div>
              <div className="text-sm text-gray-600">Bids, Technical Proposals</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
