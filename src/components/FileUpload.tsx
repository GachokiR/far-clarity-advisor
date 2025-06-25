
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, AlertCircle, CheckCircle, Download, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { validateFileUpload } from "@/utils/fileUploadSecurity";

interface FileUploadProps {
  onAnalysisComplete: (results: any) => void;
}

interface UploadedFile {
  file: File;
  storagePath?: string;
  publicUrl?: string;
  status: 'uploading' | 'uploaded' | 'error';
}

export const FileUpload = ({ onAnalysisComplete }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
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
    // Validate files before processing
    const validationErrors: string[] = [];
    const validFiles: File[] = [];

    files.forEach(file => {
      const validation = validateFileUpload(file);
      if (validation.isValid && validation.sanitizedFile) {
        validFiles.push(validation.sanitizedFile);
      } else {
        validationErrors.push(`${file.name}: ${validation.errors.join(', ')}`);
      }
    });

    if (validationErrors.length > 0) {
      toast({
        title: "File Validation Error",
        description: `Some files were rejected: ${validationErrors.join('; ')}`,
        variant: "destructive"
      });
    }

    if (validFiles.length === 0) {
      return;
    }

    const newFiles: UploadedFile[] = validFiles.map(file => ({
      file,
      status: 'uploading'
    }));
    
    setUploadedFiles(newFiles);
    setUploadProgress(0);

    try {
      // Simulate file upload process without actual storage
      const uploadPromises = newFiles.map(async (fileItem, index) => {
        try {
          // Simulate upload delay
          await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
          
          // Create a mock URL for the uploaded file
          const mockUrl = `https://example.com/documents/${Date.now()}_${fileItem.file.name}`;
          
          setUploadedFiles(prev => 
            prev.map((item, i) => 
              i === index 
                ? { ...item, storagePath: `uploads/${Date.now()}_${fileItem.file.name}`, publicUrl: mockUrl, status: 'uploaded' as const }
                : item
            )
          );
          
          return { fileName: `uploads/${Date.now()}_${fileItem.file.name}`, publicUrl: mockUrl };
        } catch (error) {
          console.error(`Error uploading ${fileItem.file.name}:`, error);
          setUploadedFiles(prev => 
            prev.map((item, i) => 
              i === index 
                ? { ...item, status: 'error' as const }
                : item
            )
          );
          throw error;
        }
      });

      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const uploadResults = await Promise.allSettled(uploadPromises);
      const successfulUploads = uploadResults
        .filter((result): result is PromiseFulfilledResult<{fileName: string; publicUrl: string}> => 
          result.status === 'fulfilled'
        )
        .map(result => result.value);

      if (successfulUploads.length === 0) {
        throw new Error('No files were successfully uploaded');
      }

      setIsAnalyzing(true);

      // Simulate FAR analysis with enhanced processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Generate enhanced mock analysis results
      const mockResults = {
        documentsAnalyzed: successfulUploads.length,
        documentsUploaded: successfulUploads.map(upload => ({
          fileName: upload.fileName,
          url: upload.publicUrl
        })),
        farClausesDetected: [
          { 
            clause: "FAR 52.219-14", 
            title: "Limitations on Subcontracting", 
            risk: "High", 
            cost: "$5,000", 
            timeframe: "2-3 weeks",
            description: "Requires prime contractor to perform minimum percentage of work with own employees"
          },
          { 
            clause: "FAR 52.204-10", 
            title: "Reporting Executive Compensation", 
            risk: "Medium", 
            cost: "$2,500", 
            timeframe: "1 week",
            description: "Annual reporting of executive compensation for government contracts"
          },
          { 
            clause: "FAR 52.222-50", 
            title: "Combating Trafficking in Persons", 
            risk: "Low", 
            cost: "$1,000", 
            timeframe: "3-5 days",
            description: "Compliance plan and employee awareness training required"
          }
        ],
        riskAssessment: {
          highRisk: 1,
          mediumRisk: 1,
          lowRisk: 1
        },
        estimatedComplianceCost: "$8,500",
        estimatedTimeframe: "4-6 weeks",
        processingDetails: {
          documentTypes: ["RFP", "Contract", "Solicitation"],
          pagesProcessed: validFiles.reduce((sum, file) => sum + Math.floor(file.size / 1024), 0),
          keywordsFound: ["subcontracting", "compensation", "trafficking", "small business"]
        }
      };

      setIsAnalyzing(false);
      onAnalysisComplete({ ...mockResults, id: `demo_${Date.now()}` });

      toast({
        title: "Analysis Complete",
        description: `Successfully analyzed ${successfulUploads.length} document(s) and detected ${mockResults.farClausesDetected.length} FAR clauses.`,
      });

    } catch (error) {
      setIsAnalyzing(false);
      console.error('Error processing files:', error);
      toast({
        title: "Error",
        description: "Failed to process files. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteFile = async (index: number) => {
    const fileItem = uploadedFiles[index];
    
    toast({
      title: "File Removed",
      description: "Document has been removed from the upload list.",
    });
    
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="p-8 text-center">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Upload Government Documents
          </h3>
          <p className="text-gray-600 mb-4">
            Drop files here or click to browse. Supports PDF, DOC, DOCX files up to 10MB each.
          </p>
          <Button onClick={() => fileInputRef.current?.click()}>
            Select Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
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
              {uploadProgress < 100 ? `Uploading files... ${uploadProgress}%` : "Analyzing compliance requirements and extracting FAR clauses..."}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && !isAnalyzing && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Documents</CardTitle>
            <CardDescription>{uploadedFiles.length} file(s) processed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploadedFiles.map((fileItem, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <div className="font-medium">{fileItem.file.name}</div>
                      <div className="text-sm text-gray-600">
                        {(fileItem.file.size / 1024 / 1024).toFixed(2)} MB
                        {fileItem.publicUrl && (
                          <span className="ml-2 text-green-600">• Demo Mode</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {fileItem.status === 'uploaded' && (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteFile(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {fileItem.status === 'uploading' && (
                      <div className="animate-spin h-5 w-5 border-b-2 border-blue-600"></div>
                    )}
                    {fileItem.status === 'error' && (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
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
