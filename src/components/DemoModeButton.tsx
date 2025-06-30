
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, PlayCircle, AlertTriangle } from 'lucide-react';

interface DemoModeButtonProps {
  onStartDemo: () => Promise<void>;
  loading: boolean;
  error?: string | null;
}

export const DemoModeButton = ({ onStartDemo, loading, error }: DemoModeButtonProps) => {
  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-3">
          Want to explore without signing up?
        </p>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        <Button
          type="button"
          variant="outline"
          className="w-full bg-gradient-to-r from-blue-50 to-teal-50 border-blue-200 hover:from-blue-100 hover:to-teal-100 disabled:opacity-50"
          onClick={onStartDemo}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Setting up demo...
            </>
          ) : (
            <>
              <PlayCircle className="mr-2 h-4 w-4" />
              Try Demo Mode
            </>
          )}
        </Button>
        
        <p className="text-xs text-gray-500 mt-2">
          30-minute session • Pre-loaded with sample data
        </p>
        
        {loading && (
          <div className="mt-3 text-xs text-blue-600">
            Creating your demo environment with sample contracts and analyses...
          </div>
        )}
      </div>
    </div>
  );
};
