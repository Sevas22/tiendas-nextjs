// app/request/page.tsx
import { Suspense } from "react"
import RequestClient from "./RequestClient"

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10">Cargando…</div>}>
      <RequestClient />
    </Suspense>
  )
}