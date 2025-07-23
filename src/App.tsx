import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TourProvider, useTour } from '@reactour/tour';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@/components/providers/auth-provider';
import { Toaster } from '@/components/ui/toaster';
import LandingPage from '@/pages/LandingPage';
import Dashboard from '@/components/Dashboard';
import AppLayout from '@/components/layout/AppLayout';
import Documents from '@/pages/Documents';
import Upload from '@/pages/Documents/Upload';
import Compliance from '@/pages/Compliance';
import Checklists from '@/pages/Checklists';
import Analytics from '@/pages/Analytics';
import Reports from '@/pages/Reports';
import SecurityDashboard from '@/pages/Admin/Security';
import AuthPage from '@/pages/Auth';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

const tourSteps = [
  { selector: '[data-tour="welcome"]', content: 'Welcome to your compliance dashboard! Let me show you around.' },
  { selector: '[data-tour="quick-actions"]', content: 'Use these quick actions to navigate to different sections of the application.' },
  { selector: '[data-tour="upload"]', content: 'Click here to upload documents for compliance analysis.' },
  { selector: '[data-tour="compliance"]', content: 'View your compliance status and analysis results here.' },
  { selector: '[data-tour="reports"]', content: 'Generate and download compliance reports from this section.' },
];

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();
  const { setIsOpen } = useTour();
  const [hasSeenTour, setHasSeenTour] = useState(false);

  useEffect(() => {
    if (!hasSeenTour && isAuthenticated) {
      const seenTour = localStorage.getItem('tourComplete');
      if (!seenTour) {
        setIsOpen(true);
        setHasSeenTour(true);
      }
    }
  }, [isAuthenticated, hasSeenTour, setIsOpen]);

  if (isLoading) return <div>Loading...</div>;

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated) return <Navigate to="/auth" replace />;
    return <>{children}</>;
  };

  return (
    <Routes>
      <Route path="/auth/*" element={<AuthPage />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/landing'} replace />} />
      
      <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
      <Route path="/documents" element={<ProtectedRoute><AppLayout><Documents /></AppLayout></ProtectedRoute>} />
      <Route path="/documents/upload" element={<ProtectedRoute><AppLayout><Upload /></AppLayout></ProtectedRoute>} />
      <Route path="/compliance" element={<ProtectedRoute><AppLayout><Compliance /></AppLayout></ProtectedRoute>} />
      <Route path="/checklists" element={<ProtectedRoute><AppLayout><Checklists /></AppLayout></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><AppLayout><Analytics /></AppLayout></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><AppLayout><Reports /></AppLayout></ProtectedRoute>} />
      <Route path="/admin/security" element={<ProtectedRoute><AppLayout><SecurityDashboard /></AppLayout></ProtectedRoute>} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <TourProvider steps={tourSteps}>
            <AppRoutes />
            <Toaster />
          </TourProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}