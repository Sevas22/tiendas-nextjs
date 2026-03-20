import type { Metadata } from "next"
import { buildPageMetadata } from "@/lib/seo/page-metadata"

export const metadata: Metadata = buildPageMetadata("products")

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children
}
