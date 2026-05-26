import Link from "next/link"
import { Plus } from "lucide-react"
import { listAdminProducts } from "@/services/products.service"
import { ProductsTable } from "@/components/admin/products-table"
import { AdminBreadcrumbs } from "@/components/admin/admin-breadcrumbs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string
    search?: string
    status?: string
    type?: string
  }>
}) {
  const params = await searchParams
  const page = Number(params.page) || 1

  const { products, total, totalPages } = await listAdminProducts({
    page,
    pageSize: 10,
    search: params.search,
    status: (params.status as "draft" | "active" | "archived" | "all") || "all",
    type: (params.type as "catalog" | "store" | "all") || "all",
  })

  return (
    <div>
      <AdminBreadcrumbs items={[{ label: "Productos" }]} />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Productos</h2>
          <p className="text-sm text-muted-foreground">{total} productos en total</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo producto
          </Link>
        </Button>
      </div>

      <form className="mb-6 flex flex-wrap items-center gap-3" method="get">
        <Input
          name="search"
          placeholder="Buscar por nombre, SKU o slug..."
          defaultValue={params.search}
          className="max-w-xs"
        />
        <select
          name="status"
          defaultValue={params.status ?? "all"}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="draft">Borrador</option>
          <option value="archived">Archivados</option>
        </select>
        <select
          name="type"
          defaultValue={params.type ?? "all"}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">Todos los tipos</option>
          <option value="catalog">Al por mayor</option>
          <option value="store">Tienda</option>
        </select>
        <Button type="submit" variant="secondary">
          Filtrar
        </Button>
      </form>

      <ProductsTable products={products} />

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant={p === page ? "default" : "outline"}
              size="sm"
              asChild
            >
              <Link
                href={{
                  pathname: "/admin/products",
                  query: { ...params, page: String(p) },
                }}
              >
                {p}
              </Link>
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
