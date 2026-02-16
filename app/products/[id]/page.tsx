"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, FileDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/contexts/language-context"
import { getProductById, getProducts } from "@/lib/products-store"
import type { Product } from "@/lib/types"

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { t } = useLanguage()
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])

  useEffect(() => {
    const found = getProductById(id)
    if (found) {
      setProduct(found)
      const allCatalog = getProducts("catalog")
      setRelated(
        allCatalog.filter((p) => p.id !== found.id && p.category === found.category).slice(0, 3)
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
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.productsPage.backToProducts}
          </Link>
        </Button>

        {/* Product main section */}
        <div className="flex flex-col gap-10 lg:flex-row">
          {/* Image */}
          <div className="w-full lg:w-1/2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
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
            <Badge className="mb-3 w-fit bg-primary text-primary-foreground">{product.category}</Badge>
            <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {product.name}
            </h1>

            <div className="mb-6">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gold">
                {t.productsPage.description}
              </h3>
              <p className="leading-relaxed text-muted-foreground">{product.description}</p>
            </div>

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gold">
                  {t.productsPage.specifications}
                </h3>
                <div className="overflow-hidden rounded-lg border border-border">
                  {Object.entries(product.specifications).map(([key, value], idx) => (
                    <div
                      key={key}
                      className={`flex items-center justify-between px-4 py-3 text-sm ${
                        idx % 2 === 0 ? "bg-secondary/50" : "bg-card"
                      }`}
                    >
                      <span className="font-medium text-foreground">{key}</span>
                      <span className="text-muted-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Download button */}
            <Button
              asChild
              size="lg"
              className="mt-auto bg-gold text-white hover:bg-gold/90"
            >
              <a href="/techsheet.pdf" download="CHINA-Trading-TechSheet.pdf">
                <FileDown className="mr-2 h-5 w-5" />
                {t.productsPage.downloadSheet}
              </a>
            </Button>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <>
            <Separator className="my-16" />
            <div>
              <h2 className="mb-8 text-2xl font-bold text-foreground">{t.productsPage.relatedProducts}</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((rp) => (
                  <Card
                    key={rp.id}
                    className="group overflow-hidden border-0 bg-card shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    <Link href={`/products/${rp.id}`}>
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={rp.image}
                          alt={rp.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <Badge className="absolute left-3 top-3 bg-primary text-primary-foreground">
                          {rp.category}
                        </Badge>
                      </div>
                      <CardContent className="p-5">
                        <h3 className="text-lg font-semibold text-foreground">{rp.name}</h3>
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
