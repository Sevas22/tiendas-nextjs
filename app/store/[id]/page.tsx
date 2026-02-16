"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ShoppingBag, Minus, Plus, Tag, Layers, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/contexts/language-context"
import { getProductById, getProducts } from "@/lib/products-store"
import type { Product } from "@/lib/types"

export default function StoreProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { t } = useLanguage()
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const found = getProductById(id)
    if (found) {
      setProduct(found)
      const allStore = getProducts("store")
      setRelated(
        allStore.filter((p) => p.id !== found.id).slice(0, 3)
      )
    }
  }, [id])

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-20">
        <p className="text-lg text-muted-foreground">Product not found.</p>
      </div>
    )
  }

  return (
    <div className="bg-background pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
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
                src={product.image}
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
            <Badge className="mb-3 w-fit bg-gold text-white">{product.category}</Badge>
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mb-6 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-primary">${product.price.toFixed(2)}</span>
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
                  <p className="font-medium text-foreground">${product.price.toFixed(2)} per unit</p>
                </div>
              </div>
            </div>

            {/* Quantity selector */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Quantity
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
                  onClick={() => setQuantity((q) => q + 1)}
                  className="h-10 w-10"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="ml-4 text-lg font-semibold text-primary">
                  Total: ${(product.price * quantity).toFixed(2)}
                </span>
              </div>
            </div>

            {/* CTA */}
            <Button
              asChild
              size="lg"
              className="mt-auto bg-gold text-white hover:bg-gold/90"
            >
              <Link href={`/request?product=${encodeURIComponent(product.name)}&qty=${quantity}`}>
                <ShoppingBag className="mr-2 h-5 w-5" />
                {t.storePage.contactToOrder}
              </Link>
            </Button>
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
                        <Badge className="absolute left-3 top-3 bg-gold text-white">
                          {rp.category}
                        </Badge>
                      </div>
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-lg font-semibold text-foreground">{rp.name}</h3>
                          <span className="shrink-0 text-lg font-bold text-primary">
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
