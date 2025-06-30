
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
        }
      } catch (error) {
        sessionStorage.removeItem('demo-session');
      }
    }
  }, []);

  const startDemo = useCallback(async () => {
    setLoading(true);
    try {
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

      return session;
    } catch (error) {
      console.error('Failed to start demo:', error);
      toast({
        title: "Demo Error",
        description: "Failed to start demo mode. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const endDemo = useCallback(() => {
    setDemoSession(null);
    sessionStorage.removeItem('demo-session');
    sessionStorage.removeItem('demo-banner-dismissed');
  }, []);

  const isDemoMode = !!demoSession?.isActive;

  return {
    demoSession,
    isDemoMode,
    loading,
    startDemo,
    endDemo
  };
};
