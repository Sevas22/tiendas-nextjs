"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import {
  setAdminSessionCookie,
  clearAdminSessionCookie,
} from "@/lib/auth/session"
import { validateSuperAdminCredentials } from "@/lib/auth/super-admin"
import type { ActionResult } from "@/types/admin"

export async function adminLoginAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const email = formData.get("email")?.toString() ?? ""
  const password = formData.get("password")?.toString() ?? ""

  if (!email || !password) {
    return { success: false, error: "Email y contraseña son obligatorios" }
  }

  if (!validateSuperAdminCredentials(email, password)) {
    return { success: false, error: "Credenciales incorrectas" }
  }

  await setAdminSessionCookie()

  const redirectTo = formData.get("redirect")?.toString() || "/admin"
  revalidatePath("/admin")
  redirect(redirectTo)
}

export async function adminLogoutAction() {
  await clearAdminSessionCookie()
  revalidatePath("/admin")
  redirect("/admin/login")
}
