
import { supabase } from '@/integrations/supabase/client';
import { Role, UserRole, Permission } from './types';
import { getRoleDefinition } from './roleDefinitions';

class RoleManager {
  private userRolesCache: Map<string, UserRole> = new Map();

  async assignRole(userId: string, role: Role, assignedBy: string): Promise<UserRole | null> {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role,
          assigned_by: assignedBy
        })
        .select()
        .single();

      if (error) throw error;

      const userRole: UserRole = {
        id: data.id,
        user_id: data.user_id,
        role: data.role,
        assigned_at: data.assigned_at,
        assigned_by: data.assigned_by,
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      this.userRolesCache.set(userId, userRole);
      return userRole;
    } catch (error) {
      console.error('Error assigning role:', error);
      return null;
    }
  }

  async getUserRole(userId: string): Promise<UserRole | null> {
    try {
      // Check cache first
      if (this.userRolesCache.has(userId)) {
        return this.userRolesCache.get(userId) || null;
      }

      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .order('assigned_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No role found
          return null;
        }
        throw error;
      }

      const userRole: UserRole = {
        id: data.id,
        user_id: data.user_id,
        role: data.role,
        assigned_at: data.assigned_at,
        assigned_by: data.assigned_by,
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      this.userRolesCache.set(userId, userRole);
      return userRole;
    } catch (error) {
      console.error('Error getting user role:', error);
      return null;
    }
  }

  async getAllUserRoles(): Promise<UserRole[]> {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('assigned_at', { ascending: false });

      if (error) throw error;

      return data.map(row => ({
        id: row.id,
        user_id: row.user_id,
        role: row.role,
        assigned_at: row.assigned_at,
        assigned_by: row.assigned_by,
        created_at: row.created_at,
        updated_at: row.updated_at
      }));
    } catch (error) {
      console.error('Error getting all user roles:', error);
      return [];
    }
  }

  async removeUserRole(userId: string, role: Role): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) throw error;

      this.userRolesCache.delete(userId);
      return true;
    } catch (error) {
      console.error('Error removing user role:', error);
      return false;
    }
  }

  async getUserPermissions(userId: string): Promise<Permission[]> {
    const userRole = await this.getUserRole(userId);
    if (!userRole) {
      return [];
    }

    const roleDefinition = getRoleDefinition(userRole.role);
    return roleDefinition ? roleDefinition.permissions : [];
  }

  clearCache() {
    this.userRolesCache.clear();
  }
}

export const roleManager = new RoleManager();
