
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, AlertCircle, Trash2 } from "lucide-react";
import { UploadedFile } from "./types";

interface UploadedFilesListProps {
  uploadedFiles: UploadedFile[];
  onDeleteFile: (index: number) => void;
}

export const UploadedFilesList = ({ uploadedFiles, onDeleteFile }: UploadedFilesListProps) => {
  if (uploadedFiles.length === 0) return null;

  return (
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
                       <span className="ml-2 text-green-600">• Uploaded</span>
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
                      onClick={() => onDeleteFile(index)}
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
  );
};
