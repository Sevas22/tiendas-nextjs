import type { Metadata } from "next"
import { buildPageMetadata } from "@/lib/seo/page-metadata"

export const metadata: Metadata = buildPageMetadata("store")

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return children
}
