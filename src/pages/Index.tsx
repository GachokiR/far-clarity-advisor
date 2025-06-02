import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { ComplianceAnalysis } from "@/components/ComplianceAnalysis";
import { Dashboard } from "@/components/Dashboard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, FileText, AlertTriangle, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [analysisResults, setAnalysisResults] = useState(null);
  const { isConnected } = useAuth();

  const handleAnalysisComplete = (results: any) => {
    setAnalysisResults(results);
    setActiveTab("results");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Far V.02</h1>
                <p className="text-sm text-gray-600">FAR Compliance Expert</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant={isConnected ? "default" : "secondary"}>
                {isConnected ? "Supabase Connected" : "Demo Mode"}
              </Badge>
              <Button variant="outline">
                {isConnected ? "Sign In" : "Connect Supabase"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Federal Acquisition Regulation Compliance Made Simple
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Translate complex government contracting requirements into clear, actionable guidance. 
            Upload documents, analyze FAR clauses, and get compliance checklists.
          </p>
          {!isConnected && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800">
                <strong>Demo Mode:</strong> Connect Supabase to enable full authentication and data persistence features.
              </p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">1,000+</div>
              <div className="text-sm text-gray-600">FAR Clauses</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">Risk</div>
              <div className="text-sm text-gray-600">Assessment</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">Auto</div>
              <div className="text-sm text-gray-600">Compliance</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">Secure</div>
              <div className="text-sm text-gray-600">Analysis</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Application Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload">Document Upload</TabsTrigger>
            <TabsTrigger value="analysis">FAR Analysis</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Documents for Analysis</CardTitle>
                <CardDescription>
                  Upload solicitations, RFPs, bids, or contract documents to identify FAR compliance requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload onAnalysisComplete={handleAnalysisComplete} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="mt-6">
            <ComplianceAnalysis />
          </TabsContent>

          <TabsContent value="results" className="mt-6">
            {analysisResults ? (
              <Card>
                <CardHeader>
                  <CardTitle>Analysis Results</CardTitle>
                  <CardDescription>Compliance requirements and risk assessment</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
                    {JSON.stringify(analysisResults, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Results</h3>
                  <p className="text-gray-600">Upload a document to see compliance analysis results here.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="dashboard" className="mt-6">
            <Dashboard />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
