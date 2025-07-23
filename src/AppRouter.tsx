import React from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { TourProvider } from '@reactour/tour';
import { tourConfig } from '@/config/tour';

import AppLayout from '@/components/layout/AppLayout';
import Index from '@/pages/Index';
import Documents from '@/pages/Documents';
import Upload from '@/pages/Documents/Upload';
import Compliance from '@/pages/Compliance';
import Checklists from '@/pages/Checklists';
import Analytics from '@/pages/Analytics';
import Reports from '@/pages/Reports';
import SecurityDashboard from '@/pages/Admin/Security';
import AuthPage from '@/pages/Auth';
import NotFound from '@/pages/NotFound';
import LandingPage from '@/pages/LandingPage';

/* Resetting Error Boundary */
class RawErrorBoundary extends React.Component<{ fallback?: React.ReactNode; children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <div>Something went wrong. Try refreshing.</div>;
    }
    return this.props.children;
  }
}

function ClearingErrorBoundary({ fallback, children }: { fallback?: React.ReactNode; children: React.ReactNode }) {
  const location = useLocation();
  const [key, setKey] = useState(0);
  useEffect(() => {
    setKey(k => k + 1);
  }, [location]);

  return (
    <RawErrorBoundary key={key} fallback={fallback}>
      {children}
    </RawErrorBoundary>
  );
}

export function AppRouter() {
  const { isAuthenticated, isLoading } = useAuth();
  const [tourOpen, setTourOpen] = useState(() => !localStorage.getItem('tourComplete'));
  const navigate = useNavigate();

  const handleTourFinish = () => {
    setTourOpen(false);
    localStorage.setItem('tourComplete', 'true');
    navigate('/dashboard');
  };

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (isLoading) return <div>Loading...</div>;
    if (!isAuthenticated) return <Navigate to="/auth" replace />;
    return <>{children}</>;
  };

  const RedirectToStart = () => (
    <Navigate to={isAuthenticated ? '/dashboard' : '/landing'} replace />
  );

  return (
    <TourProvider steps={tourConfig}>
      <ClearingErrorBoundary>
        <Routes>
          <Route path="/auth/*" element={<AuthPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/" element={<RedirectToStart />} />

          <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Index /></AppLayout></ProtectedRoute>} />
          <Route path="/documents" element={<ProtectedRoute><AppLayout><Documents /></AppLayout></ProtectedRoute>} />
          <Route path="/documents/upload" element={<ProtectedRoute><AppLayout><Upload /></AppLayout></ProtectedRoute>} />
          <Route path="/compliance" element={<ProtectedRoute><AppLayout><Compliance /></AppLayout></ProtectedRoute>} />
          <Route path="/checklists" element={<ProtectedRoute><AppLayout><Checklists /></AppLayout></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><AppLayout><Analytics /></AppLayout></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><AppLayout><Reports /></AppLayout></ProtectedRoute>} />
          <Route path="/admin/security" element={<ProtectedRoute><AppLayout><SecurityDashboard /></AppLayout></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </ClearingErrorBoundary>
    </TourProvider>
  );
}