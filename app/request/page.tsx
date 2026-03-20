// app/request/page.tsx
import { Suspense } from "react"
import type { Metadata } from "next"
import { buildPageMetadata } from "@/lib/seo/page-metadata"
import RequestClient from "./RequestClient"

export const metadata: Metadata = buildPageMetadata("request")

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10">Cargando…</div>}>
      <RequestClient />
    </Suspense>
  )
}