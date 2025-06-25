
export interface FileUploadProps {
  onAnalysisComplete: (results: any) => void;
}

export interface UploadedFile {
  file: File;
  storagePath?: string;
  publicUrl?: string;
  status: 'uploading' | 'uploaded' | 'error';
}

export interface MockAnalysisResults {
  documentsAnalyzed: number;
  documentsUploaded: { fileName: string; url: string }[];
  farClausesDetected: {
    clause: string;
    title: string;
    risk: string;
    cost: string;
    timeframe: string;
    description: string;
  }[];
  riskAssessment: {
    highRisk: number;
    mediumRisk: number;
    lowRisk: number;
  };
  estimatedComplianceCost: string;
  estimatedTimeframe: string;
  processingDetails: {
    documentTypes: string[];
    pagesProcessed: number;
    keywordsFound: string[];
  };
}
