
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface UseSessionTimeoutProps {
  timeoutDuration?: number; // in milliseconds
  warningDuration?: number; // time before timeout to show warning
}

export const useSessionTimeout = ({
  timeoutDuration = 30 * 60 * 1000, // 30 minutes
  warningDuration = 5 * 60 * 1000, // 5 minutes
}: UseSessionTimeoutProps = {}) => {
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const { signOut, user } = useAuth();
  const { toast } = useToast();

  const resetTimeout = useCallback(() => {
    setLastActivity(Date.now());
    setShowWarning(false);
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      toast({
        title: "Session Expired",
        description: "You have been signed out due to inactivity.",
        variant: "destructive"
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, [signOut, toast]);

  useEffect(() => {
    if (!user) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const resetTimeoutHandler = () => {
      resetTimeout();
    };

    events.forEach(event => {
      document.addEventListener(event, resetTimeoutHandler, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimeoutHandler, true);
      });
    };
  }, [user, resetTimeout]);

  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceActivity = now - lastActivity;
      const remainingTime = timeoutDuration - timeSinceActivity;

      if (remainingTime <= 0) {
        handleSignOut();
        return;
      }

      if (remainingTime <= warningDuration && !showWarning) {
        setShowWarning(true);
        setTimeLeft(Math.ceil(remainingTime / 1000));
        toast({
          title: "Session Warning",
          description: `Your session will expire in ${Math.ceil(remainingTime / 60000)} minutes due to inactivity.`,
        });
      }

      if (showWarning) {
        setTimeLeft(Math.ceil(remainingTime / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [user, lastActivity, timeoutDuration, warningDuration, showWarning, handleSignOut, toast]);

  const extendSession = useCallback(() => {
    resetTimeout();
    toast({
      title: "Session Extended",
      description: "Your session has been extended.",
    });
  }, [resetTimeout, toast]);

  return {
    showWarning,
    timeLeft,
    extendSession,
    resetTimeout
  };
};
