import { useState } from "react";
import { Link } from "react-router-dom";
import { FileUpload } from "@/components/FileUpload";
import { ComplianceAnalysis } from "@/components/ComplianceAnalysis";
import { Dashboard } from "@/components/Dashboard";
import { ProfileManagement } from "@/components/UserProfile";
import { TrialLimitsIndicator } from "@/components/TrialLimitsIndicator";
import { TrialLimitsWrapper } from "@/components/TrialLimitsWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, FileText, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [analysisResults, setAnalysisResults] = useState(null);
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleAnalysisComplete = (results: any) => {
    setAnalysisResults(results);
    setActiveTab("analysis");
  };

  const handleUpgrade = () => {
    toast({
      title: "Upgrade Available",
      description: "Contact support to upgrade your plan and unlock unlimited access.",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Far V.02</h1>
                  <p className="text-xs sm:text-sm text-gray-600">FAR Compliance Expert</p>
                </div>
              </div>
              
              <Link to="/auth">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              FAR Compliance
              <span className="text-blue-600 block">Made Simple</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Transform complex government contracting requirements into clear, actionable guidance with AI-powered analysis.
            </p>
            <Link to="/auth">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4">
                Start Your 14-Day Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="text-sm text-gray-500 mt-3">No credit card required • Cancel anytime</p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <FileText className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Document Analysis</h3>
                <p className="text-gray-600 text-sm">Upload and analyze RFPs, bids, and contract documents instantly</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Risk Assessment</h3>
                <p className="text-gray-600 text-sm">Identify potential compliance risks before they become problems</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Auto Compliance</h3>
                <p className="text-gray-600 text-sm">Generate compliance checklists and action items automatically</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Shield className="h-8 w-8 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Secure Platform</h3>
                <p className="text-gray-600 text-sm">Enterprise-grade security for your sensitive contract data</p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your FAR Compliance Process?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join hundreds of contractors who are already saving time and reducing risk with Far V.02
            </p>
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                Get Started Now - It's Free
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Far V.02</h1>
                <p className="text-xs sm:text-sm text-gray-600">FAR Compliance Expert</p>
              </div>
            </div>
            
            {/* Status Badge */}
            <div className="flex items-center">
              <Badge variant="default">
                Trial Active
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Welcome Section */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Federal Acquisition Regulation Compliance Made Simple
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
            Translate complex government contracting requirements into clear, actionable guidance. 
            Upload documents, analyze FAR clauses, and get compliance checklists.
          </p>
        </div>

        {/* Trial Status Banner */}
        <TrialLimitsIndicator 
          variant="banner"
          onUpgrade={handleUpgrade}
          className="mb-6"
        />

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-3 sm:p-6 text-center">
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-lg sm:text-2xl font-bold text-gray-900">1,000+</div>
              <div className="text-xs sm:text-sm text-gray-600">FAR Clauses</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-6 text-center">
              <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-lg sm:text-2xl font-bold text-gray-900">Risk</div>
              <div className="text-xs sm:text-sm text-gray-600">Assessment</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-6 text-center">
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mx-auto mb-2" />
              <div className="text-lg sm:text-2xl font-bold text-gray-900">Auto</div>
              <div className="text-xs sm:text-sm text-gray-600">Compliance</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-6 text-center">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-lg sm:text-2xl font-bold text-gray-900">Secure</div>
              <div className="text-xs sm:text-sm text-gray-600">Analysis</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Application Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`${isMobile ? 'grid grid-cols-2 gap-1 h-auto p-1' : 'grid grid-cols-4'} w-full`}>
            <TabsTrigger value="upload" className={isMobile ? 'text-xs px-2 py-3' : ''}>
              {isMobile ? 'Upload' : 'Document Upload'}
            </TabsTrigger>
            <TabsTrigger value="analysis" className={isMobile ? 'text-xs px-2 py-3' : ''}>
              {isMobile ? 'Analysis' : 'FAR Analysis'}
            </TabsTrigger>
            <TabsTrigger value="dashboard" className={isMobile ? 'text-xs px-2 py-3' : ''}>
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="profile" className={isMobile ? 'text-xs px-2 py-3' : ''}>
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-4 sm:mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Upload Documents for Analysis</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Upload solicitations, RFPs, bids, or contract documents to identify FAR compliance requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TrialLimitsWrapper 
                  checkType="documents"
                  blockingMessage="You've reached your document upload limit for this trial."
                  showLimitsBeforeAction={true}
                >
                  <FileUpload onAnalysisComplete={handleAnalysisComplete} />
                </TrialLimitsWrapper>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="mt-4 sm:mt-6">
            <div className="space-y-4">
              {/* Trial limits indicator for analysis page */}
              <TrialLimitsIndicator 
                variant="full"
                onUpgrade={handleUpgrade}
              />
              
              <TrialLimitsWrapper 
                checkType="analyses"
                blockingMessage="You've reached your analysis limit for this month."
                showLimitsBeforeAction={false}
              >
                <ComplianceAnalysis analysisResults={analysisResults} />
              </TrialLimitsWrapper>
            </div>
          </TabsContent>

          <TabsContent value="dashboard" className="mt-4 sm:mt-6">
            <Dashboard />
          </TabsContent>

          <TabsContent value="profile" className="mt-4 sm:mt-6">
            <ProfileManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
