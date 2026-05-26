"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Store,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Productos", icon: Package },
  { href: "/admin/settings", label: "Configuración", icon: Settings },
  { href: "/admin/orders", label: "Pedidos", icon: ShoppingCart, disabled: true },
  { href: "/", label: "Ver tienda", icon: Store, external: true },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-border bg-card transition-all duration-200",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {!collapsed && (
          <Link href="/admin" className="font-semibold text-foreground">
            venextrading
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = item.exact
            ? pathname === item.href
            : pathname?.startsWith(item.href)

          if (item.disabled) {
            return (
              <span
                key={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground/60",
                  collapsed && "justify-center px-2"
                )}
                title="Próximamente"
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>Pedidos (pronto)</span>}
              </span>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <p className={cn("p-4 text-xs text-muted-foreground", collapsed && "hidden")}>
        Panel administrativo
      </p>
    </aside>
  )
}
