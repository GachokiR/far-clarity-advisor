import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { TourProvider } from '@reactour/tour'
import { AuthProvider, useAuth } from '@/components/providers/auth-provider'
import { Toaster } from 'sonner'

import LandingPage from '@/pages/LandingPage'
import Dashboard from '@/components/Dashboard'
import Upload from '@/pages/Documents/Upload'
import Security from '@/pages/Admin/Security'
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
    </Routes>
  )
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        <Toaster />
      </AuthProvider>
    </Router>
  )
}