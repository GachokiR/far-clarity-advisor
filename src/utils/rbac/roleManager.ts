
import { Role, UserRole, Permission } from './types';
import { getRoleDefinition } from './roleDefinitions';

class RoleManager {
  private userRoles: Map<string, UserRole> = new Map();

  assignRole(userId: string, role: Role, assignedBy: string): UserRole {
    const roleDefinition = getRoleDefinition(role);
    if (!roleDefinition) {
      throw new Error(`Role ${role} not found`);
    }

    const userRole: UserRole = {
      userId,
      role,
      permissions: [...roleDefinition.permissions],
      assignedAt: new Date().toISOString(),
      assignedBy
    };

    this.userRoles.set(userId, userRole);
    return userRole;
  }

  getUserRole(userId: string): UserRole | null {
    return this.userRoles.get(userId) || null;
  }

  getAllUserRoles(): UserRole[] {
    return Array.from(this.userRoles.values());
  }

  removeUserRole(userId: string): boolean {
    return this.userRoles.delete(userId);
  }

  addPermission(userId: string, permission: Permission): boolean {
    const userRole = this.getUserRole(userId);
    if (!userRole) {
      return false;
    }

    if (!userRole.permissions.includes(permission)) {
      userRole.permissions.push(permission);
      this.userRoles.set(userId, userRole);
    }
    return true;
  }

  removePermission(userId: string, permission: Permission): boolean {
    const userRole = this.getUserRole(userId);
    if (!userRole) {
      return false;
    }

    const permissionIndex = userRole.permissions.indexOf(permission);
    if (permissionIndex > -1) {
      userRole.permissions.splice(permissionIndex, 1);
      this.userRoles.set(userId, userRole);
    }
    return true;
  }
}

export const roleManager = new RoleManager();
