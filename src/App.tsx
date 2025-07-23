import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { TourProvider } from '@/components/tour/TourProvider'
import { AuthProvider, useAuth } from '@/components/providers/auth-provider'
import { Toaster } from 'sonner'

import LandingPage from '@/pages/LandingPage'
import Dashboard from '@/components/Dashboard'
import Upload from '@/pages/Documents/Upload'
import Security from '@/pages/Admin/Security'
import Analysis from '@/pages/Analysis'
import Compliance from '@/pages/Compliance'
import Documents from '@/pages/Documents'
import Reports from '@/pages/Reports'
import { AuthForm } from '@/components/AuthForm'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) return <div className="text-white p-4">Loading...</div>
  if (!user) return <Navigate to="/auth" />

  return <>{children}</>
}

function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
      <Route path="/auth" element={<AuthForm isLogin />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/documents/upload"
        element={
          <ProtectedRoute>
            <Upload />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/security"
        element={
          <ProtectedRoute>
            <Security />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analysis"
        element={
          <ProtectedRoute>
            <Analysis />
          </ProtectedRoute>
        }
      />
      <Route
        path="/compliance"
        element={
          <ProtectedRoute>
            <Compliance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/documents"
        element={
          <ProtectedRoute>
            <Documents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <TourProvider>
          <AppRoutes />
          <Toaster />
        </TourProvider>
      </AuthProvider>
    </Router>
  )
}