import { redirectIfAuthenticated } from "@/lib/auth/session"
import { AdminLoginForm } from "@/components/forms/admin-login-form"

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>
}) {
  await redirectIfAuthenticated()
  const params = await searchParams

  return <AdminLoginForm redirectTo={params.redirect} />
}
