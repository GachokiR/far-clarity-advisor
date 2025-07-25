import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { UploadArea } from "./UploadArea";
import { UploadedFilesList } from "./UploadedFilesList";
import { SupportedDocumentTypes } from "./SupportedDocumentTypes";
import { StatusTracker } from "./StatusTracker";
import { FileUploadProps, UploadedFile } from "./types";
import { validateFiles, createUploadedFiles, simulateFileUpload, generateMockAnalysisResults } from "./fileUtils";

interface AnalysisStep {
  label: string;
  status: 'pending' | 'success' | 'error' | 'warn';
  note?: string;
}

export const FileUpload = ({ onAnalysisComplete }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>([]);
  const { toast } = useToast();

  const initializeAnalysisSteps = () => {
    const steps: AnalysisStep[] = [
      { label: "Validating files", status: 'pending' },
      { label: "Security scan", status: 'pending' },
      { label: "Uploading documents", status: 'pending' },
      { label: "AI analysis", status: 'pending' },
      { label: "Processing results", status: 'pending' }
    ];
    setAnalysisSteps(steps);
    return steps;
  };

  const updateStepStatus = (stepIndex: number, status: AnalysisStep['status'], note?: string) => {
    setAnalysisSteps(prev => prev.map((step, index) => 
      index === stepIndex ? { ...step, status, note } : step
    ));
  };

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
    const steps = initializeAnalysisSteps();
    setIsAnalyzing(true);

    try {
      // Step 1: File validation
      updateStepStatus(0, 'pending', 'Checking file types and sizes...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { validFiles, validationErrors } = validateFiles(files);

      if (validationErrors.length > 0) {
        updateStepStatus(0, 'warn', `${validationErrors.length} files rejected`);
        toast({
          title: "File Validation Warning",
          description: `Some files were rejected: ${validationErrors.join('; ')}`,
          variant: "destructive"
        });
      } else {
        updateStepStatus(0, 'success', `${validFiles.length} files validated`);
      }

      if (validFiles.length === 0) {
        updateStepStatus(0, 'error', 'No valid files to process');
        setIsAnalyzing(false);
        return;
      }

      // Step 2: Security scan
      updateStepStatus(1, 'pending', 'Scanning for sensitive data...');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate security scan - in real implementation this would check for PII
      const hasSensitiveData = Math.random() < 0.1;
      if (hasSensitiveData) {
        updateStepStatus(1, 'warn', 'Potential sensitive data detected');
      } else {
        updateStepStatus(1, 'success', 'Security scan passed');
      }

      // Step 3: File upload
      updateStepStatus(2, 'pending', 'Uploading documents...');
      const newFiles = createUploadedFiles(validFiles);
      setUploadedFiles(newFiles);

      try {
        const uploadPromises = newFiles.map((fileItem, index) => 
          simulateFileUpload(fileItem, index).catch(error => {
            console.error(`Error uploading ${fileItem.file.name}:`, error);
            setUploadedFiles(prev => 
              prev.map((item, i) => 
                i === index 
                  ? { ...item, status: 'error' as const }
                  : item
              )
            );
            throw error;
          })
        );

        const uploadResults = await Promise.allSettled(uploadPromises);
        const successfulUploads = uploadResults
          .filter((result): result is PromiseFulfilledResult<any> => 
            result.status === 'fulfilled'
          )
          .map(result => result.value);

        if (successfulUploads.length === 0) {
          updateStepStatus(2, 'error', 'Upload failed');
          throw new Error('No files were successfully uploaded');
        }

        updateStepStatus(2, 'success', `${successfulUploads.length} files uploaded`);

        // Update files with successful upload results
        successfulUploads.forEach(upload => {
          setUploadedFiles(prev => 
            prev.map((item, i) => 
              i === upload.index 
                ? { ...item, storagePath: upload.storagePath, publicUrl: upload.publicUrl, status: upload.status }
                : item
            )
          );
        });

        // Step 4: AI analysis
        updateStepStatus(3, 'pending', 'Analyzing FAR compliance...');
        await new Promise(resolve => setTimeout(resolve, 2500));
        updateStepStatus(3, 'success', 'AI analysis completed');

        // Step 5: Processing results
        updateStepStatus(4, 'pending', 'Generating report...');
        await new Promise(resolve => setTimeout(resolve, 500));

        const mockResults = generateMockAnalysisResults(validFiles, successfulUploads);
        updateStepStatus(4, 'success', `${mockResults.farClausesDetected.length} FAR clauses detected`);

        onAnalysisComplete({ ...mockResults, id: crypto.randomUUID() });

        toast({
          title: "Analysis Complete",
          description: `Successfully analyzed ${successfulUploads.length} document(s) and detected ${mockResults.farClausesDetected.length} FAR clauses.`,
        });

      } catch (uploadError) {
        updateStepStatus(2, 'error', 'Upload failed');
        throw uploadError;
      }

    } catch (error) {
      console.error('Error processing files:', error);
      
      // Mark remaining steps as failed
      setAnalysisSteps(prev => prev.map(step => 
        step.status === 'pending' ? { ...step, status: 'error' as const } : step
      ));

      toast({
        title: "Error",
        description: "Failed to process files. Please try again.",
        variant: "destructive"
      });
    } finally {
      // Keep analysis view visible for a moment to show final status
      setTimeout(() => setIsAnalyzing(false), 2000);
    }
  };

  const handleDeleteFile = async (index: number) => {
    toast({
      title: "File Removed",
      description: "Document has been removed from the upload list.",
    });
    
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <UploadArea
        isDragging={isDragging}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onFileSelect={handleFileSelect}
      />

      {isAnalyzing && (
        <StatusTracker steps={analysisSteps} />
      )}

      {uploadedFiles.length > 0 && !isAnalyzing && (
        <UploadedFilesList 
          uploadedFiles={uploadedFiles}
          onDeleteFile={handleDeleteFile}
        />
      )}

      <SupportedDocumentTypes />
    </div>
  );
};
