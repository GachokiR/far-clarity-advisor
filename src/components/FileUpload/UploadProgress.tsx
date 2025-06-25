
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface UploadProgressProps {
  uploadProgress: number;
}

export const UploadProgress = ({ uploadProgress }: UploadProgressProps) => {
  return (
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
  );
};
