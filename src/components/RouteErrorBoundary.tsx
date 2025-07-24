import { Component, ReactNode, ErrorInfo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  routeName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  retryCount: number;
}

export class RouteErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, retryCount: 0 };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Route error in ${this.props.routeName || 'Unknown'}:`, error, errorInfo);
    
    // Log route-specific errors for monitoring
    if (typeof window !== 'undefined') {
      const errorLog = {
        route: this.props.routeName || 'unknown',
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        retryCount: this.state.retryCount
      };
      
      try {
        const existingErrors = localStorage.getItem('route_errors');
        const errors = existingErrors ? JSON.parse(existingErrors) : [];
        errors.push(errorLog);
        
        // Keep only last 5 route errors
        if (errors.length > 5) {
          errors.splice(0, errors.length - 5);
        }
        
        localStorage.setItem('route_errors', JSON.stringify(errors));
      } catch (storageError) {
        // Silent fail for storage errors
      }
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({ 
      hasError: false, 
      error: undefined,
      retryCount: prevState.retryCount + 1 
    }));
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const isChunkError = this.state.error?.message?.includes('Loading chunk') || 
                          this.state.error?.message?.includes('Loading CSS chunk');
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <Card className="max-w-md w-full p-6 text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-destructive" />
            </div>
            
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {isChunkError ? 'Loading Error' : 'Something went wrong'}
            </h1>
            
            <p className="text-muted-foreground mb-6">
              {isChunkError 
                ? 'Failed to load the page resources. This may be due to a network issue or app update.'
                : `There was an error loading the ${this.props.routeName || 'page'}. Please try again.`
              }
            </p>
            
            <div className="flex gap-2 justify-center">
              <Button onClick={this.handleRetry} variant="default" className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              <Button onClick={this.handleGoHome} variant="outline" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            </div>
            
            {this.state.retryCount > 2 && (
              <p className="text-sm text-muted-foreground mt-4">
                If the problem persists, try refreshing your browser or clearing your cache.
              </p>
            )}
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
