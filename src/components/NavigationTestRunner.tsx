import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, TestTube, Play } from 'lucide-react';
import { runNavigationTests, NavigationTestResult } from '@/utils/navigationTest';

interface NavigationTestRunnerProps {
  onClose?: () => void;
}

export const NavigationTestRunner = ({ onClose }: NavigationTestRunnerProps) => {
  const [testResults, setTestResults] = useState<NavigationTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunTests = async () => {
    setIsRunning(true);
    try {
      const results = await runNavigationTests();
      setTestResults(results);
    } catch (error) {
      console.error('Test execution failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getResultIcon = (passed: boolean) => {
    return passed ? 
      <CheckCircle className="h-4 w-4 text-green-600" /> : 
      <XCircle className="h-4 w-4 text-red-600" />;
  };

  const getResultBadge = (passed: boolean) => {
    return (
      <Badge className={passed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
        {passed ? 'PASS' : 'FAIL'}
      </Badge>
    );
  };

  const summary = testResults.length > 0 ? {
    passed: testResults.filter(r => r.passed).length,
    failed: testResults.filter(r => !r.passed).length,
    total: testResults.length
  } : null;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TestTube className="h-5 w-5" />
          <span>Navigation Test Runner</span>
        </CardTitle>
        <CardDescription>
          Comprehensive testing of navigation functionality, route protection, and user experience
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Test Controls */}
        <div className="flex items-center justify-between">
          <Button 
            onClick={handleRunTests} 
            disabled={isRunning}
            className="flex items-center space-x-2"
          >
            <Play className="h-4 w-4" />
            <span>{isRunning ? 'Running Tests...' : 'Run Navigation Tests'}</span>
          </Button>
          
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </div>

        {/* Test Summary */}
        {summary && (
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{summary.passed}</div>
              <div className="text-sm text-muted-foreground">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{summary.failed}</div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{summary.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>
        )}

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Test Results</h3>
            {testResults.map((result, index) => (
              <div key={index} className="flex items-start justify-between p-4 border border-border rounded-lg">
                <div className="flex items-start space-x-3 flex-1">
                  {getResultIcon(result.passed)}
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{result.testName}</h4>
                    {result.details && (
                      <p className="text-sm text-muted-foreground mt-1">{result.details}</p>
                    )}
                    {result.error && (
                      <p className="text-sm text-red-600 mt-1">Error: {result.error}</p>
                    )}
                  </div>
                </div>
                {getResultBadge(result.passed)}
              </div>
            ))}
          </div>
        )}

        {/* Test Categories */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">Test Categories</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="p-3 border border-border rounded-lg">
              <h4 className="font-medium text-foreground mb-2">Route Definitions</h4>
              <p className="text-sm text-muted-foreground">
                Verifies all expected routes are properly defined and accessible
              </p>
            </div>
            
            <div className="p-3 border border-border rounded-lg">
              <h4 className="font-medium text-foreground mb-2">Navigation Links</h4>
              <p className="text-sm text-muted-foreground">
                Tests navigation menu links and their functionality
              </p>
            </div>
            
            <div className="p-3 border border-border rounded-lg">
              <h4 className="font-medium text-foreground mb-2">Logo Behavior</h4>
              <p className="text-sm text-muted-foreground">
                Validates logo click handling and authentication-aware navigation
              </p>
            </div>
            
            <div className="p-3 border border-border rounded-lg">
              <h4 className="font-medium text-foreground mb-2">Active States</h4>
              <p className="text-sm text-muted-foreground">
                Checks active route highlighting and visual feedback
              </p>
            </div>
            
            <div className="p-3 border border-border rounded-lg">
              <h4 className="font-medium text-foreground mb-2">Authentication</h4>
              <p className="text-sm text-muted-foreground">
                Tests navigation visibility based on user authentication status
              </p>
            </div>
            
            <div className="p-3 border border-border rounded-lg">
              <h4 className="font-medium text-foreground mb-2">Accessibility</h4>
              <p className="text-sm text-muted-foreground">
                Validates semantic structure and accessibility features
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};