"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ShoppingBag, Minus, Plus, Tag, Layers, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ProductSpecificationsTable } from "@/components/product-specifications-table"
import { VariantPicker } from "@/components/store/variant-picker"
import { useCart } from "@/contexts/cart-context"
import { useLanguage } from "@/contexts/language-context"
import { toast } from "sonner"
import { getProductById, getProducts } from "@/lib/products-store"
import { isSupabaseConfigured } from "@/lib/supabase/client"
import type { Product } from "@/lib/types"

export default function StoreProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { t } = useLanguage()
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null)
  const [displayImage, setDisplayImage] = useState<string>("")
  const { addLine } = useCart()

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      const found = getProductById(id)
      if (found && found.type === "store") {
        if (!cancelled) {
          setProduct(found)
          setDisplayImage(found.image)
          setSelectedVariantId(found.id)
          const allStore = getProducts("store")
          setRelated(allStore.filter((p) => p.id !== found.id).slice(0, 3))
        }
        setLoading(false)
        return
      }

      if (isSupabaseConfigured()) {
        try {
          const r = await fetch(`/api/products/${id}`)
          if (r.ok) {
            const p: Product = await r.json()
            if (!cancelled && p.type === "store") {
              setProduct(p)
              setDisplayImage(p.image)
              setSelectedVariantId(
                p.hasVariants ? p.defaultVariantId ?? p.variants?.[0]?.id ?? null : p.id
              )
              const r2 = await fetch("/api/products?type=store")
              const list: Product[] = r2.ok ? await r2.json() : []
              const arr = Array.isArray(list) ? list : []
              setRelated(arr.filter((x) => x.id !== p.id).slice(0, 3))
            }
          }
        } catch {
          /* keep product null */
        }
      }
      if (!cancelled) setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-20">
        <p className="text-lg text-muted-foreground">{t.storePage.loadingProduct}</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-20">
        <p className="text-lg text-muted-foreground">{t.storePage.productNotFound}</p>
      </div>
    )
  }

  const selectedVariant = product.hasVariants
    ? product.variants?.find((v) => v.id === selectedVariantId)
    : null
  const unitPrice = selectedVariant?.price ?? product.price
  const maxStock = product.hasVariants ? (selectedVariant?.stock ?? 0) : 9999
  const variantTitle = selectedVariant?.title ?? product.name

  const handleVariantSelect = (variantId: string) => {
    setSelectedVariantId(variantId)
    const v = product.variants?.find((x) => x.id === variantId)
    if (v?.imageUrl) setDisplayImage(v.imageUrl)
  }

  const handleAddToCart = () => {
    const variantId = product.hasVariants ? selectedVariantId : product.id
    if (!variantId || (product.hasVariants && !selectedVariant)) {
      toast.error("Selecciona una variante")
      return
    }
    if (product.hasVariants && (selectedVariant?.stock ?? 0) < 1) {
      toast.error("Variante sin stock")
      return
    }
    addLine(
      {
        variantId,
        productId: product.id,
        productName: product.name,
        variantTitle,
        imageUrl: displayImage || product.image,
        unitPrice,
      },
      quantity
    )
    toast.success("Añadido al carrito")
  }

  return (
    <div className="bg-background pt-20 pb-10 sm:pt-24 sm:pb-12 md:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Button asChild variant="ghost" className="mb-6 text-muted-foreground hover:text-foreground">
          <Link href="/store">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.storePage.backToStore}
          </Link>
        </Button>

        {/* Product main section */}
        <div className="flex flex-col gap-10 lg:flex-row">
          {/* Image */}
          <div className="w-full lg:w-1/2">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary">
              <Image
                src={displayImage || product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex w-full flex-col lg:w-1/2">
            <Badge className="mb-3 w-fit bg-gold text-foreground font-medium">{product.category}</Badge>
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mb-6 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-[#1A51BE]">${unitPrice.toFixed(2)}</span>
              <span className="text-sm text-muted-foreground">USD</span>
            </div>

            <Separator className="mb-6" />

            {/* Description */}
            <div className="mb-6">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gold">
                <Package className="h-4 w-4" />
                {t.storePage.description}
              </h3>
              <p className="leading-relaxed text-muted-foreground">{product.description}</p>
            </div>

            <ProductSpecificationsTable
              title={t.storePage.specifications}
              specifications={product.specifications ?? {}}
              className="mb-6"
            />

            {product.hasVariants && product.optionGroups && product.variants && (
              <VariantPicker
                className="mb-6"
                optionGroups={product.optionGroups}
                variants={product.variants}
                selectedVariantId={selectedVariantId}
                onSelect={handleVariantSelect}
                basePrice={product.price}
              />
            )}

            {/* Info items */}
            <div className="mb-6 flex flex-col gap-3">
              <div className="flex items-center gap-3 rounded-lg bg-secondary px-4 py-3">
                <Tag className="h-5 w-5 text-primary" />
                <div>
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {t.storePage.category}
                  </span>
                  <p className="font-medium text-foreground">{product.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-secondary px-4 py-3">
                <Layers className="h-5 w-5 text-primary" />
                <div>
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {t.storePage.price}
                  </span>
                  <p className="font-medium text-foreground">${product.price.toFixed(2)} {t.storePage.perUnit}</p>
                </div>
              </div>
            </div>

            {/* Quantity selector */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {t.storePage.quantity}
              </label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="h-10 w-10"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center text-lg font-bold text-foreground">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
                  disabled={quantity >= maxStock}
                  className="h-10 w-10"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="ml-4 text-lg font-semibold text-[#1A51BE]">
                  {t.storePage.total}: ${(unitPrice * quantity).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mt-auto flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                size="lg"
                className="flex-1 bg-gold text-foreground shadow-[0_2px_10px_rgba(204,163,0,0.3)] hover:bg-gold/90"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Añadir al carrito
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="flex-1 border-gold"
              >
                <Link
                  href={`/request?product=${encodeURIComponent(product.name)}&variant=${encodeURIComponent(variantTitle)}&qty=${quantity}`}
                >
                  {t.storePage.contactToOrder}
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <>
            <Separator className="my-16" />
            <div>
              <h2 className="mb-8 text-2xl font-bold text-foreground">{t.storePage.relatedProducts}</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((rp) => (
                  <Card
                    key={rp.id}
                    className="group overflow-hidden border-0 bg-card shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    <Link href={`/store/${rp.id}`}>
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={rp.image}
                          alt={rp.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <Badge className="absolute left-3 top-3 bg-gold text-foreground font-medium">
                          {rp.category}
                        </Badge>
                      </div>
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-lg font-semibold text-foreground">{rp.name}</h3>
                          <span className="shrink-0 text-lg font-bold text-[#1A51BE]">
                            ${rp.price.toFixed(2)}
                          </span>
                        </div>
                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{rp.description}</p>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
