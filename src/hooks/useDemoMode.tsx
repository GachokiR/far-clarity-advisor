
import { useState, useEffect, useCallback } from 'react';
import { demoDataSeeder } from '@/services/demoDataSeeder';
import { useToast } from '@/hooks/use-toast';

interface DemoSession {
  userId: string;
  expiresAt: string;
  isActive: boolean;
}

export const useDemoMode = () => {
  const [demoSession, setDemoSession] = useState<DemoSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing demo session on mount
    const savedSession = sessionStorage.getItem('demo-session');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        const now = new Date();
        const expiry = new Date(session.expiresAt);
        
        if (expiry > now) {
          setDemoSession(session);
        } else {
          sessionStorage.removeItem('demo-session');
          toast({
            title: "Demo Session Expired",
            description: "Your demo session has expired. Please start a new one.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Invalid demo session data:', error);
        sessionStorage.removeItem('demo-session');
      }
    }
  }, [toast]);

  const startDemo = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Starting demo mode...');
      
      // Validate environment
      if (!crypto?.randomUUID) {
        throw new Error('Browser does not support required features for demo mode');
      }

      const userId = await demoDataSeeder.createDemoUser();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 30);

      const session: DemoSession = {
        userId,
        expiresAt: expiresAt.toISOString(),
        isActive: true
      };

      setDemoSession(session);
      sessionStorage.setItem('demo-session', JSON.stringify(session));

      toast({
        title: "Welcome to Demo Mode! 🎉",
        description: "Explore Far V.02 with pre-loaded sample data. Your session will last 30 minutes.",
      });

      console.log('Demo mode started successfully:', userId);
      return session;
    } catch (error: any) {
      console.error('Failed to start demo:', error);
      
      let errorMessage = 'Failed to start demo mode';
      
      // Handle specific error types
      if (error?.message?.includes('violates row-level security')) {
        errorMessage = 'Demo setup error - authentication required';
      } else if (error?.message?.includes('foreign key')) {
        errorMessage = 'Demo setup error - please try again in a moment';
      } else if (error?.message?.includes('auth')) {
        errorMessage = 'Authentication setup failed - please try again';
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      
      toast({
        title: "Demo Mode Error",
        description: errorMessage + ". Please try again.",
        variant: "destructive"
      });
      
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const endDemo = useCallback(() => {
    console.log('Ending demo mode...');
    setDemoSession(null);
    setError(null);
    sessionStorage.removeItem('demo-session');
    sessionStorage.removeItem('demo-banner-dismissed');
    
    toast({
      title: "Demo Session Ended",
      description: "You've exited demo mode.",
    });
  }, [toast]);

  const isDemoMode = !!demoSession?.isActive;

  return {
    demoSession,
    isDemoMode,
    loading,
    error,
    startDemo,
    endDemo
  };
};
