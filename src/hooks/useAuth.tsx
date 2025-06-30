
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { debug } from '@/utils/debug';

interface AuthResult {
  data: any;
  error: { message: string } | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string, userData?: any) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
  loading: boolean;
  isConnected: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);

  debug.auth('AuthProvider initializing');

  // Add connection check function
  const checkSupabaseConnection = async (): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.getSession();
      return !error;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    debug.auth('AuthProvider useEffect running');
    
    // Test Supabase connection first
    const testConnection = async () => {
      try {
        const isConnectedResult = await checkSupabaseConnection();
        if (!isConnectedResult) {
          debug.error('Supabase connection test failed', null, 'AUTH');
          setIsConnected(false);
        } else {
          debug.auth('Supabase connection test successful');
          setIsConnected(true);
        }
      } catch (error) {
        debug.error('Supabase connection test exception', error, 'AUTH');
        setIsConnected(false);
      }
    };

    testConnection();

    // Set up auth state listener FIRST
    debug.auth('Setting up auth state listener');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        debug.auth('Auth state changed', { 
          event, 
          userEmail: session?.user?.email,
          hasSession: !!session 
        });
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    debug.auth('Checking for existing session');
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        debug.error('Error getting session', error, 'AUTH');
      } else {
        debug.auth('Got existing session', { 
          userEmail: session?.user?.email,
          hasSession: !!session 
        });
      }
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      debug.auth('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    const timer = debug.startTimer('auth-signin');
    debug.auth('Attempting sign in', { email });
    
    try {
      // Check connection first
      const connectionOk = await checkSupabaseConnection();
      if (!connectionOk) {
        debug.warn('Connection check failed during sign in', { email }, 'AUTH');
        return {
          data: null,
          error: { message: 'Unable to connect to authentication service. Please check your connection and try again.' }
        };
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        debug.error('Sign in error', error, 'AUTH');
        timer.end('Sign in failed');
        return {
          data: null,
          error: { message: error.message || 'An unexpected error occurred during sign in.' }
        };
      }
      
      debug.auth('Sign in successful', { email });
      timer.end('Sign in successful');
      return { data, error: null };
    } catch (err: any) {
      debug.error('Sign in exception', err, 'AUTH');
      timer.end('Sign in exception');
      return { 
        data: null, 
        error: { message: err.message || 'An unexpected error occurred during sign in.' }
      };
    }
  };

  const signUp = async (email: string, password: string, userData?: any): Promise<AuthResult> => {
    const timer = debug.startTimer('auth-signup');
    debug.auth('Attempting sign up', { email, hasUserData: !!userData });
    
    try {
      // Check connection first
      const connectionOk = await checkSupabaseConnection();
      if (!connectionOk) {
        debug.warn('Connection check failed during sign up', { email }, 'AUTH');
        return {
          data: null,
          error: { message: 'Unable to connect to authentication service. Please check your connection and try again.' }
        };
      }
      
      const redirectUrl = `${window.location.origin}/`;
      debug.auth('Sign up redirect URL', { redirectUrl });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: userData || {}
        }
      });
      
      if (error) {
        debug.error('Sign up error', error, 'AUTH');
        timer.end('Sign up failed');
        return {
          data: null,
          error: { message: error.message || 'An unexpected error occurred during sign up.' }
        };
      }
      
      debug.auth('Sign up successful', { email });
      timer.end('Sign up successful');
      return { data, error: null };
    } catch (err: any) {
      debug.error('Sign up exception', err, 'AUTH');
      timer.end('Sign up exception');
      return { 
        data: null, 
        error: { message: err.message || 'An unexpected error occurred during sign up.' }
      };
    }
  };

  const signOut = async (): Promise<AuthResult> => {
    const timer = debug.startTimer('auth-signout');
    debug.auth('Attempting sign out');
    
    try {
      // Check connection first
      const connectionOk = await checkSupabaseConnection();
      if (!connectionOk) {
        debug.warn('Connection check failed during sign out', null, 'AUTH');
        return {
          data: null,
          error: { message: 'Unable to connect to authentication service. Please check your connection and try again.' }
        };
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        debug.error('Sign out error', error, 'AUTH');
        timer.end('Sign out failed');
        return {
          data: null,
          error: { message: error.message || 'An unexpected error occurred during sign out.' }
        };
      }
      
      debug.auth('Sign out successful');
      timer.end('Sign out successful');
      return { data: true, error: null };
    } catch (err: any) {
      debug.error('Sign out exception', err, 'AUTH');
      timer.end('Sign out exception');
      return { 
        data: null, 
        error: { message: err.message || 'An unexpected error occurred during sign out.' }
      };
    }
  };

  const value = {
    user,
    session,
    signIn,
    signUp,
    signOut,
    loading,
    isConnected,
  };

  debug.auth('AuthProvider rendering', { 
    userEmail: user?.email, 
    loading,
    isConnected,
    hasSession: !!session 
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
