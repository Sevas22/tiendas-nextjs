import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, AlertTriangle, DollarSign } from "lucide-react"
import type { DashboardStats } from "@/types/admin"

const cards = [
  {
    key: "totalProducts" as const,
    label: "Total productos",
    icon: Package,
    format: (v: number) => String(v),
  },
  {
    key: "activeProducts" as const,
    label: "Productos activos",
    icon: Package,
    format: (v: number) => String(v),
  },
  {
    key: "lowStockProducts" as const,
    label: "Stock bajo",
    icon: AlertTriangle,
    format: (v: number) => String(v),
  },
  {
    key: "totalOrders" as const,
    label: "Pedidos",
    icon: ShoppingCart,
    format: (v: number) => String(v),
  },
  {
    key: "pendingOrders" as const,
    label: "Pedidos pendientes",
    icon: ShoppingCart,
    format: (v: number) => String(v),
  },
  {
    key: "revenue" as const,
    label: "Ingresos",
    icon: DollarSign,
    format: (v: number) => `$${v.toLocaleString("es-VE", { minimumFractionDigits: 2 })}`,
  },
]

export function StatsCards({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map(({ key, label, icon: Icon, format }) => (
        <Card key={key}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{format(stats[key])}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
