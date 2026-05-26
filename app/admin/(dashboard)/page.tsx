import Link from "next/link"
import { Plus, Settings } from "lucide-react"
import { StatsCards } from "@/components/admin/stats-cards"
import { AdminBreadcrumbs } from "@/components/admin/admin-breadcrumbs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getDashboardProductStats } from "@/services/products.service"
import { getOrderStats } from "@/services/settings.service"
import type { DashboardStats } from "@/types/admin"

const emptyStats: DashboardStats = {
  totalProducts: 0,
  activeProducts: 0,
  lowStockProducts: 0,
  totalOrders: 0,
  pendingOrders: 0,
  revenue: 0,
}

export default async function AdminDashboardPage() {
  let stats = emptyStats

  try {
    const [productStats, orderStats] = await Promise.all([
      getDashboardProductStats(),
      getOrderStats(),
    ])
    stats = { ...productStats, ...orderStats }
  } catch {
    stats = emptyStats
  }

  return (
    <div>
      <AdminBreadcrumbs items={[{ label: "Dashboard" }]} />
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Resumen de tu tienda venextrading</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo producto
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/settings">
              <Settings className="mr-2 h-4 w-4" />
              Configuración
            </Link>
          </Button>
        </div>
      </div>

      <StatsCards stats={stats} />

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Acciones rápidas</CardTitle>
            <CardDescription>Gestiona el catálogo y la tienda</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button asChild variant="secondary">
              <Link href="/admin/products">Ver productos</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/admin/products/new">Crear producto</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/settings">Configurar tienda</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Acceso admin</CardTitle>
            <CardDescription>Super admin temporal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Login: cookie (sin Supabase Auth).</p>
            <p>• Datos: Supabase con service_role recomendada.</p>
            <p>• Credenciales: docs/ADMIN-CREDENCIALES.md</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
