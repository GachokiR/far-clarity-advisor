
import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DemoBannerProps {
  expiresAt?: string;
  onLogout?: () => void;
}

export const DemoBanner = ({ expiresAt, onLogout }: DemoBannerProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!expiresAt) return;

    const updateTimeLeft = () => {
      const now = new Date();
      const expiry = new Date(expiresAt);
      const diff = expiry.getTime() - now.getTime();

      if (diff <= 0) {
        onLogout?.();
        return;
      }

      const minutes = Math.floor(diff / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onLogout]);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('demo-banner-dismissed');
    if (dismissed) {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('demo-banner-dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <Alert className="bg-amber-50 border-amber-200 text-amber-800 rounded-none border-x-0 border-t-0">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-2">
          <div className="text-lg">🧪</div>
          <AlertDescription className="font-medium">
            Demo Mode - Data will not be saved
          </AlertDescription>
          {timeLeft && (
            <div className="flex items-center space-x-1 text-sm">
              <Clock className="h-3 w-3" />
              <span>Session expires in {timeLeft}</span>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="h-auto p-1 text-amber-600 hover:text-amber-800 hover:bg-amber-100"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  );
};
