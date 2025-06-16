
import { RoleDefinition } from './types';

export const roleDefinitions: RoleDefinition[] = [
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

export const getRoleDefinition = (role: string) => {
  return roleDefinitions.find(r => r.role === role);
};

export const getAllRoleDefinitions = () => {
  return [...roleDefinitions];
};
