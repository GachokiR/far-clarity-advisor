
import { createContext, useContext, useEffect, useState } from 'react';
import { useDemoMode } from '@/hooks/useDemoMode';
import { useAuth } from '@/hooks/useAuth';

interface DemoAuthContextType {
  isDemoUser: boolean;
  demoSession: any;
  startDemoMode: () => Promise<void>;
  endDemoMode: () => void;
}

const DemoAuthContext = createContext<DemoAuthContextType | undefined>(undefined);

export const DemoAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { demoSession, isDemoMode, startDemo, endDemo } = useDemoMode();
  const [isDemoUser, setIsDemoUser] = useState(false);

  useEffect(() => {
    setIsDemoUser(isDemoMode || (user?.email?.includes('@demo.com') ?? false));
  }, [isDemoMode, user]);

  const startDemoMode = async () => {
    const session = await startDemo();
    if (session) {
      // Simulate authentication for demo user
      window.location.href = '/';
    }
  };

  const endDemoMode = () => {
    endDemo();
    window.location.href = '/auth';
  };

  return (
    <DemoAuthContext.Provider value={{
      isDemoUser,
      demoSession,
      startDemoMode,
      endDemoMode
    }}>
      {children}
    </DemoAuthContext.Provider>
  );
};

export const useDemoAuth = () => {
  const context = useContext(DemoAuthContext);
  if (context === undefined) {
    throw new Error('useDemoAuth must be used within a DemoAuthProvider');
  }
  return context;
};
