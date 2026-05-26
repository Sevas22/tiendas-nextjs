/** Clave pública: Supabase usa "publishable" o "anon" según la versión del dashboard */
export function getSupabasePublishableKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

export function getSupabaseUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_URL
}

export function isSupabasePublicConfigured(): boolean {
  return !!(getSupabaseUrl() && getSupabasePublishableKey())
}

/** Clave elevada servidor: secret (nuevo) o service_role (legacy JWT) */
export function getSupabaseSecretKey(): string | undefined {
  return (
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}
