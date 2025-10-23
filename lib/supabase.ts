import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          created_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          created_at?: string
        }
      }
      inventory_items: {
        Row: {
          id: string
          name: string
          category: string
          quantity: number
          last_updated: string
          updated_by: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category?: string
          quantity: number
          last_updated?: string
          updated_by: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          quantity?: number
          last_updated?: string
          updated_by?: string
          created_at?: string
        }
      }
      inventory_history: {
        Row: {
          id: string
          item_id: string
          quantity: number
          inventory_date: string
          updated_by: string
          created_at: string
        }
        Insert: {
          id?: string
          item_id: string
          quantity: number
          inventory_date?: string
          updated_by: string
          created_at?: string
        }
        Update: {
          id?: string
          item_id?: string
          quantity?: number
          inventory_date?: string
          updated_by?: string
          created_at?: string
        }
      }
      todos: {
        Row: {
          id: string
          title: string
          completed: boolean
          is_shared: boolean
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          completed?: boolean
          is_shared: boolean
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          completed?: boolean
          is_shared?: boolean
          created_by?: string
          created_at?: string
        }
      }
      shared_lists: {
        Row: {
          id: string
          title: string
          content: string
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          created_by?: string
          created_at?: string
        }
      }
    }
  }
}

