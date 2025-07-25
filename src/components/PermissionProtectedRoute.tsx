import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/components/providers/auth-provider';
import { rbacService } from '@/utils/rbacService';
import { Permission, Role } from '@/utils/rbac/types';
import { Card } from '@/components/ui/card';
import { ShieldX } from 'lucide-react';

interface PermissionProtectedRouteProps {
  children: ReactNode;
  requiredPermissions?: Permission[];
  requiredRoles?: Role[];
  requireAnyPermission?: boolean;
}

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

export function PermissionProtectedRoute({ 
  children, 
  requiredPermissions = [], 
  requiredRoles = [],
  requireAnyPermission = false
}: PermissionProtectedRouteProps) {
  const { user } = useAuth();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [checkingPermissions, setCheckingPermissions] = useState(false);

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const checkAccess = async () => {
      if (!user || !mounted) {
        if (mounted) setHasAccess(false);
        return;
      }
      
      setCheckingPermissions(true);

      // Set a timeout to prevent hanging on permission checks
      timeoutId = setTimeout(() => {
        if (mounted) {
          console.warn('[PermissionProtectedRoute] Permission check timeout, allowing access');
          setHasAccess(true);
          setCheckingPermissions(false);
        }
      }, 5000);
      
      try {
        let hasRequiredRole = true;
        let hasRequiredPermission = true;

        // Check role requirements
        if (requiredRoles.length > 0) {
          hasRequiredRole = await rbacService.hasAnyRole(user.id, requiredRoles);
        }
        
        // Check permission requirements
        if (requiredPermissions.length > 0) {
          hasRequiredPermission = requireAnyPermission
            ? await rbacService.hasAnyPermission(user.id, requiredPermissions)
            : await rbacService.hasAllPermissions(user.id, requiredPermissions);
        }
        
        if (mounted) {
          clearTimeout(timeoutId);
          setHasAccess(hasRequiredRole && hasRequiredPermission);
          setCheckingPermissions(false);
        }
      } catch (error) {
        console.error('[PermissionProtectedRoute] Error checking permissions:', error);
        if (mounted) {
          clearTimeout(timeoutId);
          setHasAccess(true); // Allow access on error to prevent users getting stuck
          setCheckingPermissions(false);
        }
      }
    };

    if (user && (requiredPermissions.length > 0 || requiredRoles.length > 0)) {
      checkAccess();
    } else if (user) {
      setHasAccess(true);
      setCheckingPermissions(false);
    }

    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [user, requiredPermissions, requiredRoles, requireAnyPermission]);

  if (checkingPermissions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (hasAccess === false) {
    return <AccessDenied />;
  }

  return <>{children}</>;
}