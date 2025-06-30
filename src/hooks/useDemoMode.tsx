
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { demoDataSeeder } from '@/services/demoDataSeeder';
import { useToast } from '@/hooks/use-toast';
import { debug } from '@/utils/debug';

interface DemoSession {
  userId: string;
  expiresAt: string;
  isActive: boolean;
  startedAt: string;
}

export const useDemoMode = () => {
  const navigate = useNavigate();
  const [demoSession, setDemoSession] = useState<DemoSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const { toast } = useToast();
  const expiryTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  debug.demo('useDemoMode hook initialized');

  const handleExpiredSession = useCallback(() => {
    debug.demo('Demo session expired, cleaning up');
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

    navigate('/auth');
  }, [toast, navigate]);

  const setupExpiryTimer = useCallback((session: DemoSession) => {
    const now = new Date();
    const expiry = new Date(session.expiresAt);
    const timeUntilExpiry = expiry.getTime() - now.getTime();

    debug.demo('Setting up expiry timer', { 
      timeUntilExpiry: Math.round(timeUntilExpiry / 1000),
      expiresAt: session.expiresAt 
    });

    if (timeUntilExpiry > 0) {
      expiryTimerRef.current = setTimeout(() => {
        handleExpiredSession();
      }, timeUntilExpiry);
    }
  }, [handleExpiredSession]);

  // Check for existing demo session on mount
  useEffect(() => {
    debug.demo('Checking for existing demo session');
    const savedSession = sessionStorage.getItem('demo-session');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession) as DemoSession;
        const now = new Date();
        const expiry = new Date(session.expiresAt);
        
        debug.demo('Found saved session', { 
          userId: session.userId,
          isExpired: expiry <= now,
          timeRemaining: Math.round((expiry.getTime() - now.getTime()) / 1000)
        });
        
        if (expiry > now) {
          setDemoSession(session);
          setupExpiryTimer(session);
          
          // Calculate and set initial time remaining
          const remaining = Math.floor((expiry.getTime() - now.getTime()) / 1000);
          setTimeRemaining(remaining);
          debug.demo('Demo session restored', { remaining });
        } else {
          debug.demo('Saved session expired, cleaning up');
          handleExpiredSession();
        }
      } catch (error) {
        debug.error('Invalid demo session data', error, 'DEMO');
        sessionStorage.removeItem('demo-session');
      }
    } else {
      debug.demo('No existing demo session found');
    }
  }, [setupExpiryTimer, handleExpiredSession]);

  // Update countdown timer
  useEffect(() => {
    if (demoSession && timeRemaining > 0) {
      debug.demo('Starting countdown timer', { timeRemaining });
      countdownTimerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            debug.demo('Countdown reached zero, expiring session');
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
  }, [demoSession, handleExpiredSession]);

  const startDemo = useCallback(async () => {
    const timer = debug.startTimer('demo-start');
    setLoading(true);
    setError(null);
    
    try {
      debug.demo('Starting demo mode');
      
      // Validate environment
      if (!crypto?.randomUUID) {
        throw new Error('Browser does not support required features for demo mode');
      }

      const userId = await demoDataSeeder.createDemoUser();
      debug.demo('Demo user created', { userId });
      
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

      debug.demo('Demo mode started successfully', { userId, expiresAt: session.expiresAt });
      timer.end('Demo mode started');
      
      // Add small delay to ensure state is updated before navigation
      await new Promise(resolve => setTimeout(resolve, 100));
      navigate('/');
      
      return session;
    } catch (error: any) {
      debug.error('Failed to start demo', error, 'DEMO');
      timer.end('Demo start failed');
      
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
  }, [toast, setupExpiryTimer, navigate]);

  const endDemo = useCallback(async () => {
    debug.demo('Ending demo mode');
    
    if (demoSession?.userId) {
      try {
        await demoDataSeeder.cleanupDemoUser(demoSession.userId);
        debug.demo('Demo cleanup completed', { userId: demoSession.userId });
      } catch (error) {
        debug.error('Demo cleanup error', error, 'DEMO');
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

    navigate('/auth');
  }, [demoSession, toast, navigate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      debug.demo('useDemoMode cleanup');
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

  debug.demo('useDemoMode state', { 
    isDemoMode, 
    loading, 
    timeRemaining,
    hasSession: !!demoSession 
  });

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
