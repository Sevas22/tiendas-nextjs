import type { Product } from "./types"
import { sampleCatalogProducts, sampleStoreProducts } from "./sample-data"

const STORE_KEY = "china-trading-store-products"
const CATALOG_KEY = "china-trading-catalog-products"
const SEEDED_KEY = "china-trading-seeded"

function ensureSeeded() {
  if (typeof window === "undefined") return
  if (localStorage.getItem(SEEDED_KEY)) return

  localStorage.setItem(STORE_KEY, JSON.stringify(sampleStoreProducts))
  localStorage.setItem(CATALOG_KEY, JSON.stringify(sampleCatalogProducts))
  localStorage.setItem(SEEDED_KEY, "true")
}

export function getProducts(type: "store" | "catalog"): Product[] {
  if (typeof window === "undefined") return type === "store" ? sampleStoreProducts : sampleCatalogProducts
  ensureSeeded()
  const key = type === "store" ? STORE_KEY : CATALOG_KEY
  const data = localStorage.getItem(key)
  if (!data) return []
  try {
    return JSON.parse(data) as Product[]
  } catch {
    return []
  }
}

export function getProductById(id: string): Product | undefined {
  const allProducts = [...getProducts("store"), ...getProducts("catalog")]
  return allProducts.find((p) => p.id === id)
}

export function addProduct(product: Omit<Product, "id" | "createdAt">): Product {
  const newProduct: Product = {
    ...product,
    id: `${product.type}-${Date.now()}`,
    createdAt: new Date().toISOString().split("T")[0],
  }
  const products = getProducts(product.type)
  products.push(newProduct)
  const key = product.type === "store" ? STORE_KEY : CATALOG_KEY
  localStorage.setItem(key, JSON.stringify(products))
  return newProduct
}

export function updateProduct(id: string, updates: Partial<Product>): Product | undefined {
  const product = getProductById(id)
  if (!product) return undefined

  const products = getProducts(product.type)
  const index = products.findIndex((p) => p.id === id)
  if (index === -1) return undefined

  const updated = { ...products[index], ...updates }
  products[index] = updated
  const key = product.type === "store" ? STORE_KEY : CATALOG_KEY
  localStorage.setItem(key, JSON.stringify(products))
  return updated
}

export function deleteProduct(id: string): boolean {
  const product = getProductById(id)
  if (!product) return false

  const products = getProducts(product.type)
  const filtered = products.filter((p) => p.id !== id)
  const key = product.type === "store" ? STORE_KEY : CATALOG_KEY
  localStorage.setItem(key, JSON.stringify(filtered))
  return true
}

export function getCategories(type: "store" | "catalog"): string[] {
  const products = getProducts(type)
  const cats = new Set(products.map((p) => p.category))
  return Array.from(cats).sort()
}
