import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/components/providers/auth-provider'
import { TourProvider } from '@/components/tour/TourProvider'
import { Toaster } from 'sonner'
import { Suspense, lazy } from 'react'
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { EnhancedPageLoader } from '@/components/EnhancedPageLoader'
import { useRouteAnalytics } from '@/hooks/useRouteAnalytics'

// Lazy load pages to improve performance
const LandingPage = lazy(() => import('@/pages/LandingPage'))
const Dashboard = lazy(() => import('@/components/Dashboard'))
const Upload = lazy(() => import('@/pages/Documents/Upload'))
const Security = lazy(() => import('@/pages/Admin/Security'))
const Analysis = lazy(() => import('@/pages/Analysis'))
const Compliance = lazy(() => import('@/pages/Compliance'))
const Documents = lazy(() => import('@/pages/Documents'))
const Reports = lazy(() => import('@/pages/Reports'))
const Auth = lazy(() => import('@/pages/Auth'))

// Analytics tracking component
function RouteTracker() {
  useRouteAnalytics()
  return null
}

function AppRoutes() {
  const { user, isLoading } = useAuth()

  // Show loader while checking auth status
  if (isLoading) {
    return <EnhancedPageLoader routeName="app" message="Initializing application..." />
  }

  return (
    <>
      <RouteTracker />
      <Routes>
        <Route 
          path="/" 
          element={
            user ? <Navigate to="/dashboard" replace /> : 
            <RouteErrorBoundary routeName="Landing">
              <Suspense fallback={<EnhancedPageLoader routeName="landing" />}>
                <LandingPage />
              </Suspense>
            </RouteErrorBoundary>
          } 
        />
        <Route 
          path="/auth" 
          element={
            user ? <Navigate to="/dashboard" replace /> : 
            <RouteErrorBoundary routeName="Auth">
              <Suspense fallback={<EnhancedPageLoader routeName="auth" />}>
                <Auth />
              </Suspense>
            </RouteErrorBoundary>
          } 
        />
        <Route
          path="/dashboard"
          element={
            <RouteErrorBoundary routeName="Dashboard">
              <Suspense fallback={<EnhancedPageLoader routeName="dashboard" />}>
                <ProtectedRoute requiredPermissions={['read:documents']}>
                  <Dashboard />
                </ProtectedRoute>
              </Suspense>
            </RouteErrorBoundary>
          }
        />
        <Route
          path="/documents/upload"
          element={
            <RouteErrorBoundary routeName="Upload">
              <Suspense fallback={<EnhancedPageLoader routeName="upload" />}>
                <ProtectedRoute requiredPermissions={['write:documents']}>
                  <Upload />
                </ProtectedRoute>
              </Suspense>
            </RouteErrorBoundary>
          }
        />
        <Route
          path="/admin/security"
          element={
            <RouteErrorBoundary routeName="Admin Security">
              <Suspense fallback={<EnhancedPageLoader routeName="security" />}>
                <ProtectedRoute requiredRoles={['admin']} requiredPermissions={['admin:security']}>
                  <Security />
                </ProtectedRoute>
              </Suspense>
            </RouteErrorBoundary>
          }
        />
        <Route
          path="/analysis"
          element={
            <RouteErrorBoundary routeName="Analysis">
              <Suspense fallback={<EnhancedPageLoader routeName="analysis" />}>
                <ProtectedRoute requiredPermissions={['read:analytics']}>
                  <Analysis />
                </ProtectedRoute>
              </Suspense>
            </RouteErrorBoundary>
          }
        />
        <Route
          path="/compliance"
          element={
            <RouteErrorBoundary routeName="Compliance">
              <Suspense fallback={<EnhancedPageLoader routeName="compliance" />}>
                <ProtectedRoute requiredPermissions={['compliance:view']}>
                  <Compliance />
                </ProtectedRoute>
              </Suspense>
            </RouteErrorBoundary>
          }
        />
        <Route
          path="/documents"
          element={
            <RouteErrorBoundary routeName="Documents">
              <Suspense fallback={<EnhancedPageLoader routeName="documents" />}>
                <ProtectedRoute requiredPermissions={['read:documents']}>
                  <Documents />
                </ProtectedRoute>
              </Suspense>
            </RouteErrorBoundary>
          }
        />
        <Route
          path="/reports"
          element={
            <RouteErrorBoundary routeName="Reports">
              <Suspense fallback={<EnhancedPageLoader routeName="reports" />}>
                <ProtectedRoute requiredPermissions={['read:analytics']} requireAnyPermission>
                  <Reports />
                </ProtectedRoute>
              </Suspense>
            </RouteErrorBoundary>
          }
        />
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

// Main App component with proper provider nesting
export default function App() {
  return (
    <Router>
      <AuthProvider>
        <TourProvider>
          <AppRoutes />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </TourProvider>
      </AuthProvider>
    </Router>
  )
}