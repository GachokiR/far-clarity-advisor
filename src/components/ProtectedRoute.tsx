
import { useAuth } from "@/hooks/useAuth";
import { SessionTimeoutWarning } from "./SessionTimeoutWarning";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const ProtectedRoute = ({ children, requireAuth = false }: ProtectedRouteProps) => {
  const { user, loading, isConnected } = useAuth();

  // If authentication is not required, just render the children
  if (!requireAuth) {
    return <>{children}</>;
  }

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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
          <p className="text-gray-600">This page requires authentication, but login is currently disabled.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
      {user && <SessionTimeoutWarning />}
    </>
  );
};
