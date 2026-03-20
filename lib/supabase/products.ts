import type { Product } from "@/lib/types"

export function rowToProduct(row: {
  id: string
  name: string
  price: number
  category: string
  description: string
  image: string
  type: "catalog" | "store"
  specifications: unknown
  tech_sheet_url: string | null
  created_at: string
}): Product {
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    category: row.category,
    description: row.description,
    image: row.image,
    type: row.type,
    specifications:
      row.specifications && typeof row.specifications === "object" && !Array.isArray(row.specifications)
        ? (row.specifications as Record<string, string>)
        : undefined,
    techSheetUrl: row.tech_sheet_url || undefined,
    createdAt: row.created_at.split("T")[0] || row.created_at,
  }
}

export function productToRow(product: Omit<Product, "id" | "createdAt"> & { id?: string; createdAt?: string }) {
  return {
    name: product.name,
    price: product.price,
    category: product.category,
    description: product.description,
    image: product.image,
    type: product.type,
    specifications: product.specifications || {},
    tech_sheet_url: product.techSheetUrl || null,
  }
}
