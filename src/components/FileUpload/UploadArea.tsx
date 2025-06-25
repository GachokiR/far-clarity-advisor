
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface UploadAreaProps {
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const UploadArea = ({
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect
}: UploadAreaProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Card 
      className={`border-2 border-dashed transition-colors ${
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
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
          onChange={onFileSelect}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
};
