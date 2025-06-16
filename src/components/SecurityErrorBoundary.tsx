
import React, { Component, ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Shield } from 'lucide-react';
import { logger } from '@/utils/productionLogger';
import { createErrorReport } from '@/utils/errorSanitizer';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  component?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string | null;
}

export class SecurityErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorId: null };
  }

  static getDerivedStateFromError(error: Error): State {
    const errorReport = createErrorReport(error, { component: 'SecurityErrorBoundary' });
    return {
      hasError: true,
      error,
      errorId: errorReport.id
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const errorReport = createErrorReport(error, {
      component: this.props.component || 'Unknown',
      errorInfo
    });

    logger.error('Security component error caught', errorReport, 'SecurityErrorBoundary');
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorId: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              <span>Security Component Error</span>
            </CardTitle>
            <CardDescription className="text-red-600">
              A security component encountered an error. Your data remains secure.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600">
              <p>Error ID: {this.state.errorId}</p>
              <p>Component: {this.props.component || 'Unknown'}</p>
            </div>
            <div className="flex space-x-2">
              <Button onClick={this.handleRetry} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                <Shield className="h-4 w-4 mr-2" />
                Refresh Page
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}
