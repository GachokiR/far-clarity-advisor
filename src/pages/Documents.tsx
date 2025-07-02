import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Download, Trash2, Eye } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { DocumentUploadModal } from "@/components/DocumentUploadModal";
import { useToast } from "@/hooks/use-toast";

export default function Documents() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { toast } = useToast();

  // Mock documents data
  const documents = [
    {
      id: 1,
      name: "Contract_v2.pdf",
      type: "PDF",
      size: "2.4 MB",
      uploadDate: "2024-07-01",
      status: "Analyzed"
    },
    {
      id: 2,
      name: "FAR_Compliance_Guide.docx",
      type: "DOCX", 
      size: "1.8 MB",
      uploadDate: "2024-06-30",
      status: "Processing"
    },
    {
      id: 3,
      name: "Security_Procedures.pdf",
      type: "PDF",
      size: "3.2 MB", 
      uploadDate: "2024-06-29",
      status: "Analyzed"
    }
  ];

  const handleViewDocument = (docName: string) => {
    toast({
      title: "View Document",
      description: `Opening ${docName}...`,
    });
  };

  const handleDownloadDocument = (docName: string) => {
    toast({
      title: "Download Started",
      description: `Downloading ${docName}...`,
    });
  };

  const handleDeleteDocument = (docName: string) => {
    toast({
      title: "Document Deleted",
      description: `${docName} has been removed.`,
      variant: "destructive"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Document Management</h1>
            <p className="text-muted-foreground">
              Upload, manage, and analyze your compliance documents
            </p>
          </div>
          
          <Button onClick={() => setIsUploadModalOpen(true)} className="flex items-center space-x-2">
            <Upload className="h-4 w-4" />
            <span>Upload Documents</span>
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Upload Section */}
          <Card data-tour="documents">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Quick Upload</span>
              </CardTitle>
              <CardDescription>
                Drag and drop files or click to browse and upload documents for compliance analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Drop files here or click to upload</p>
                <Button variant="outline" onClick={() => setIsUploadModalOpen(true)}>
                  Choose Files
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Documents List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Documents</CardTitle>
              <CardDescription>
                Manage and view your uploaded documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <h3 className="font-medium text-foreground">{doc.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {doc.type} • {doc.size} • Uploaded {doc.uploadDate}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        doc.status === 'Analyzed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {doc.status}
                      </span>
                      
                      <Button variant="ghost" size="sm" onClick={() => handleViewDocument(doc.name)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button variant="ghost" size="sm" onClick={() => handleDownloadDocument(doc.name)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteDocument(doc.name)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <DocumentUploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
}