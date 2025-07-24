
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const ConnectionStatus = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      // Use the enhanced session recovery for better error handling
      const { recoverSession } = await import('@/integrations/supabase/client');
      const session = await recoverSession();
      
      setIsConnected(true);
    } catch (error) {
      console.error('Connection check failed:', error);
      setIsConnected(false);
      toast({
        title: "Connection Issue",
        description: "Unable to connect to the server. Some features may be limited.",
        variant: "destructive"
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Check connection on mount
    checkConnection();

    // Check every 30 seconds
    const interval = setInterval(checkConnection, 30000);

    return () => clearInterval(interval);
  }, []);

  if (isConnected) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 shadow-lg z-50">
      <AlertCircle className="h-5 w-5 text-red-600" />
      <div>
        <p className="text-sm font-medium text-red-900">Connection Issue</p>
        <p className="text-xs text-red-700">Limited functionality available</p>
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={checkConnection}
        disabled={isChecking}
        className="ml-2"
      >
        {isChecking ? (
          <RefreshCw className="h-4 w-4 animate-spin" />
        ) : (
          'Retry'
        )}
      </Button>
    </div>
  );
};
