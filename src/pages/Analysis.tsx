
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ComplianceAnalysis } from '@/components/ComplianceAnalysis';
import { BreadcrumbNavigation } from '@/components/ui/breadcrumb-navigation';
import { AppHeader } from '@/components/AppHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ArrowLeft } from 'lucide-react';
import { debug } from '@/utils/debug';

const Analysis = () => {
  const navigate = useNavigate();
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  useEffect(() => {
    // Retrieve analysis results from sessionStorage
    const storedResults = sessionStorage.getItem('analysisResults');
    if (storedResults) {
      try {
        const results = JSON.parse(storedResults);
        debug.log('Retrieved analysis results from sessionStorage', results);
        setAnalysisResults(results);
      } catch (error) {
        debug.error('Error parsing analysis results from sessionStorage', error);
        navigate('/');
      }
    } else {
      // No analysis results available, redirect to dashboard
      debug.log('No analysis results found, redirecting to dashboard');
      navigate('/');
    }
  }, [navigate]);

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/' },
    { label: 'Document Analysis' }
  ];

  if (!analysisResults) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>No Analysis Results</span>
              </CardTitle>
              <CardDescription>
                No analysis results found. Please upload documents first.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/')} className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <div className="container mx-auto px-4 py-8">
        <BreadcrumbNavigation 
          items={breadcrumbItems}
          showBackButton={true}
          showHomeButton={true}
        />
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Document Analysis Results</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive FAR compliance analysis and recommendations
          </p>
        </div>

        <ComplianceAnalysis analysisResults={analysisResults} />
      </div>
    </div>
  );
};

export default Analysis;
