import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Fragment } from "react"

export interface BreadcrumbItem {
  label: string
  href?: string
}

export function AdminBreadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
      <Link href="/admin" className="hover:text-foreground">
        Admin
      </Link>
      {items.map((item, i) => (
        <Fragment key={`${item.label}-${i}`}>
          <ChevronRight className="h-4 w-4" />
          {item.href ? (
            <Link href={item.href} className="hover:text-foreground">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-foreground">{item.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  )
}
