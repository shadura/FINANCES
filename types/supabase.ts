export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      budget_items: {
        Row: {
          id: string
          user_id: string
          amount: number
          currency: string
          name: string
          created_at: string
          month: number
          year: number
        }
        Insert: {
          id?: string
          user_id?: string
          amount: number
          currency: string
          name: string
          created_at?: string
          month: number
          year: number
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          currency?: string
          name?: string
          created_at?: string
          month?: number
          year?: number
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          user_id?: string
        }
        Update: {
          id?: string
          name?: string
          user_id?: string
        }
      }
      budget_item_tags: {
        Row: {
          id: string
          budget_item_id: string
          tag_id: string
        }
        Insert: {
          id?: string
          budget_item_id: string
          tag_id: string
        }
        Update: {
          id?: string
          budget_item_id?: string
          tag_id?: string
        }
      }
      spaces: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string
          created_by?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string
          created_by?: string
        }
      }
      space_users: {
        Row: {
          id: string
          space_id: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          space_id: string
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          space_id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
        }
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
  }
}
