
import { useAuth } from "@/hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import { SessionTimeoutWarning } from "./SessionTimeoutWarning";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const ProtectedRoute = ({ children, requireAuth = true }: ProtectedRouteProps) => {
  const { user, loading, isConnected } = useAuth();
  const location = useLocation();

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Authentication Not Available</h2>
          <p className="text-gray-600">Please connect Supabase to enable authentication.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!requireAuth && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      {children}
      {user && <SessionTimeoutWarning />}
    </>
  );
};
