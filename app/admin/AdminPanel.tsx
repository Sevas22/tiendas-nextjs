"use client"

import { useState, useEffect } from "react"
import { LogOut, Plus, Pencil, Trash2, Package, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/products-store"
import type { Product } from "@/lib/types"
import { ProductForm } from "./ProductForm"
import { useLanguage } from "@/contexts/language-context"
import { createClient } from "@/lib/supabase/client"
import { productToRow, rowToProduct } from "@/lib/supabase/products"

type TabType = "catalog" | "store"

interface AdminPanelProps {
  onLogout: () => void
  useSupabase?: boolean
}

export function AdminPanel({ onLogout, useSupabase = false }: AdminPanelProps) {
  const { t } = useLanguage()
  const [tab, setTab] = useState<TabType>("catalog")
  const [products, setProducts] = useState<Product[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  const loadProducts = async () => {
    if (useSupabase) {
      setLoading(true)
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setProducts([])
          return
        }
        const { data: rows } = await supabase
          .from("products")
          .select("*")
          .eq("type", tab)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
        setProducts((rows || []).map((row) => rowToProduct(row as Parameters<typeof rowToProduct>[0])))
      } catch {
        setProducts([])
      } finally {
        setLoading(false)
      }
    } else {
      setProducts(getProducts(tab))
    }
  }

  useEffect(() => {
    loadProducts()
  }, [tab, useSupabase])

  const handleSave = async (data: Omit<Product, "id" | "createdAt">) => {
    if (useSupabase) {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const row = { ...productToRow(data), user_id: user.id }
      if (editingProduct) {
        await supabase.from("products").update(row).eq("id", editingProduct.id)
      } else {
        await supabase.from("products").insert(row)
      }
    } else {
      if (editingProduct) {
        updateProduct(editingProduct.id, data)
      } else {
        addProduct(data)
      }
    }
    setEditingProduct(null)
    setShowForm(false)
    loadProducts()
  }

  const handleDelete = async (product: Product) => {
    if (!confirm(t.admin.confirmDelete)) return
    if (useSupabase) {
      await createClient().from("products").delete().eq("id", product.id)
    } else {
      deleteProduct(product.id)
    }
    loadProducts()
    if (editingProduct?.id === product.id) {
      setEditingProduct(null)
      setShowForm(false)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleAddNew = () => {
    setEditingProduct(null)
    setShowForm(true)
  }

  const handleCancel = () => {
    setEditingProduct(null)
    setShowForm(false)
  }

  return (
    <div className="min-h-screen bg-background pb-20 pt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t.admin.title}</h1>
            {useSupabase && (
              <p className="mt-1 text-sm text-muted-foreground">{t.admin.providerPanelSubtitle}</p>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={onLogout} className="w-fit">
            <LogOut className="mr-2 h-4 w-4" />
            {t.admin.logout}
          </Button>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setTab("catalog")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === "catalog"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-foreground hover:bg-secondary/80"
            }`}
          >
            <Package className="h-4 w-4" />
            {t.admin.catalogProducts}
          </button>
          <button
            onClick={() => setTab("store")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === "store"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-foreground hover:bg-secondary/80"
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            {t.admin.storeProducts}
          </button>
        </div>

        {/* Add Product Button */}
        {!showForm && (
          <Button onClick={handleAddNew} className="mb-6">
            <Plus className="mr-2 h-4 w-4" />
            {t.admin.addProduct}
          </Button>
        )}

        {/* Product Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingProduct ? t.admin.editProduct : t.admin.addProduct}</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductForm
                product={editingProduct}
                type={tab}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            </CardContent>
          </Card>
        )}

        {/* Product List */}
        <div className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-16">
                <p className="text-muted-foreground">Cargando productos...</p>
              </CardContent>
            </Card>
          ) : products.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Package className="mb-4 h-16 w-16 text-muted-foreground" />
                <p className="mb-4 text-muted-foreground">{t.admin.noProducts}</p>
                <Button onClick={handleAddNew}>
                  <Plus className="mr-2 h-4 w-4" />
                  {t.admin.addProduct}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="relative aspect-[4/3] bg-secondary">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="mb-1 font-semibold text-foreground line-clamp-1">{product.name}</h3>
                    <p className="mb-3 text-sm text-muted-foreground">
                      ${product.price.toFixed(2)} · {product.category}
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(product)} className="flex-1">
                        <Pencil className="mr-1 h-3.5 w-3.5" />
                        {t.admin.editProduct}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(product)}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
