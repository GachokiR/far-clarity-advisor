
import { validateFileUpload } from "@/utils/fileUploadSecurity";
import { UploadedFile, MockAnalysisResults } from "./types";

export const validateFiles = (files: File[]) => {
  const validationErrors: string[] = [];
  const validFiles: File[] = [];

  files.forEach(file => {
    const validation = validateFileUpload(file);
    if (validation.isValid && validation.sanitizedFile) {
      validFiles.push(validation.sanitizedFile);
    } else {
      validationErrors.push(`${file.name}: ${validation.errors.join(', ')}`);
    }
  });

  return { validFiles, validationErrors };
};

export const createUploadedFiles = (files: File[]): UploadedFile[] => {
  return files.map(file => ({
    file,
    status: 'uploading' as const
  }));
};

export const simulateFileUpload = async (fileItem: UploadedFile, index: number) => {
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  // Create a mock URL for the uploaded file
  const mockUrl = `https://example.com/documents/${Date.now()}_${fileItem.file.name}`;
  
  return {
    index,
    storagePath: `uploads/${Date.now()}_${fileItem.file.name}`,
    publicUrl: mockUrl,
    status: 'uploaded' as const
  };
};

export const generateMockAnalysisResults = (validFiles: File[], successfulUploads: any[]): MockAnalysisResults => {
  return {
    documentsAnalyzed: successfulUploads.length,
    documentsUploaded: successfulUploads.map(upload => ({
      fileName: upload.fileName,
      url: upload.publicUrl
    })),
    farClausesDetected: [
      { 
        clause: "FAR 52.219-14", 
        title: "Limitations on Subcontracting", 
        risk: "High", 
        cost: "$5,000", 
        timeframe: "2-3 weeks",
        description: "Requires prime contractor to perform minimum percentage of work with own employees"
      },
      { 
        clause: "FAR 52.204-10", 
        title: "Reporting Executive Compensation", 
        risk: "Medium", 
        cost: "$2,500", 
        timeframe: "1 week",
        description: "Annual reporting of executive compensation for government contracts"
      },
      { 
        clause: "FAR 52.222-50", 
        title: "Combating Trafficking in Persons", 
        risk: "Low", 
        cost: "$1,000", 
        timeframe: "3-5 days",
        description: "Compliance plan and employee awareness training required"
      }
    ],
    riskAssessment: {
      highRisk: 1,
      mediumRisk: 1,
      lowRisk: 1
    },
    estimatedComplianceCost: "$8,500",
    estimatedTimeframe: "4-6 weeks",
    processingDetails: {
      documentTypes: ["RFP", "Contract", "Solicitation"],
      pagesProcessed: validFiles.reduce((sum, file) => sum + Math.floor(file.size / 1024), 0),
      keywordsFound: ["subcontracting", "compensation", "trafficking", "small business"]
    }
  };
};
