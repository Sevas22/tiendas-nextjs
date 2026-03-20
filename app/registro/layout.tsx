import type { Metadata } from "next"
import { buildPageMetadata } from "@/lib/seo/page-metadata"

export const metadata: Metadata = buildPageMetadata("registro")

export default function RegistroLayout({ children }: { children: React.ReactNode }) {
  return children
}
