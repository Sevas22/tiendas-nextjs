import type { MetadataRoute } from "next"
import { getProducts } from "@/lib/products-store"

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://venextrading.com"

export default function sitemap(): MetadataRoute.Sitemap {
  const catalogProducts = getProducts("catalog")
  const storeProducts = getProducts("store")

  const productUrls = catalogProducts.map((p) => ({
    url: `${baseUrl}/products/${p.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  const storeUrls = storeProducts.map((p) => ({
    url: `${baseUrl}/store/${p.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/store`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/request`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ]

  return [...staticPages, ...productUrls, ...storeUrls]
}
