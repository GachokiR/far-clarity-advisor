
// Core RBAC types and definitions
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
