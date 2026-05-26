/**
 * Acceso temporal al panel admin (sin Supabase Auth).
 * Sustituir por auth real cuando esté listo.
 */

export const ADMIN_SESSION_COOKIE = "venextrading_admin_session"

/** Usuario super admin por defecto — cambiar en .env.local si quieres */
export const SUPER_ADMIN_EMAIL =
  process.env.ADMIN_EMAIL ?? "admin@venextrading.com"

export const SUPER_ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD ?? "VenexAdmin2025!"

const SESSION_TOKEN =
  process.env.ADMIN_SESSION_SECRET ?? "venextrading-super-admin-dev-2025"

export function validateSuperAdminCredentials(
  email: string,
  password: string
): boolean {
  return (
    email.trim().toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase() &&
    password === SUPER_ADMIN_PASSWORD
  )
}

export function getAdminSessionToken(): string {
  return SESSION_TOKEN
}

export function isValidAdminSession(value: string | undefined): boolean {
  return value === SESSION_TOKEN
}

export const SUPER_ADMIN_USER = {
  id: "super-admin",
  email: SUPER_ADMIN_EMAIL,
  fullName: "Super Admin",
  role: "admin" as const,
}
