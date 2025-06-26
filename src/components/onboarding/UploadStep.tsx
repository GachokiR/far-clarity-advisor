
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Download, FileText, CheckCircle } from "lucide-react";
import { FileUpload } from "@/components/FileUpload";
import { wordReportService } from "@/utils/wordReportService";

interface UploadStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const UploadStep = ({ onNext, onPrevious }: UploadStepProps) => {
  const [hasUploaded, setHasUploaded] = useState(false);
  const [isGeneratingSample, setIsGeneratingSample] = useState(false);

  const handleAnalysisComplete = (results: any) => {
    setHasUploaded(true);
    // Store results for next step
    sessionStorage.setItem('onboarding_analysis', JSON.stringify(results));
  };

  const downloadSampleContract = async () => {
    setIsGeneratingSample(true);
    try {
      await wordReportService.generateSampleGovernmentContract();
    } catch (error) {
      console.error('Failed to generate sample contract:', error);
    } finally {
      setIsGeneratingSample(false);
    }
  };

  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
          <Upload className="h-10 w-10 text-blue-600" />
        </div>
      </div>

      <div>
        <h3 className="text-3xl font-bold text-gray-900 mb-2">
          Upload Your First Document
        </h3>
        <p className="text-lg text-gray-600">
          Let's analyze a real government contract
        </p>
      </div>

      {!hasUploaded ? (
        <div className="max-w-2xl mx-auto">
          <p className="text-gray-600 mb-6">
            Upload any government contract, RFP, or solicitation document. 
            Don't have one handy? Download our sample contract to see how the analysis works.
          </p>

          <div className="mb-8">
            <Button
              variant="outline"
              onClick={downloadSampleContract}
              disabled={isGeneratingSample}
              className="mb-6"
            >
              {isGeneratingSample ? (
                <>
                  <div className="animate-spin h-4 w-4 border-b-2 border-current rounded-full mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download Sample Contract
                </>
              )}
            </Button>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <FileUpload onAnalysisComplete={handleAnalysisComplete} />
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p>Supported formats: PDF, DOC, DOCX • Max size: 10MB</p>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-green-800">Upload Successful!</h4>
                <p className="text-sm text-green-600">
                  Your document has been processed and analyzed. Let's see what we found.
                </p>
              </div>
            </div>
          </div>

          <Button size="lg" onClick={onNext} className="bg-blue-600 hover:bg-blue-700">
            View Analysis Results
          </Button>
        </div>
      )}
    </div>
  );
};
