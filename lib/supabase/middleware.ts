import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import type { Database } from "@/types/database"
import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/supabase/env"

export function createMiddlewareClient(request: NextRequest, response: NextResponse) {
  const url = getSupabaseUrl()
  const key = getSupabasePublishableKey()
  if (!url || !key) return null

  return createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value)
          response.cookies.set(name, value, options)
        })
      },
    },
  })
}
