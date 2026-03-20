export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          role: "proveedor" | "admin"
          company: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          role?: "proveedor" | "admin"
          company?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          role?: "proveedor" | "admin"
          company?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          price: number
          category: string
          description: string
          image: string
          type: "catalog" | "store"
          specifications: Json
          tech_sheet_url: string | null
          created_at: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          id?: string
          name: string
          price: number
          category: string
          description: string
          image: string
          type: "catalog" | "store"
          specifications?: Json
          tech_sheet_url?: string | null
          created_at?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          price?: number
          category?: string
          description?: string
          image?: string
          type?: "catalog" | "store"
          specifications?: Json
          tech_sheet_url?: string | null
          created_at?: string
          updated_at?: string
          user_id?: string | null
        }
      }
    }
  }
}
