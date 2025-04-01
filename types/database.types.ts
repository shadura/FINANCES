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
      accounts: {
        Row: {
          balance: number | null
          created_at: string
          currency: string
          deleted: boolean | null
          id: number
          is_net_worth: boolean
          name: string
          space_id: number
          type: string
        }
        Insert: {
          balance?: number | null
          created_at?: string
          currency: string
          deleted?: boolean | null
          id?: number
          is_net_worth?: boolean
          name: string
          space_id: number
          type: string
        }
        Update: {
          balance?: number | null
          created_at?: string
          currency?: string
          deleted?: boolean | null
          id?: number
          is_net_worth?: boolean
          name?: string
          space_id?: number
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      currency_rates: {
        Row: {
          date: string
          EUR: number
          id: number
          UAH: number
          USD: number
        }
        Insert: {
          date?: string
          EUR: number
          id?: number
          UAH: number
          USD?: number
        }
        Update: {
          date?: string
          EUR?: number
          id?: number
          UAH?: number
          USD?: number
        }
        Relationships: []
      }
      plan_tags: {
        Row: {
          id: number
          plan_id: number
          space_id: number
          tag_id: number
        }
        Insert: {
          id?: number
          plan_id: number
          space_id: number
          tag_id: number
        }
        Update: {
          id?: number
          plan_id?: number
          space_id?: number
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "plan_tags_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_tags_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          description: string | null
          id: number
          is_income: boolean | null
          period_month_year: number
          preferred_account: number | null
          space_id: number
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: number
          is_income?: boolean | null
          period_month_year: number
          preferred_account?: number | null
          space_id: number
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: number
          is_income?: boolean | null
          period_month_year?: number
          preferred_account?: number | null
          space_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "plans_preferred_account_fkey"
            columns: ["preferred_account"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plans_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      spaces: {
        Row: {
          created_at: string
          created_by: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      spaces_users: {
        Row: {
          created_at: string
          id: number
          space_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          space_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          space_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "spaces_users_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          color: string
          created_at: string
          deleted: boolean | null
          id: number
          name: string
          space_id: number
        }
        Insert: {
          color?: string
          created_at?: string
          deleted?: boolean | null
          id?: number
          name: string
          space_id: number
        }
        Update: {
          color?: string
          created_at?: string
          deleted?: boolean | null
          id?: number
          name?: string
          space_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "tags_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      transaction_tags: {
        Row: {
          id: number
          space_id: number
          tag_id: number
          transaction_id: number
        }
        Insert: {
          id?: number
          space_id: number
          tag_id: number
          transaction_id: number
        }
        Update: {
          id?: number
          space_id?: number
          tag_id?: number
          transaction_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "transaction_tags_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_tags_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          account_from: number | null
          account_to: number | null
          amount_credit: number | null
          amount_debit: number | null
          created_at: string
          date: string
          description: string | null
          id: number
          plan_id: number | null
          space_id: number
          type: string
        }
        Insert: {
          account_from?: number | null
          account_to?: number | null
          amount_credit?: number | null
          amount_debit?: number | null
          created_at?: string
          date?: string
          description?: string | null
          id?: number
          plan_id?: number | null
          space_id: number
          type: string
        }
        Update: {
          account_from?: number | null
          account_to?: number | null
          amount_credit?: number | null
          amount_debit?: number | null
          created_at?: string
          date?: string
          description?: string | null
          id?: number
          plan_id?: number | null
          space_id?: number
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_from_fkey"
            columns: ["account_from"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_account_to_fkey"
            columns: ["account_to"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_space_with_members: {
        Args: {
          input_space_id: number
        }
        Returns: {
          id: number
          name: string
          created_at: string
          created_by: string
          members: Json
        }[]
      }
      user_has_space_access: {
        Args: {
          p_space_id: number
          p_user_uuid: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
