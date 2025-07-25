import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/components/providers/auth-provider'
import { TourProvider } from '@/components/tour/TourProvider'
import { Toaster } from 'sonner'
import { Suspense, lazy } from 'react'
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary'
import { BaseProtectedRoute } from '@/components/BaseProtectedRoute';
import { PermissionProtectedRoute } from '@/components/PermissionProtectedRoute';
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
const AuthTestingDashboard = lazy(() => import('@/components/AuthTestingDashboard').then(module => ({ default: module.AuthTestingDashboard })))

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
        
        {/* Protected Routes with nested structure */}
        <Route element={<BaseProtectedRoute />}>
          <Route
            path="/dashboard"
            element={
              <RouteErrorBoundary routeName="Dashboard">
                <Suspense fallback={<EnhancedPageLoader routeName="dashboard" />}>
                  <PermissionProtectedRoute requiredPermissions={['read:documents']}>
                    <Dashboard />
                  </PermissionProtectedRoute>
                </Suspense>
              </RouteErrorBoundary>
            }
          />
          <Route
            path="/documents/upload"
            element={
              <RouteErrorBoundary routeName="Upload">
                <Suspense fallback={<EnhancedPageLoader routeName="upload" />}>
                  <PermissionProtectedRoute requiredPermissions={['write:documents']}>
                    <Upload />
                  </PermissionProtectedRoute>
                </Suspense>
              </RouteErrorBoundary>
            }
          />
          <Route
            path="/admin/security"
            element={
              <RouteErrorBoundary routeName="Admin Security">
                <Suspense fallback={<EnhancedPageLoader routeName="security" />}>
                  <PermissionProtectedRoute requiredRoles={['admin']} requiredPermissions={['admin:security']}>
                    <Security />
                  </PermissionProtectedRoute>
                </Suspense>
              </RouteErrorBoundary>
            }
          />
          <Route
            path="/analysis"
            element={
              <RouteErrorBoundary routeName="Analysis">
                <Suspense fallback={<EnhancedPageLoader routeName="analysis" />}>
                  <PermissionProtectedRoute requiredPermissions={['read:analytics']}>
                    <Analysis />
                  </PermissionProtectedRoute>
                </Suspense>
              </RouteErrorBoundary>
            }
          />
          <Route
            path="/compliance"
            element={
              <RouteErrorBoundary routeName="Compliance">
                <Suspense fallback={<EnhancedPageLoader routeName="compliance" />}>
                  <PermissionProtectedRoute requiredPermissions={['compliance:view']}>
                    <Compliance />
                  </PermissionProtectedRoute>
                </Suspense>
              </RouteErrorBoundary>
            }
          />
          <Route
            path="/documents"
            element={
              <RouteErrorBoundary routeName="Documents">
                <Suspense fallback={<EnhancedPageLoader routeName="documents" />}>
                  <PermissionProtectedRoute requiredPermissions={['read:documents']}>
                    <Documents />
                  </PermissionProtectedRoute>
                </Suspense>
              </RouteErrorBoundary>
            }
          />
          <Route
            path="/reports"
            element={
              <RouteErrorBoundary routeName="Reports">
                <Suspense fallback={<EnhancedPageLoader routeName="reports" />}>
                  <PermissionProtectedRoute requiredPermissions={['read:analytics']} requireAnyPermission>
                    <Reports />
                  </PermissionProtectedRoute>
                </Suspense>
              </RouteErrorBoundary>
            }
          />
          <Route
            path="/auth-testing"
            element={
              <RouteErrorBoundary routeName="Auth Testing">
                <Suspense fallback={<EnhancedPageLoader routeName="testing" />}>
                  <PermissionProtectedRoute requiredRoles={['admin']}>
                    <AuthTestingDashboard />
                  </PermissionProtectedRoute>
                </Suspense>
              </RouteErrorBoundary>
            }
          />
        </Route>
        
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