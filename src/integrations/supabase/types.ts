export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ai_analysis_results: {
        Row: {
          ai_findings: Json
          analysis_type: string
          confidence_score: number | null
          created_at: string
          document_id: string | null
          id: string
          model_version: string | null
          processing_time_ms: number | null
          recommendations: Json | null
          risk_assessment: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_findings: Json
          analysis_type?: string
          confidence_score?: number | null
          created_at?: string
          document_id?: string | null
          id?: string
          model_version?: string | null
          processing_time_ms?: number | null
          recommendations?: Json | null
          risk_assessment?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_findings?: Json
          analysis_type?: string
          confidence_score?: number | null
          created_at?: string
          document_id?: string | null
          id?: string
          model_version?: string | null
          processing_time_ms?: number | null
          recommendations?: Json | null
          risk_assessment?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_analysis_results_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_recommendations: {
        Row: {
          analysis_id: string | null
          auto_generated: boolean
          created_at: string
          description: string
          due_date: string | null
          estimated_effort: string | null
          far_clause_reference: string | null
          id: string
          metadata: Json | null
          priority: string
          recommendation_type: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_id?: string | null
          auto_generated?: boolean
          created_at?: string
          description: string
          due_date?: string | null
          estimated_effort?: string | null
          far_clause_reference?: string | null
          id?: string
          metadata?: Json | null
          priority?: string
          recommendation_type: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_id?: string | null
          auto_generated?: boolean
          created_at?: string
          description?: string
          due_date?: string | null
          estimated_effort?: string | null
          far_clause_reference?: string | null
          id?: string
          metadata?: Json | null
          priority?: string
          recommendation_type?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_recommendations_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "ai_analysis_results"
            referencedColumns: ["id"]
          },
        ]
      }
      analysis_results: {
        Row: {
          analysis_data: Json
          created_at: string
          document_name: string
          document_url: string | null
          id: string
          risk_level: string
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_data?: Json
          created_at?: string
          document_name: string
          document_url?: string | null
          id?: string
          risk_level: string
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_data?: Json
          created_at?: string
          document_name?: string
          document_url?: string | null
          id?: string
          risk_level?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      compliance_checklists: {
        Row: {
          created_at: string
          estimated_cost: string | null
          far_clause: string
          id: string
          requirements: string[]
          status: string
          timeframe: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          estimated_cost?: string | null
          far_clause: string
          id?: string
          requirements?: string[]
          status?: string
          timeframe?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          estimated_cost?: string | null
          far_clause?: string
          id?: string
          requirements?: string[]
          status?: string
          timeframe?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      compliance_gaps: {
        Row: {
          analysis_id: string | null
          created_at: string
          description: string
          far_clause: string
          gap_type: string
          id: string
          impact_assessment: string | null
          regulatory_reference: string | null
          resolution_status: string
          severity: string
          suggested_action: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_id?: string | null
          created_at?: string
          description: string
          far_clause: string
          gap_type: string
          id?: string
          impact_assessment?: string | null
          regulatory_reference?: string | null
          resolution_status?: string
          severity?: string
          suggested_action?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_id?: string | null
          created_at?: string
          description?: string
          far_clause?: string
          gap_type?: string
          id?: string
          impact_assessment?: string | null
          regulatory_reference?: string | null
          resolution_status?: string
          severity?: string
          suggested_action?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_gaps_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "ai_analysis_results"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string
          file_name: string
          file_size: number | null
          file_type: string | null
          id: string
          public_url: string | null
          storage_path: string
          updated_at: string
          upload_status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          public_url?: string | null
          storage_path: string
          updated_at?: string
          upload_status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          public_url?: string | null
          storage_path?: string
          updated_at?: string
          upload_status?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company: string | null
          created_at: string
          demo_session_expires_at: string | null
          email: string | null
          first_name: string | null
          id: string
          is_demo_user: boolean
          last_name: string | null
          subscription_tier: Database["public"]["Enums"]["subscription_tier"]
          subscription_updated_at: string
          trial_end_date: string
          trial_start_date: string
          updated_at: string
          usage_limits: Json
        }
        Insert: {
          company?: string | null
          created_at?: string
          demo_session_expires_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          is_demo_user?: boolean
          last_name?: string | null
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
          subscription_updated_at?: string
          trial_end_date?: string
          trial_start_date?: string
          updated_at?: string
          usage_limits?: Json
        }
        Update: {
          company?: string | null
          created_at?: string
          demo_session_expires_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          is_demo_user?: boolean
          last_name?: string | null
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
          subscription_updated_at?: string
          trial_end_date?: string
          trial_start_date?: string
          updated_at?: string
          usage_limits?: Json
        }
        Relationships: []
      }
      role_audit_log: {
        Row: {
          action: string
          assigned_by: string | null
          id: string
          new_role: Database["public"]["Enums"]["app_role"] | null
          old_role: Database["public"]["Enums"]["app_role"] | null
          reason: string | null
          timestamp: string
          user_id: string
        }
        Insert: {
          action: string
          assigned_by?: string | null
          id?: string
          new_role?: Database["public"]["Enums"]["app_role"] | null
          old_role?: Database["public"]["Enums"]["app_role"] | null
          reason?: string | null
          timestamp?: string
          user_id: string
        }
        Update: {
          action?: string
          assigned_by?: string | null
          id?: string
          new_role?: Database["public"]["Enums"]["app_role"] | null
          old_role?: Database["public"]["Enums"]["app_role"] | null
          reason?: string | null
          timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      security_events: {
        Row: {
          details: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          timestamp: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          details?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          details?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_demo_users: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_security_events: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_tier_limits: {
        Args: { tier: Database["public"]["Enums"]["subscription_tier"] }
        Returns: Json
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_user_tier: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["subscription_tier"]
      }
      has_role: {
        Args: {
          user_id: string
          check_role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_trial_expired: {
        Args: { user_id: string }
        Returns: boolean
      }
      log_security_event: {
        Args: { event_type: string; user_id: string; details?: Json }
        Returns: undefined
      }
      upgrade_user_tier: {
        Args: {
          user_id: string
          new_tier: Database["public"]["Enums"]["subscription_tier"]
        }
        Returns: undefined
      }
      validate_session_integrity: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "analyst" | "user"
      subscription_tier: "trial" | "basic" | "professional" | "enterprise"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "analyst", "user"],
      subscription_tier: ["trial", "basic", "professional", "enterprise"],
    },
  },
} as const
