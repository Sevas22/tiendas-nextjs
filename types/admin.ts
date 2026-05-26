import type {
  OrderStatus,
  ProductStatus,
  ProductType,
  UserRole,
} from "@/types/database"
import type { ProductOptionGroup, ProductVariant } from "@/types/variants"

export interface AdminUser {
  id: string
  email: string
  fullName: string | null
  role: UserRole
}

export interface AdminProduct {
  id: string
  name: string
  slug: string
  description: string
  price: number
  stock: number
  sku: string | null
  status: ProductStatus
  discount: number
  category: string
  categoryId: string | null
  type: ProductType
  image: string
  images: AdminProductImage[]
  specifications: Record<string, string>
  techSheetUrl: string | null
  hasVariants: boolean
  optionGroupName: string | null
  variants: ProductVariant[]
  optionGroups: ProductOptionGroup[]
  createdAt: string
  updatedAt: string
}

export interface AdminProductImage {
  id: string
  url: string
  storagePath: string | null
  altText: string | null
  sortOrder: number
  isPrimary: boolean
}

export interface AdminCategory {
  id: string
  name: string
  slug: string
}

export interface StoreSettings {
  id: string
  storeName: string
  logoUrl: string | null
  faviconUrl: string | null
  bannerUrls: string[]
  socialLinks: Record<string, string>
  contactEmail: string | null
  contactPhone: string | null
  address: string | null
  paymentMethods: string[]
  shippingMethods: string[]
}

export interface DashboardStats {
  totalProducts: number
  activeProducts: number
  lowStockProducts: number
  totalOrders: number
  pendingOrders: number
  revenue: number
}

export interface ProductsListParams {
  page?: number
  pageSize?: number
  search?: string
  status?: ProductStatus | "all"
  categoryId?: string
  type?: ProductType | "all"
}

export interface ProductsListResult {
  products: AdminProduct[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  /** true si faltan tablas SQL en Supabase */
  setupRequired?: boolean
}

export interface ActionResult<T = void> {
  success: boolean
  data?: T
  error?: string
}

export type { OrderStatus, ProductStatus, ProductType, UserRole }
