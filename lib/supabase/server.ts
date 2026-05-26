import { createServerClient as createSupabaseServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"
import {
  getSupabasePublishableKey,
  getSupabaseUrl,
  isSupabasePublicConfigured,
} from "@/lib/supabase/env"

export function isSupabaseEnvConfigured() {
  return isSupabasePublicConfigured()
}

/** Cliente con sesión del usuario (Server Components, Actions, Route Handlers) */
export async function createServerClient() {
  const url = getSupabaseUrl()
  const anonKey = getSupabasePublishableKey()
  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (o ANON_KEY)"
    )
  }

  const cookieStore = await cookies()

  return createSupabaseServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // setAll desde Server Component (solo lectura)
        }
      },
    },
  })
}

/** Cliente anónimo sin cookies — lecturas públicas en API */
export function createAnonymousServerClient() {
  const url = getSupabaseUrl()
  const anonKey = getSupabasePublishableKey()
  if (!url || !anonKey) throw new Error("Missing Supabase env vars")
  return createClient<Database>(url, anonKey)
}
