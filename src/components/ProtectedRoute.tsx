import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/components/providers/auth-provider';
import { rbacService } from '@/utils/rbacService';
import { Permission, Role } from '@/utils/rbac/types';
import { Card } from '@/components/ui/card';
import { ShieldX } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermissions?: Permission[];
  requiredRoles?: Role[];
  requireAnyPermission?: boolean; // If true, user needs ANY of the permissions, otherwise ALL
}

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      <p className="mt-4 text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const AccessDenied = () => (
  <div className="min-h-screen flex items-center justify-center bg-background p-4">
    <Card className="max-w-md w-full p-6 text-center">
      <div className="flex justify-center mb-4">
        <ShieldX className="h-12 w-12 text-destructive" />
      </div>
      <h1 className="text-2xl font-bold text-foreground mb-2">
        Access Denied
      </h1>
      <p className="text-muted-foreground mb-6">
        You don't have the required permissions to access this page.
      </p>
    </Card>
  </div>
);

export function ProtectedRoute({ 
  children, 
  requiredPermissions = [], 
  requiredRoles = [],
  requireAnyPermission = false
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [checkingPermissions, setCheckingPermissions] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) return;
      
      setCheckingPermissions(true);
      
      try {
        // Check role requirements
        if (requiredRoles.length > 0) {
          const hasRequiredRole = await rbacService.hasAnyRole(user.id, requiredRoles);
          if (!hasRequiredRole) {
            setHasAccess(false);
            return;
          }
        }
        
        // Check permission requirements
        if (requiredPermissions.length > 0) {
          const hasRequiredPermissions = requireAnyPermission
            ? await rbacService.hasAnyPermission(user.id, requiredPermissions)
            : await rbacService.hasAllPermissions(user.id, requiredPermissions);
          
          if (!hasRequiredPermissions) {
            setHasAccess(false);
            return;
          }
        }
        
        setHasAccess(true);
      } catch (error) {
        console.error('Error checking permissions:', error);
        setHasAccess(false);
      } finally {
        setCheckingPermissions(false);
      }
    };

    if (user && (requiredPermissions.length > 0 || requiredRoles.length > 0)) {
      checkAccess();
    } else if (user) {
      setHasAccess(true);
    }
  }, [user, requiredPermissions, requiredRoles, requireAnyPermission]);

  if (isLoading || checkingPermissions) {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (hasAccess === false) {
    return <AccessDenied />;
  }

  return <>{children}</>;
}