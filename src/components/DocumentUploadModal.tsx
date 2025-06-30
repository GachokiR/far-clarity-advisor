
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/FileUpload';
import { Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { debug } from '@/utils/debug';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentUploadModal = ({ isOpen, onClose }: DocumentUploadModalProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAnalysisComplete = (results: any) => {
    debug.log('Document analysis completed', results);
    
    // Store analysis results in sessionStorage for the Analysis page
    sessionStorage.setItem('analysisResults', JSON.stringify(results));
    
    toast({
      title: "Analysis Complete",
      description: `Successfully analyzed ${results.documentsAnalyzed || 0} document(s) and detected ${results.farClausesDetected?.length || 0} FAR clauses.`
    });
    
    // Close modal and navigate to analysis page
    onClose();
    navigate('/analysis');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Upload Documents</span>
          </DialogTitle>
          <DialogDescription>
            Upload documents for FAR compliance analysis. Supported formats: PDF, DOC, DOCX.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <FileUpload onAnalysisComplete={handleAnalysisComplete} />
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
