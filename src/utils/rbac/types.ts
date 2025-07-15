
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
  id: string;
  user_id: string;
  role: Role;
  assigned_at: string;
  assigned_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface RoleDefinition {
  role: Role;
  permissions: Permission[];
  description: string;
}

export interface SecurityEvent {
  id: string;
  event_type: string;
  user_id: string | null;
  details: Record<string, any>;
  timestamp: string;
  ip_address?: string;
  user_agent?: string;
}

export interface RoleAuditLog {
  id: string;
  user_id: string;
  old_role: Role | null;
  new_role: Role | null;
  assigned_by: string | null;
  action: string;
  timestamp: string;
  reason?: string;
}
