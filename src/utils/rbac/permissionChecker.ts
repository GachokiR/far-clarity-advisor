
import { Permission, Role } from './types';
import { roleManager } from './roleManager';

class PermissionChecker {
  async hasPermission(userId: string, permission: Permission): Promise<boolean> {
    try {
      const permissions = await roleManager.getUserPermissions(userId);
      return permissions.includes(permission);
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  }

  async hasAnyPermission(userId: string, permissions: Permission[]): Promise<boolean> {
    try {
      const userPermissions = await roleManager.getUserPermissions(userId);
      return permissions.some(permission => userPermissions.includes(permission));
    } catch (error) {
      console.error('Error checking permissions:', error);
      return false;
    }
  }

  async hasAllPermissions(userId: string, permissions: Permission[]): Promise<boolean> {
    try {
      const userPermissions = await roleManager.getUserPermissions(userId);
      return permissions.every(permission => userPermissions.includes(permission));
    } catch (error) {
      console.error('Error checking permissions:', error);
      return false;
    }
  }

  async hasRole(userId: string, role: Role): Promise<boolean> {
    try {
      const userRole = await roleManager.getUserRole(userId);
      return userRole?.role === role;
    } catch (error) {
      console.error('Error checking role:', error);
      return false;
    }
  }

  async hasAnyRole(userId: string, roles: Role[]): Promise<boolean> {
    try {
      const userRole = await roleManager.getUserRole(userId);
      return userRole ? roles.includes(userRole.role) : false;
    } catch (error) {
      console.error('Error checking roles:', error);
      return false;
    }
  }

  async isAdmin(userId: string): Promise<boolean> {
    return this.hasAnyRole(userId, ['admin', 'moderator']);
  }

  // Authorization middleware helpers
  requirePermission(permission: Permission) {
    return async (userId: string) => {
      const hasPermission = await this.hasPermission(userId, permission);
      if (!hasPermission) {
        throw new Error(`Access denied: missing permission ${permission}`);
      }
    };
  }

  requireRole(role: Role) {
    return async (userId: string) => {
      const hasRole = await this.hasRole(userId, role);
      if (!hasRole) {
        throw new Error(`Access denied: requires ${role} role`);
      }
    };
  }

  requireAnyRole(roles: Role[]) {
    return async (userId: string) => {
      const hasAnyRole = await this.hasAnyRole(userId, roles);
      if (!hasAnyRole) {
        throw new Error(`Access denied: requires one of roles: ${roles.join(', ')}`);
      }
    };
  }
}

export const permissionChecker = new PermissionChecker();
