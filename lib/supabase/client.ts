"use client"

import { createBrowserClient } from "@supabase/ssr"

export function isSupabaseConfigured() {
  return !!(
    typeof window !== "undefined" &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

let browserClient: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY")
  }
  if (typeof window !== "undefined" && browserClient) return browserClient
  const client = createBrowserClient(supabaseUrl, supabaseAnonKey)
  if (typeof window !== "undefined") browserClient = client
  return client
}
