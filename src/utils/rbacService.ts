
// Role-Based Access Control Service
export type Permission = 
  | 'read:documents' 
  | 'write:documents' 
  | 'delete:documents'
  | 'read:users' 
  | 'write:users' 
  | 'delete:users'
  | 'read:analytics' 
  | 'write:analytics'
  | 'admin:system' 
  | 'admin:security'
  | 'compliance:view'
  | 'compliance:manage';

export type Role = 'admin' | 'moderator' | 'analyst' | 'user';

export interface UserRole {
  userId: string;
  role: Role;
  permissions: Permission[];
  assignedAt: string;
  assignedBy: string;
}

export interface RoleDefinition {
  role: Role;
  permissions: Permission[];
  description: string;
}

class RBACService {
  private static instance: RBACService;
  private userRoles: Map<string, UserRole> = new Map();
  
  private roleDefinitions: RoleDefinition[] = [
    {
      role: 'admin',
      permissions: [
        'read:documents', 'write:documents', 'delete:documents',
        'read:users', 'write:users', 'delete:users',
        'read:analytics', 'write:analytics',
        'admin:system', 'admin:security',
        'compliance:view', 'compliance:manage'
      ],
      description: 'Full system access with all permissions'
    },
    {
      role: 'moderator',
      permissions: [
        'read:documents', 'write:documents',
        'read:users', 'write:users',
        'read:analytics',
        'admin:security',
        'compliance:view'
      ],
      description: 'Moderate access with user and document management'
    },
    {
      role: 'analyst',
      permissions: [
        'read:documents', 'write:documents',
        'read:analytics', 'write:analytics',
        'compliance:view'
      ],
      description: 'Analytics and compliance focused access'
    },
    {
      role: 'user',
      permissions: [
        'read:documents', 'write:documents'
      ],
      description: 'Basic user access to documents'
    }
  ];

  static getInstance(): RBACService {
    if (!RBACService.instance) {
      RBACService.instance = new RBACService();
    }
    return RBACService.instance;
  }

  assignRole(userId: string, role: Role, assignedBy: string): UserRole {
    const roleDefinition = this.roleDefinitions.find(r => r.role === role);
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

  hasPermission(userId: string, permission: Permission): boolean {
    const userRole = this.getUserRole(userId);
    if (!userRole) {
      return false;
    }
    return userRole.permissions.includes(permission);
  }

  hasAnyPermission(userId: string, permissions: Permission[]): boolean {
    const userRole = this.getUserRole(userId);
    if (!userRole) {
      return false;
    }
    return permissions.some(permission => userRole.permissions.includes(permission));
  }

  hasAllPermissions(userId: string, permissions: Permission[]): boolean {
    const userRole = this.getUserRole(userId);
    if (!userRole) {
      return false;
    }
    return permissions.every(permission => userRole.permissions.includes(permission));
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

  getRoleDefinitions(): RoleDefinition[] {
    return [...this.roleDefinitions];
  }

  getAllUserRoles(): UserRole[] {
    return Array.from(this.userRoles.values());
  }

  removeUserRole(userId: string): boolean {
    return this.userRoles.delete(userId);
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
      const userRole = this.getUserRole(userId);
      if (!userRole || userRole.role !== role) {
        throw new Error(`Access denied: requires ${role} role`);
      }
    };
  }

  requireAnyRole(roles: Role[]) {
    return (userId: string) => {
      const userRole = this.getUserRole(userId);
      if (!userRole || !roles.includes(userRole.role)) {
        throw new Error(`Access denied: requires one of roles: ${roles.join(', ')}`);
      }
    };
  }
}

export const rbacService = RBACService.getInstance();

// React hook for permission checking
export const usePermissions = (userId: string) => {
  const hasPermission = (permission: Permission) => {
    return rbacService.hasPermission(userId, permission);
  };

  const hasAnyPermission = (permissions: Permission[]) => {
    return rbacService.hasAnyPermission(userId, permissions);
  };

  const hasAllPermissions = (permissions: Permission[]) => {
    return rbacService.hasAllPermissions(userId, permissions);
  };

  const getUserRole = () => {
    return rbacService.getUserRole(userId);
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getUserRole
  };
};
