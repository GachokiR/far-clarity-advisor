import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './providers/auth-provider';

export function BaseProtectedRoute() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('BaseProtectedRoute must be used within an AuthProvider');
  }
  
  const { user, loading } = context;
  const [timedOut, setTimedOut] = useState(false);

  // Start a timeout guard that cancels on load completion
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimedOut(true);
      console.error('[BaseProtectedRoute] Auth check timed out');
    }, 5000); // 5 second timeout

    if (!loading) {
      clearTimeout(timer);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  // Show loading spinner until auth state is known (or timeout)
  if (loading && !timedOut) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If we've timed out, show retry UI instead of infinite loop
  if (timedOut) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Authentication Timeout
          </h2>
          <p className="text-muted-foreground mb-6">
            Authentication is taking longer than expected. Please try again.
          </p>
          <div className="space-x-4">
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Retry
            </button>
            <a 
              href="/auth"
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 inline-block"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    );
  }

  // If user exists, render nested routes; otherwise redirect to login
  return user ? <Outlet /> : <Navigate to="/auth" replace />;
}