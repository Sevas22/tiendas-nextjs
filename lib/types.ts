import type { ProductOptionGroup, ProductVariant } from "@/types/variants"

export interface Product {
  id: string
  name: string
  price: number
  category: string
  description: string
  image: string
  type: "store" | "catalog"
  specifications?: Record<string, string>
  techSheetUrl?: string
  createdAt: string
  hasVariants?: boolean
  optionGroups?: ProductOptionGroup[]
  variants?: ProductVariant[]
  defaultVariantId?: string | null
}

export interface ProductRequest {
  fullName: string
  email: string
  phone?: string
  company?: string
  country?: string
  productInterest?: string
  quantity?: string
  message?: string
}

export type Language = "en" | "es"
