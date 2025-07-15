
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
  async assignRole(userId: string, role: Role, assignedBy: string): Promise<UserRole | null> {
    return await roleManager.assignRole(userId, role, assignedBy);
  }

  async getUserRole(userId: string): Promise<UserRole | null> {
    return await roleManager.getUserRole(userId);
  }

  async getAllUserRoles(): Promise<UserRole[]> {
    return await roleManager.getAllUserRoles();
  }

  async removeUserRole(userId: string, role: Role): Promise<boolean> {
    return await roleManager.removeUserRole(userId, role);
  }

  async getUserPermissions(userId: string): Promise<Permission[]> {
    return await roleManager.getUserPermissions(userId);
  }

  // Permission Checking
  async hasPermission(userId: string, permission: Permission): Promise<boolean> {
    return await permissionChecker.hasPermission(userId, permission);
  }

  async hasAnyPermission(userId: string, permissions: Permission[]): Promise<boolean> {
    return await permissionChecker.hasAnyPermission(userId, permissions);
  }

  async hasAllPermissions(userId: string, permissions: Permission[]): Promise<boolean> {
    return await permissionChecker.hasAllPermissions(userId, permissions);
  }

  async hasRole(userId: string, role: Role): Promise<boolean> {
    return await permissionChecker.hasRole(userId, role);
  }

  async hasAnyRole(userId: string, roles: Role[]): Promise<boolean> {
    return await permissionChecker.hasAnyRole(userId, roles);
  }

  async isAdmin(userId: string): Promise<boolean> {
    return await permissionChecker.isAdmin(userId);
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

  // Cache management
  clearCache() {
    roleManager.clearCache();
  }
}

export const rbacService = RBACService.getInstance();

// Re-export the React hook for backward compatibility
export { usePermissions } from './rbac/hooks';
