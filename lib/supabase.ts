import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODM1NjcwMTAsImV4cCI6MTk5OTE0MzAxMH0.placeholder'

if (typeof window !== 'undefined' && (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
  console.error('⚠️ Supabase環境変数が設定されていません。')
  console.error('ローカル環境: .env.localファイルを作成してください')
  console.error('Vercel: Settings → Environment Variables で設定してください')
  console.error('詳細: ENV-SETUP.md または VERCEL-ENV-SETUP.md を参照')
}

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
      shopping_lists: {
        Row: {
          id: string
          content: string
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          content: string
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          content?: string
          created_by?: string
          created_at?: string
        }
      }
    }
  }
}

