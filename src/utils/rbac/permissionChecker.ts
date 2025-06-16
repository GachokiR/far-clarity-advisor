
import { Permission, Role } from './types';
import { roleManager } from './roleManager';

class PermissionChecker {
  hasPermission(userId: string, permission: Permission): boolean {
    const userRole = roleManager.getUserRole(userId);
    if (!userRole) {
      return false;
    }
    return userRole.permissions.includes(permission);
  }

  hasAnyPermission(userId: string, permissions: Permission[]): boolean {
    const userRole = roleManager.getUserRole(userId);
    if (!userRole) {
      return false;
    }
    return permissions.some(permission => userRole.permissions.includes(permission));
  }

  hasAllPermissions(userId: string, permissions: Permission[]): boolean {
    const userRole = roleManager.getUserRole(userId);
    if (!userRole) {
      return false;
    }
    return permissions.every(permission => userRole.permissions.includes(permission));
  }

  // Authorization middleware helpers
  requirePermission(permission: Permission) {
    return (userId: string) => {
      if (!this.hasPermission(userId, permission)) {
        throw new Error(`Access denied: missing permission ${permission}`);
      }
    };
  }

  requireRole(role: Role) {
    return (userId: string) => {
      const userRole = roleManager.getUserRole(userId);
      if (!userRole || userRole.role !== role) {
        throw new Error(`Access denied: requires ${role} role`);
      }
    };
  }

  requireAnyRole(roles: Role[]) {
    return (userId: string) => {
      const userRole = roleManager.getUserRole(userId);
      if (!userRole || !roles.includes(userRole.role)) {
        throw new Error(`Access denied: requires one of roles: ${roles.join(', ')}`);
      }
    };
  }
}

export const permissionChecker = new PermissionChecker();
