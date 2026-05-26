import { getStoreSettings } from "@/services/settings.service"
import { SettingsForm } from "@/components/forms/settings-form"
import { AdminBreadcrumbs } from "@/components/admin/admin-breadcrumbs"

export default async function AdminSettingsPage() {
  const settings = await getStoreSettings()

  return (
    <div>
      <AdminBreadcrumbs items={[{ label: "Configuración" }]} />
      <h2 className="mb-6 text-2xl font-bold">Configuración de la tienda</h2>
      <SettingsForm settings={settings} />
    </div>
  )
}
