
import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDemoMode } from '@/hooks/useDemoMode';

export const DemoBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { isDemoMode, formattedTimeRemaining, endDemo } = useDemoMode();
  
  console.log('DemoBanner rendering', { isDemoMode, formattedTimeRemaining });

  useEffect(() => {
    const dismissed = sessionStorage.getItem('demo-banner-dismissed');
    if (dismissed) {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    console.log('Dismissing demo banner');
    setIsVisible(false);
    sessionStorage.setItem('demo-banner-dismissed', 'true');
  };

  if (!isDemoMode || !isVisible) {
    console.log('Not showing banner - isDemoMode:', isDemoMode, 'isVisible:', isVisible);
    return null;
  }

  console.log('Showing demo banner');
  return (
    <Alert className="bg-amber-50 border-amber-200 text-amber-800 rounded-none border-x-0 border-t-0">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-2">
          <div className="text-lg">🧪</div>
          <AlertDescription className="font-medium">
            Demo Mode - Data will not be saved
          </AlertDescription>
          {formattedTimeRemaining && (
            <div className="flex items-center space-x-1 text-sm">
              <Clock className="h-3 w-3" />
              <span>Session expires in {formattedTimeRemaining}</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={endDemo}
            className="h-auto p-1 text-amber-600 hover:text-amber-800 hover:bg-amber-100"
          >
            Exit Demo
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-auto p-1 text-amber-600 hover:text-amber-800 hover:bg-amber-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Alert>
  );
};
