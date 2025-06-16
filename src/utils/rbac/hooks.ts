
import { Permission } from './types';
import { roleManager } from './roleManager';
import { permissionChecker } from './permissionChecker';

// React hook for permission checking
export const usePermissions = (userId: string) => {
  const hasPermission = (permission: Permission) => {
    return permissionChecker.hasPermission(userId, permission);
  };

  const hasAnyPermission = (permissions: Permission[]) => {
    return permissionChecker.hasAnyPermission(userId, permissions);
  };

  const hasAllPermissions = (permissions: Permission[]) => {
    return permissionChecker.hasAllPermissions(userId, permissions);
  };

  const getUserRole = () => {
    return roleManager.getUserRole(userId);
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getUserRole
  };
};
