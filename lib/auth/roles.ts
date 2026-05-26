import type { UserRole } from "@/types/database"

export const ADMIN_ROLE: UserRole = "admin"
export const CUSTOMER_ROLE: UserRole = "customer"

export function isAdminRole(role: string | null | undefined): boolean {
  return role === ADMIN_ROLE
}

export function canAccessAdminPanel(role: string | null | undefined): boolean {
  return isAdminRole(role)
}
