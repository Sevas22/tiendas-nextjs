"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, FileDown, Eye, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { HeroBanner } from "@/components/hero-banner"
import { useLanguage } from "@/contexts/language-context"
import { getProducts, getCategories } from "@/lib/products-store"
import type { Product } from "@/lib/types"

export default function ProductsPage() {
  const { t } = useLanguage()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [search, setSearch] = useState("")

  useEffect(() => {
    setProducts(getProducts("catalog"))
    setCategories(getCategories("catalog"))
  }, [])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = selectedCategory === "all" || p.category === selectedCategory
      const matchesSearch =
        search === "" ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [products, selectedCategory, search])

  return (
    <>
      <HeroBanner title={t.productsPage.title} subtitle={t.productsPage.subtitle} />

      <section className="bg-background py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          {/* Filters bar */}
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t.storePage.search}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
                className={selectedCategory === "all" ? "bg-primary text-primary-foreground" : ""}
              >
                {t.productsPage.allCategories}
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className={selectedCategory === cat ? "bg-primary text-primary-foreground" : ""}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product) => (
              <Card
                key={product.id}
                className="group overflow-hidden border-0 bg-card shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <Badge className="absolute left-3 top-3 bg-primary text-primary-foreground">
                    {product.category}
                  </Badge>
                </div>
                <CardContent className="flex flex-col gap-3 p-5">
                  <h3 className="text-lg font-semibold text-foreground">{product.name}</h3>
                  <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {product.description}
                  </p>
                  <div className="mt-auto flex items-center gap-2 pt-2">
                    <Button asChild size="sm" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                      <Link href={`/products/${product.id}`}>
                        <Eye className="mr-1.5 h-3.5 w-3.5" />
                        {t.productsPage.viewDetails}
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="flex-1 border-gold text-gold hover:bg-gold hover:text-white"
                    >
                      <a href="/techsheet.pdf" download="CHINA-Trading-TechSheet.pdf">
                        <FileDown className="mr-1.5 h-3.5 w-3.5" />
                        {t.productsPage.downloadSheet}
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-lg text-muted-foreground">No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
