export interface Product {
  id: string
  name: string
  price: number
  category: string
  description: string
  image: string
  type: "store" | "catalog"
  specifications?: Record<string, string>
  createdAt: string
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
