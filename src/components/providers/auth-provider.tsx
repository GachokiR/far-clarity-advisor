import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, recoverSession } from '@/integrations/supabase/client';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ data?: any; error?: any }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ data?: any; error?: any }>;
  signOut: () => Promise<{ error?: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Export AuthContext for direct use
export { AuthContext };

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    // Set up auth state listener with enhanced error handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        if (import.meta.env.DEV) {
          console.log(`[AuthProvider] Auth event: ${event}`, {
            hasSession: !!session,
            hasUser: !!session?.user
          });
        }
        
        // Handle session updates
        setSession(session);
        setUser(session?.user ?? null);
        
        // Only set loading to false after we've processed the session
        if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          setLoading(false);
        }
        
        // Handle specific auth events
        if (event === 'TOKEN_REFRESHED') {
          console.log('[AuthProvider] Token refreshed successfully');
        } else if (event === 'SIGNED_OUT') {
          console.log('[AuthProvider] User signed out');
        }
      }
    );

    // Get initial session - let onAuthStateChange handle the rest
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[AuthProvider] Initial session error:', error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }
        
        // The onAuthStateChange will handle setting the session
        // We just need to ensure loading is set to false if no session
        if (!session && mounted) {
          setSession(null);
          setUser(null);
          setLoading(false);
        }
      } catch (error) {
        console.error('[AuthProvider] Failed to initialize auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await supabase.auth.signInWithPassword({ email, password });
      return result;
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const result = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: redirectUrl,
          ...(userData ? { data: userData } : {})
        }
      });
      
      if (result.error) {
        console.error('[AuthProvider] Signup error:', result.error.message);
      } else {
        console.log('[AuthProvider] Signup successful:', {
          user: !!result.data.user,
          session: !!result.data.session,
          needsConfirmation: !result.data.session && result.data.user
        });
      }
      
      return result;
    } catch (error) {
      console.error('[AuthProvider] Signup exception:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const result = await supabase.auth.signOut();
      return result;
    } catch (error) {
      return { error };
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    isAuthenticated: !!user,
    isLoading: loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};