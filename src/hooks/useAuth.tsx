
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

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

  console.log('AuthProvider initializing');

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
    console.log('AuthProvider useEffect running');
    
    // Test Supabase connection first
    const testConnection = async () => {
      try {
        const isConnected = await checkSupabaseConnection();
        if (!isConnected) {
          console.error('Supabase connection test failed');
          setIsConnected(false);
        } else {
          console.log('Supabase connection test successful');
          setIsConnected(true);
        }
      } catch (error) {
        console.error('Supabase connection test exception:', error);
        setIsConnected(false);
      }
    };

    testConnection();

    // Set up auth state listener FIRST
    console.log('Setting up auth state listener');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    console.log('Checking for existing session');
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
      } else {
        console.log('Got existing session:', session?.user?.email);
      }
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    console.log('Attempting sign in for:', email);
    
    try {
      // Check connection first
      const connectionOk = await checkSupabaseConnection();
      if (!connectionOk) {
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
        console.error('Sign in error:', error);
        return {
          data: null,
          error: { message: error.message || 'An unexpected error occurred during sign in.' }
        };
      }
      
      console.log('Sign in successful for:', email);
      return { data, error: null };
    } catch (err: any) {
      console.error('Sign in exception:', err);
      return { 
        data: null, 
        error: { message: err.message || 'An unexpected error occurred during sign in.' }
      };
    }
  };

  const signUp = async (email: string, password: string, userData?: any): Promise<AuthResult> => {
    console.log('Attempting sign up for:', email);
    
    try {
      // Check connection first
      const connectionOk = await checkSupabaseConnection();
      if (!connectionOk) {
        return {
          data: null,
          error: { message: 'Unable to connect to authentication service. Please check your connection and try again.' }
        };
      }
      
      const redirectUrl = `${window.location.origin}/`;
      console.log('Sign up redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: userData || {}
        }
      });
      
      if (error) {
        console.error('Sign up error:', error);
        return {
          data: null,
          error: { message: error.message || 'An unexpected error occurred during sign up.' }
        };
      }
      
      console.log('Sign up successful for:', email);
      return { data, error: null };
    } catch (err: any) {
      console.error('Sign up exception:', err);
      return { 
        data: null, 
        error: { message: err.message || 'An unexpected error occurred during sign up.' }
      };
    }
  };

  const signOut = async (): Promise<AuthResult> => {
    console.log('Attempting sign out');
    
    try {
      // Check connection first
      const connectionOk = await checkSupabaseConnection();
      if (!connectionOk) {
        return {
          data: null,
          error: { message: 'Unable to connect to authentication service. Please check your connection and try again.' }
        };
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        return {
          data: null,
          error: { message: error.message || 'An unexpected error occurred during sign out.' }
        };
      }
      
      console.log('Sign out successful');
      return { data: true, error: null };
    } catch (err: any) {
      console.error('Sign out exception:', err);
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

  console.log('AuthProvider rendering with user:', user?.email, 'loading:', loading);

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
