export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
