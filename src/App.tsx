import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/components/providers/auth-provider';
import { TourProvider } from '@reactour/tour';
import { tourConfig } from '@/config/tour';
import ErrorBoundary from '@/components/providers/error-boundary';
import ProtectedRoute from '@/components/providers/protected-route';
import AppLayout from './components/layout/AppLayout';
import Index from './pages/Index';
import Documents from './pages/Documents';
import Upload from './pages/Documents/Upload';
import Compliance from './pages/Compliance';
import Checklists from './pages/Checklists';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import AuthPage from './pages/Auth';
import NotFound from './pages/NotFound';
import SecurityDashboard from './pages/Admin/Security';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TourProvider steps={tourConfig}>
          <ErrorBoundary>
            <Router>
              <Routes>
                {/* Public Auth Route */}
                <Route path="/auth/*" element={<AuthPage />} />

                {/* Redirect root to dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* Protected Application Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Index />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/documents"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Documents />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/documents/upload"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Upload />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/compliance"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Compliance />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checklists"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Checklists />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Analytics />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Reports />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/security"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <SecurityDashboard />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* 404 Page */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </Router>
          </ErrorBoundary>
        </TourProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

