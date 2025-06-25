
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { UploadArea } from "./UploadArea";
import { UploadProgress } from "./UploadProgress";
import { UploadedFilesList } from "./UploadedFilesList";
import { SupportedDocumentTypes } from "./SupportedDocumentTypes";
import { FileUploadProps, UploadedFile } from "./types";
import { validateFiles, createUploadedFiles, simulateFileUpload, generateMockAnalysisResults } from "./fileUtils";

export const FileUpload = ({ onAnalysisComplete }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
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
    const { validFiles, validationErrors } = validateFiles(files);

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

    const newFiles = createUploadedFiles(validFiles);
    setUploadedFiles(newFiles);
    setUploadProgress(0);

    try {
      // Simulate file upload process
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

      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const uploadResults = await Promise.allSettled(uploadPromises);
      const successfulUploads = uploadResults
        .filter((result): result is PromiseFulfilledResult<any> => 
          result.status === 'fulfilled'
        )
        .map(result => result.value);

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

      if (successfulUploads.length === 0) {
        throw new Error('No files were successfully uploaded');
      }

      setIsAnalyzing(true);

      // Simulate FAR analysis
      await new Promise(resolve => setTimeout(resolve, 3000));

      const mockResults = generateMockAnalysisResults(validFiles, successfulUploads);
      
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
        <UploadProgress uploadProgress={uploadProgress} />
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
