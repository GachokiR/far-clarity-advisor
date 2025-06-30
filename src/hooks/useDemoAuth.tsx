
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
  console.log('DemoAuthProvider initializing');
  
  const { user } = useAuth();
  const [isDemoUser, setIsDemoUser] = useState(false);
  
  // Use try-catch to handle potential hook errors
  let demoSession = null;
  let isDemoMode = false;
  let startDemo: () => Promise<any> = async () => null;
  let endDemo = () => {};
  
  try {
    const demoState = useDemoMode();
    demoSession = demoState.demoSession;
    isDemoMode = demoState.isDemoMode;
    startDemo = demoState.startDemo;
    endDemo = demoState.endDemo;
    console.log('Demo mode state:', { isDemoMode, demoSession: !!demoSession });
  } catch (error) {
    console.error('Error getting demo mode state:', error);
  }

  useEffect(() => {
    const newIsDemoUser = isDemoMode || (user?.email?.includes('@demo.') ?? false);
    console.log('Updating isDemoUser:', newIsDemoUser);
    setIsDemoUser(newIsDemoUser);
  }, [isDemoMode, user]);

  const startDemoMode = async () => {
    console.log('Starting demo mode from DemoAuth');
    try {
      const session = await startDemo();
      if (session) {
        console.log('Demo session created, redirecting');
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Failed to start demo mode:', error);
      throw error;
    }
  };

  const endDemoMode = () => {
    console.log('Ending demo mode from DemoAuth');
    try {
      endDemo();
      window.location.href = '/auth';
    } catch (error) {
      console.error('Failed to end demo mode:', error);
    }
  };

  console.log('DemoAuthProvider rendering with isDemoUser:', isDemoUser);

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
