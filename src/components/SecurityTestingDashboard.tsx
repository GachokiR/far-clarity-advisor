import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Play, 
  Download,
  Clock,
  TrendingUp,
  FileText
} from 'lucide-react';
import { securityTestingService, SecurityTestSuite, SecurityTestResult } from '@/services/securityTestingService';
import { useToast } from '@/hooks/use-toast';
import { pdfReportService } from '@/utils/pdfReportService';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SecurityTestingDashboard = () => {
  const [testSuites, setTestSuites] = useState<SecurityTestSuite[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [lastRunTime, setLastRunTime] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load existing test results
    const existingResults = securityTestingService.getTestResults();
    setTestSuites(existingResults);
  }, []);

  const runSecurityTests = async () => {
    setIsRunning(true);
    try {
      const results = await securityTestingService.runComprehensiveSecurityTests();
      setTestSuites(results);
      setLastRunTime(new Date().toISOString());
      
      const totalTests = results.reduce((acc, suite) => acc + suite.tests.length, 0);
      const passedTests = results.reduce((acc, suite) => 
        acc + suite.tests.filter(test => test.passed).length, 0
      );
      
      toast({
        title: "Security Tests Completed",
        description: `${passedTests}/${totalTests} tests passed successfully.`,
      });
    } catch (error) {
      console.error('Security tests failed:', error);
      toast({
        title: "Error",
        description: "Failed to run security tests.",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const downloadReport = () => {
    const report = securityTestingService.generateTestReport();
    const blob = new Blob([report], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-test-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadPDFReport = async () => {
    if (testSuites.length === 0) {
      toast({
        title: "No Data",
        description: "Please run security tests first to generate a PDF report.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingPDF(true);
    try {
      await pdfReportService.generateSecurityTestReport(testSuites);
      toast({
        title: "PDF Generated",
        description: "Security test report PDF has been downloaded.",
      });
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF report.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-500 text-white';
      case 'failed': return 'bg-red-500 text-white';
      case 'warning': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4" />;
      case 'failed': return <XCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: SecurityTestResult['severity']) => {
    switch (severity) {
      case 'error': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      case 'info': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const totalTests = testSuites.reduce((acc, suite) => acc + suite.tests.length, 0);
  const passedTests = testSuites.reduce((acc, suite) => 
    acc + suite.tests.filter(test => test.passed).length, 0
  );
  const failedTests = totalTests - passedTests;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Security Testing Dashboard</h2>
          <p className="text-muted-foreground">
            Comprehensive security testing and validation suite
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <Link to="/" className="flex items-center space-x-1">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
          </Button>
          <Button 
            onClick={runSecurityTests} 
            disabled={isRunning}
            className="relative"
          >
            {isRunning ? (
              <>
                <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full mr-2"></div>
                Running Tests...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run Security Tests
              </>
            )}
          </Button>
          {testSuites.length > 0 && (
            <>
              <Button variant="outline" onClick={downloadReport}>
                <Download className="h-4 w-4 mr-2" />
                Download JSON
              </Button>
              <Button 
                variant="outline" 
                onClick={downloadPDFReport}
                disabled={isGeneratingPDF}
              >
                {isGeneratingPDF ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-b-2 border-current rounded-full mr-2"></div>
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Download PDF
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Test Overview */}
      {testSuites.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTests}</div>
              <p className="text-xs text-muted-foreground">
                Across {testSuites.length} test suites
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Passed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{passedTests}</div>
              <p className="text-xs text-muted-foreground">
                {totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0}% success rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{failedTests}</div>
              <p className="text-xs text-muted-foreground">
                Requiring attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Run</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">
                {lastRunTime ? new Date(lastRunTime).toLocaleString() : 'Never'}
              </div>
              <p className="text-xs text-muted-foreground">
                Test execution time
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Test Results */}
      {testSuites.length > 0 && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Detailed Results</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {testSuites.map((suite, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg">{suite.name}</span>
                      <Badge className={getStatusColor(suite.overallStatus)}>
                        {getStatusIcon(suite.overallStatus)}
                        <span className="ml-1">{suite.overallStatus}</span>
                      </Badge>
                    </CardTitle>
                    <CardDescription>{suite.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Tests:</span>
                        <span>{suite.tests.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Passed:</span>
                        <span className="text-green-600">
                          {suite.tests.filter(t => t.passed).length}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Failed:</span>
                        <span className="text-red-600">
                          {suite.tests.filter(t => !t.passed).length}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Execution Time:</span>
                        <span>{suite.executionTime}ms</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            {testSuites.map((suite, suiteIndex) => (
              <Card key={suiteIndex}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {suite.name}
                    <Badge className={getStatusColor(suite.overallStatus)}>
                      {suite.overallStatus}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{suite.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {suite.tests.map((test, testIndex) => (
                      <div
                        key={testIndex}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          {test.passed ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                          <div>
                            <div className="font-medium">{test.testName}</div>
                            <div className={`text-sm ${getSeverityColor(test.severity)}`}>
                              {test.details}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(test.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <Badge variant={test.passed ? "default" : "destructive"}>
                          {test.passed ? 'PASS' : 'FAIL'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Performance Metrics</span>
                </CardTitle>
                <CardDescription>
                  Security test suite execution performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testSuites.map((suite, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{suite.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {suite.tests.length} tests executed
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{suite.executionTime}ms</div>
                        <div className="text-sm text-muted-foreground">
                          {Math.round(suite.executionTime / suite.tests.length)}ms avg
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {testSuites.length === 0 && !isRunning && (
        <Card>
          <CardContent className="py-12 text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Tests Run Yet</h3>
            <p className="text-gray-600 mb-4">
              Run the comprehensive security test suite to validate all security features.
            </p>
            <Button onClick={runSecurityTests}>
              <Play className="h-4 w-4 mr-2" />
              Run Security Tests
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
