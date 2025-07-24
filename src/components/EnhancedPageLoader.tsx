import { useEffect, useState } from 'react';

interface EnhancedPageLoaderProps {
  routeName?: string;
  message?: string;
}

const routeMessages: Record<string, string> = {
  dashboard: 'Loading your dashboard...',
  documents: 'Loading documents...',
  upload: 'Preparing upload interface...',
  analysis: 'Loading analysis tools...',
  compliance: 'Loading compliance data...',
  reports: 'Generating reports...',
  security: 'Loading security dashboard...',
  default: 'Loading...'
};

export function EnhancedPageLoader({ routeName, message }: EnhancedPageLoaderProps) {
  const [dots, setDots] = useState('');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    
    return () => clearInterval(interval);
  }, []);

  const loadingMessage = message || 
    (routeName ? routeMessages[routeName] || routeMessages.default : routeMessages.default);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <div className="absolute inset-0 rounded-full border-2 border-primary/20"></div>
        </div>
        
        <div className="space-y-2">
          <p className="text-lg text-foreground font-medium">
            {loadingMessage}{dots}
          </p>
          {routeName && (
            <p className="text-sm text-muted-foreground">
              Initializing {routeName} module
            </p>
          )}
        </div>
        
        <div className="w-48 mx-auto bg-muted rounded-full h-1">
          <div className="bg-primary h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
      </div>
    </div>
  );
}