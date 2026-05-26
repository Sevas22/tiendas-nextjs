"use client"

import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/types/database"
import { getSupabasePublishableKey, getSupabaseUrl, isSupabasePublicConfigured } from "@/lib/supabase/env"

export function isSupabaseConfigured() {
  return typeof window !== "undefined" && isSupabasePublicConfigured()
}

let browserClient: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  const supabaseUrl = getSupabaseUrl()
  const supabaseAnonKey = getSupabasePublishableKey()
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (o ANON_KEY)"
    )
  }
  if (typeof window !== "undefined" && browserClient) return browserClient
  const client = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  if (typeof window !== "undefined") browserClient = client
  return client
}
