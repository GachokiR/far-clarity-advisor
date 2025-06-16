
// Main RBAC Service - coordinates all RBAC modules
import { Permission, Role, UserRole, RoleDefinition } from './rbac/types';
import { roleManager } from './rbac/roleManager';
import { permissionChecker } from './rbac/permissionChecker';
import { getAllRoleDefinitions } from './rbac/roleDefinitions';

// Re-export types for backward compatibility
export type { Permission, Role, UserRole, RoleDefinition };

class RBACService {
  private static instance: RBACService;

  static getInstance(): RBACService {
    if (!RBACService.instance) {
      RBACService.instance = new RBACService();
    }
    return RBACService.instance;
  }

  // Role Management
  assignRole(userId: string, role: Role, assignedBy: string): UserRole {
    return roleManager.assignRole(userId, role, assignedBy);
  }

  getUserRole(userId: string): UserRole | null {
    return roleManager.getUserRole(userId);
  }

  getAllUserRoles(): UserRole[] {
    return roleManager.getAllUserRoles();
  }

  removeUserRole(userId: string): boolean {
    return roleManager.removeUserRole(userId);
  }

  // Permission Management
  addPermission(userId: string, permission: Permission): boolean {
    return roleManager.addPermission(userId, permission);
  }

  removePermission(userId: string, permission: Permission): boolean {
    return roleManager.removePermission(userId, permission);
  }

  // Permission Checking
  hasPermission(userId: string, permission: Permission): boolean {
    return permissionChecker.hasPermission(userId, permission);
  }

  hasAnyPermission(userId: string, permissions: Permission[]): boolean {
    return permissionChecker.hasAnyPermission(userId, permissions);
  }

  hasAllPermissions(userId: string, permissions: Permission[]): boolean {
    return permissionChecker.hasAllPermissions(userId, permissions);
  }

  // Role Definitions
  getRoleDefinitions(): RoleDefinition[] {
    return getAllRoleDefinitions();
  }

  // Authorization Middleware Helpers
  requirePermission(permission: Permission) {
    return permissionChecker.requirePermission(permission);
  }

  requireRole(role: Role) {
    return permissionChecker.requireRole(role);
  }

  requireAnyRole(roles: Role[]) {
    return permissionChecker.requireAnyRole(roles);
  }
}

export const rbacService = RBACService.getInstance();

// Re-export the React hook for backward compatibility
export { usePermissions } from './rbac/hooks';
