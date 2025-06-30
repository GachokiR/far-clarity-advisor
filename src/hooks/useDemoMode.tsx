
import { useState, useEffect, useCallback, useRef } from 'react';
import { demoDataSeeder } from '@/services/demoDataSeeder';
import { useToast } from '@/hooks/use-toast';

interface DemoSession {
  userId: string;
  expiresAt: string;
  isActive: boolean;
  startedAt: string;
}

export const useDemoMode = () => {
  const [demoSession, setDemoSession] = useState<DemoSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const { toast } = useToast();
  const expiryTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleExpiredSession = useCallback(() => {
    console.log('Demo session expired, cleaning up...');
    sessionStorage.removeItem('demo-session');
    sessionStorage.removeItem('demo-banner-dismissed');
    setDemoSession(null);
    setTimeRemaining(0);
    
    if (expiryTimerRef.current) {
      clearTimeout(expiryTimerRef.current);
      expiryTimerRef.current = null;
    }
    
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }

    toast({
      title: "Demo Session Expired",
      description: "Your 30-minute demo session has ended. Start a new demo to continue exploring.",
      variant: "destructive"
    });
  }, [toast]);

  const setupExpiryTimer = useCallback((session: DemoSession) => {
    const now = new Date();
    const expiry = new Date(session.expiresAt);
    const timeUntilExpiry = expiry.getTime() - now.getTime();

    if (timeUntilExpiry > 0) {
      expiryTimerRef.current = setTimeout(() => {
        handleExpiredSession();
      }, timeUntilExpiry);
    }
  }, [handleExpiredSession]);

  // Check for existing demo session on mount
  useEffect(() => {
    const savedSession = sessionStorage.getItem('demo-session');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession) as DemoSession;
        const now = new Date();
        const expiry = new Date(session.expiresAt);
        
        if (expiry > now) {
          setDemoSession(session);
          setupExpiryTimer(session);
          
          // Calculate and set initial time remaining
          const remaining = Math.floor((expiry.getTime() - now.getTime()) / 1000);
          setTimeRemaining(remaining);
        } else {
          handleExpiredSession();
        }
      } catch (error) {
        console.error('Invalid demo session data:', error);
        sessionStorage.removeItem('demo-session');
      }
    }
  }, [setupExpiryTimer, handleExpiredSession]);

  // Update countdown timer
  useEffect(() => {
    if (demoSession && timeRemaining > 0) {
      countdownTimerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleExpiredSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (countdownTimerRef.current) {
          clearInterval(countdownTimerRef.current);
        }
      };
    }
  }, [demoSession, timeRemaining, handleExpiredSession]);

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
      
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes
      
      const session: DemoSession = {
        userId,
        expiresAt: expiresAt.toISOString(),
        startedAt: now.toISOString(),
        isActive: true
      };
      
      setDemoSession(session);
      setTimeRemaining(30 * 60); // 30 minutes in seconds
      sessionStorage.setItem('demo-session', JSON.stringify(session));
      
      setupExpiryTimer(session);

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
        errorMessage = 'Demo setup error - please refresh and try again';
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
  }, [toast, setupExpiryTimer]);

  const endDemo = useCallback(async () => {
    console.log('Ending demo mode...');
    
    if (demoSession?.userId) {
      try {
        await demoDataSeeder.cleanupDemoUser(demoSession.userId);
      } catch (error) {
        console.error('Demo cleanup error:', error);
      }
    }
    
    setDemoSession(null);
    setError(null);
    setTimeRemaining(0);
    sessionStorage.removeItem('demo-session');
    sessionStorage.removeItem('demo-banner-dismissed');
    
    if (expiryTimerRef.current) {
      clearTimeout(expiryTimerRef.current);
      expiryTimerRef.current = null;
    }
    
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    
    toast({
      title: "Demo Session Ended",
      description: "You've exited demo mode.",
    });
  }, [demoSession, toast]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (expiryTimerRef.current) {
        clearTimeout(expiryTimerRef.current);
      }
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, []);

  const isDemoMode = !!demoSession?.isActive;
  
  const formatTimeRemaining = useCallback(() => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [timeRemaining]);

  return {
    demoSession,
    isDemoMode,
    loading,
    error,
    timeRemaining,
    formattedTimeRemaining: formatTimeRemaining(),
    startDemo,
    endDemo
  };
};
