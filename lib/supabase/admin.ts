import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"
import {
  getSupabasePublishableKey,
  getSupabaseSecretKey,
  getSupabaseUrl,
} from "@/lib/supabase/env"

export function hasAdminServiceRole(): boolean {
  return !!(getSupabaseUrl() && getSupabaseSecretKey())
}

/**
 * Cliente para el panel admin.
 * Preferir service_role (bypass RLS). Si falta, usa publishable/anon (lecturas limitadas por RLS).
 */
export function createAdminDbClient() {
  const url = getSupabaseUrl()
  const serviceKey = getSupabaseSecretKey()
  const anonKey = getSupabasePublishableKey()

  if (!url) {
    throw new Error("Falta NEXT_PUBLIC_SUPABASE_URL en .env.local")
  }

  if (serviceKey) {
    return createClient<Database>(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }

  if (anonKey) {
    return createClient<Database>(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }

  throw new Error("Faltan claves de Supabase en .env.local")
}
