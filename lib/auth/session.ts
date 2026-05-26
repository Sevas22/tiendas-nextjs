import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import {
  ADMIN_SESSION_COOKIE,
  SUPER_ADMIN_USER,
  getAdminSessionToken,
  isValidAdminSession,
} from "@/lib/auth/super-admin"
import type { AdminUser } from "@/types/admin"

export async function getAdminUser(): Promise<AdminUser | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value

  if (!isValidAdminSession(session)) return null

  return {
    id: SUPER_ADMIN_USER.id,
    email: SUPER_ADMIN_USER.email,
    fullName: SUPER_ADMIN_USER.fullName,
    role: SUPER_ADMIN_USER.role,
  }
}

export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdminUser()
  if (!admin) redirect("/admin/login")
  return admin
}

export async function redirectIfAuthenticated() {
  const admin = await getAdminUser()
  if (admin) redirect("/admin")
}

export async function setAdminSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.set(ADMIN_SESSION_COOKIE, getAdminSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_SESSION_COOKIE)
}
