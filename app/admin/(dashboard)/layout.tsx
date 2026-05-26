import { requireAdmin } from "@/lib/auth/session"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { ServiceRoleBanner } from "@/components/admin/service-role-banner"
import { DatabaseSetupBanner } from "@/components/admin/database-setup-banner"
import { createAdminDbClient } from "@/lib/supabase/admin"
import { isMissingSchemaError } from "@/lib/supabase/db-errors"

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAdmin()

  let schemaMissing = false
  try {
    const supabase = createAdminDbClient()
    const { error } = await supabase.from("products").select("id", { head: true, count: "exact" })
    if (error && isMissingSchemaError(error.message)) schemaMissing = true
  } catch {
    schemaMissing = true
  }

  return (
    <div className="admin-panel light flex h-screen overflow-hidden bg-background">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader user={user} />
        <main className="flex-1 overflow-y-auto p-6">
          <ServiceRoleBanner />
          {schemaMissing && <DatabaseSetupBanner />}
          {children}
        </main>
      </div>
    </div>
  )
}
