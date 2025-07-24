import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qbrncgvscyyvatdgfidt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFicm5jZ3ZzY3l5dmF0ZGdmaWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxNTI2MzYsImV4cCI6MjA2NDcyODYzNn0.dVLC4qSHbW8kodyecHpQ8uh3DC7bh7ksQXNj4ekrWRE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: {
      getItem: (key) => {
        try {
          return window.localStorage.getItem(key)
        } catch {
          return null
        }
      },
      setItem: (key, value) => {
        try {
          window.localStorage.setItem(key, value)
        } catch {
          console.error('Failed to save to localStorage')
        }
      },
      removeItem: (key) => {
        try {
          window.localStorage.removeItem(key)
        } catch {
          console.error('Failed to remove from localStorage')
        }
      },
    },
    flowType: 'pkce', // More secure than implicit flow
  },
});

// Add session recovery
export const recoverSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error && error.message.includes('Invalid Refresh Token')) {
      console.log('Invalid refresh token, clearing session...')
      await supabase.auth.signOut()
      window.location.href = '/auth'
      return null
    }
    
    return session
  } catch (error) {
    console.error('Session recovery failed:', error)
    return null
  }
}