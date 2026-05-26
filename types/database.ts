export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = "admin" | "customer" | "proveedor"
export type ProductStatus = "draft" | "active" | "archived"
export type ProductType = "catalog" | "store"
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"

export interface Database {
  public: {
    Tables: {
      roles: {
        Row: { id: string; name: string; description: string | null; created_at: string }
        Insert: { id: string; name: string; description?: string | null }
        Update: { id?: string; name?: string; description?: string | null }
      }
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          role: UserRole
          company: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          role?: UserRole
          company?: string | null
          phone?: string | null
        }
        Update: {
          email?: string | null
          full_name?: string | null
          role?: UserRole
          company?: string | null
          phone?: string | null
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          parent_id: string | null
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          parent_id?: string | null
          sort_order?: number
          is_active?: boolean
        }
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string | null
          price: number
          stock: number
          sku: string | null
          status: ProductStatus
          discount: number
          category: string
          category_id: string | null
          description: string
          image: string
          type: ProductType
          specifications: Json
          tech_sheet_url: string | null
          created_at: string
          updated_at: string
          user_id: string | null
          deleted_at: string | null
        }
        Insert: {
          name: string
          slug?: string | null
          price: number
          stock?: number
          sku?: string | null
          status?: ProductStatus
          discount?: number
          category: string
          category_id?: string | null
          description: string
          image: string
          type: ProductType
          specifications?: Json
          tech_sheet_url?: string | null
          user_id?: string | null
        }
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]> & {
          deleted_at?: string | null
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          url: string
          storage_path: string | null
          alt_text: string | null
          sort_order: number
          is_primary: boolean
          created_at: string
        }
        Insert: {
          product_id: string
          url: string
          storage_path?: string | null
          alt_text?: string | null
          sort_order?: number
          is_primary?: boolean
        }
        Update: Partial<Database["public"]["Tables"]["product_images"]["Insert"]>
      }
      store_settings: {
        Row: {
          id: string
          store_name: string
          logo_url: string | null
          favicon_url: string | null
          banner_urls: Json
          social_links: Json
          contact_email: string | null
          contact_phone: string | null
          address: string | null
          payment_methods: Json
          shipping_methods: Json
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          store_name?: string
          logo_url?: string | null
          favicon_url?: string | null
          banner_urls?: Json
          social_links?: Json
          contact_email?: string | null
          contact_phone?: string | null
          address?: string | null
          payment_methods?: Json
          shipping_methods?: Json
          metadata?: Json
        }
        Update: Partial<Database["public"]["Tables"]["store_settings"]["Insert"]>
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string | null
          customer_email: string
          customer_name: string | null
          customer_phone: string | null
          status: OrderStatus
          subtotal: number
          discount: number
          shipping_cost: number
          total: number
          shipping_address: Json | null
          payment_method: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          order_number: string
          user_id?: string | null
          customer_email: string
          customer_name?: string | null
          customer_phone?: string | null
          status?: OrderStatus
          subtotal?: number
          discount?: number
          shipping_cost?: number
          total?: number
          shipping_address?: Json | null
          payment_method?: string | null
          notes?: string | null
        }
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          product_sku: string | null
          quantity: number
          unit_price: number
          discount: number
          total: number
          created_at: string
        }
        Insert: {
          order_id: string
          product_id?: string | null
          product_name: string
          product_sku?: string | null
          quantity: number
          unit_price: number
          discount?: number
          total: number
        }
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>
      }
    }
  }
}
