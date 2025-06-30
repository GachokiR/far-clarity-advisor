
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData?: any) => Promise<void>;
  signOut: () => Promise<void>;
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

  useEffect(() => {
    console.log('AuthProvider useEffect running');
    
    // Test Supabase connection first
    const testConnection = async () => {
      try {
        const { data, error } = await supabase.from('profiles').select('count').limit(1);
        if (error) {
          console.error('Supabase connection test failed:', error);
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

  const signIn = async (email: string, password: string) => {
    console.log('Attempting sign in for:', email);
    
    if (!isConnected) {
      const error = new Error('Please connect Supabase to enable authentication');
      console.error('Sign in failed:', error.message);
      throw error;
    }
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Sign in error:', error);
      throw error;
    } else {
      console.log('Sign in successful for:', email);
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    console.log('Attempting sign up for:', email);
    
    if (!isConnected) {
      const error = new Error('Please connect Supabase to enable authentication');
      console.error('Sign up failed:', error.message);
      throw error;
    }
    
    const redirectUrl = `${window.location.origin}/`;
    console.log('Sign up redirect URL:', redirectUrl);
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: userData || {}
      }
    });
    
    if (error) {
      console.error('Sign up error:', error);
      throw error;
    } else {
      console.log('Sign up successful for:', email);
    }
  };

  const signOut = async () => {
    console.log('Attempting sign out');
    
    if (!isConnected) {
      const error = new Error('Please connect Supabase to enable authentication');
      console.error('Sign out failed:', error.message);
      throw error;
    }
    
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
      throw error;
    } else {
      console.log('Sign out successful');
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
