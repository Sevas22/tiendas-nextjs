import { listCategories } from "@/services/products.service"
import { ProductForm } from "@/components/forms/product-form"
import { AdminBreadcrumbs } from "@/components/admin/admin-breadcrumbs"

export default async function NewProductPage() {
  const categories = await listCategories()

  return (
    <div>
      <AdminBreadcrumbs
        items={[
          { label: "Productos", href: "/admin/products" },
          { label: "Nuevo" },
        ]}
      />
      <h2 className="mb-6 text-2xl font-bold">Crear producto</h2>
      <ProductForm categories={categories} />
    </div>
  )
}
