
import { useState } from 'react';
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
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadComplete = (files: File[]) => {
    debug.log('Documents uploaded successfully', { count: files.length });
    toast({
      title: "Upload Complete",
      description: `${files.length} document(s) uploaded successfully.`
    });
    setIsUploading(false);
    onClose();
  };

  const handleUploadError = (error: string) => {
    debug.error('Document upload error', error);
    toast({
      title: "Upload Error",
      description: error,
      variant: "destructive"
    });
    setIsUploading(false);
  };

  const handleUploadStart = () => {
    setIsUploading(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
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
          <FileUpload
            onUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
            onUploadStart={handleUploadStart}
            maxFiles={10}
            acceptedFileTypes={['.pdf', '.doc', '.docx']}
            disabled={isUploading}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} disabled={isUploading}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
