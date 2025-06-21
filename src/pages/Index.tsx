
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileUpload } from "@/components/FileUpload";
import { ComplianceAnalysis } from "@/components/ComplianceAnalysis";
import { Dashboard } from "@/components/Dashboard";
import { ProfileManagement } from "@/components/UserProfile";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, FileText, AlertTriangle, CheckCircle, LogOut, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Index = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [analysisResults, setAnalysisResults] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut, loading, isConnected } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Redirect to auth if not logged in and Supabase is connected
  useEffect(() => {
    if (!loading && isConnected && !user) {
      navigate("/auth");
    }
  }, [user, loading, isConnected, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleAnalysisComplete = (results: any) => {
    setAnalysisResults(results);
    setActiveTab("analysis");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
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
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-3">
              <Badge variant={isConnected ? "default" : "secondary"}>
                {isConnected ? "Supabase Connected" : "Demo Mode"}
              </Badge>
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600 truncate max-w-32">{user.email}</span>
                  <Button variant="outline" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button onClick={() => navigate("/auth")}>
                  Sign In
                </Button>
              )}
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                    <SheetDescription>Navigation and account options</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    <Badge variant={isConnected ? "default" : "secondary"} className="w-full justify-center">
                      {isConnected ? "Supabase Connected" : "Demo Mode"}
                    </Badge>
                    {user ? (
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600 break-all">{user.email}</p>
                        <Button variant="outline" onClick={handleSignOut} className="w-full">
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    ) : (
                      <Button onClick={() => navigate("/auth")} className="w-full">
                        Sign In
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
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
          {!user && isConnected && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg mx-4">
              <p className="text-blue-800 text-sm sm:text-base">
                <strong>Please sign in</strong> to access full functionality and save your analysis results.
              </p>
            </div>
          )}
        </div>

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
                <FileUpload onAnalysisComplete={handleAnalysisComplete} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="mt-4 sm:mt-6">
            <ComplianceAnalysis analysisResults={analysisResults} />
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
