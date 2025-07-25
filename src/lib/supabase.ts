import { supabase as originalSupabase, recoverSession } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

// Enhanced Supabase client with utility functions and debugging
export const supabase = originalSupabase;

// Utility function to check authentication status
export const checkAuth = async (): Promise<boolean> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.warn('[Auth] Session check failed:', error.message);
      return false;
    }
    
    const isAuthenticated = !!session?.user;
    if (import.meta.env.DEV) {
      console.log('[Auth] Session exists:', isAuthenticated);
    }
    
    return isAuthenticated;
  } catch (error) {
    console.error('[Auth] Check failed:', error);
    return false;
  }
};

// Helper to get current user with error handling
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.warn('[Auth] Get user failed:', error.message);
      return null;
    }
    return user;
  } catch (error) {
    console.error('[Auth] Failed to get user:', error);
    return null;
  }
};

// Enhanced session recovery with better error handling
export const getSession = async (): Promise<Session | null> => {
  try {
    return await recoverSession();
  } catch (error) {
    console.error('[Auth] Session recovery failed:', error);
    return null;
  }
};

// Debug helper - only available in development
if (import.meta.env.DEV) {
  (window as any).debugAuth = async () => {
    console.group('[Auth Debug] Authentication State');
    
    try {
      const session = await supabase.auth.getSession();
      console.log('Current session:', session);
      
      const user = await supabase.auth.getUser();
      console.log('Current user:', user);
      
      const isAuth = await checkAuth();
      console.log('Is authenticated:', isAuth);
      
      // Check localStorage
      const storageKey = 'sb-qbrncgvscyyvatdgfidt-auth-token';
      const storedAuth = localStorage.getItem(storageKey);
      console.log('Stored auth token:', storedAuth ? 'Present' : 'Missing');
      
      if (storedAuth) {
        try {
          const parsed = JSON.parse(storedAuth);
          console.log('Stored session expires:', new Date(parsed.expires_at * 1000).toLocaleString());
        } catch (e) {
          console.log('Could not parse stored auth token');
        }
      }
      
    } catch (error) {
      console.error('Debug failed:', error);
    }
    
    console.groupEnd();
  };

  // Auto-debug on window focus in development
  let lastAuthCheck = 0;
  window.addEventListener('focus', async () => {
    const now = Date.now();
    if (now - lastAuthCheck > 5000) { // Throttle to every 5 seconds
      lastAuthCheck = now;
      const isAuth = await checkAuth();
      console.log('[Auth] Focus check - authenticated:', isAuth);
    }
  });
}

// Auth state change listener with enhanced logging
export const onAuthStateChange = (callback: (event: string, session: Session | null) => void) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    if (import.meta.env.DEV) {
      console.log(`[Auth] State change: ${event}`, {
        hasSession: !!session,
        hasUser: !!session?.user,
        userId: session?.user?.id?.substring(0, 8) + '...',
      });
    }
    callback(event, session);
  });
};

// Diagnostic function for troubleshooting auth issues
export const diagnosePossibleAuthIssues = async (): Promise<string[]> => {
  const issues: string[] = [];
  
  try {
    // Check if user exists but session is invalid
    const userResult = await supabase.auth.getUser();
    const sessionResult = await supabase.auth.getSession();
    
    if (userResult.data.user && !sessionResult.data.session) {
      issues.push('User exists but session is missing - possible token expiry');
    }
    
    if (sessionResult.error?.message.includes('Invalid Refresh Token')) {
      issues.push('Refresh token is invalid - user needs to re-authenticate');
    }
    
    // Check localStorage
    const storageKey = 'sb-qbrncgvscyyvatdgfidt-auth-token';
    const storedAuth = localStorage.getItem(storageKey);
    if (!storedAuth) {
      issues.push('No auth token found in localStorage');
    }
    
    if (issues.length === 0) {
      issues.push('No obvious authentication issues detected');
    }
    
  } catch (error) {
    issues.push(`Diagnostic failed: ${error}`);
  }
  
  return issues;
};

export default supabase;