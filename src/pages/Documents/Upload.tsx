import { FileUpload } from "@/components/FileUpload";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Upload() {
  const { toast } = useToast();
  const [analysisResults, setAnalysisResults] = useState(null);

  const handleAnalysisComplete = (results: any) => {
    setAnalysisResults(results);
    toast({
      title: "Analysis Complete",
      description: "Your documents have been successfully analyzed.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Document Upload</h1>
        <p className="text-muted-foreground">
          Upload your government documents for FAR compliance analysis
        </p>
      </div>

      <FileUpload onAnalysisComplete={handleAnalysisComplete} />

      {analysisResults && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Analysis Results</h3>
          <p className="text-green-700">
            Analysis completed successfully. Check your dashboard for detailed results.
          </p>
        </div>
      )}
    </div>
  );
}