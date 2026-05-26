import { notFound } from "next/navigation"
import { getAdminProduct, listCategories } from "@/services/products.service"
import { ProductForm } from "@/components/forms/product-form"
import { AdminBreadcrumbs } from "@/components/admin/admin-breadcrumbs"

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [product, categories] = await Promise.all([
    getAdminProduct(id),
    listCategories(),
  ])

  if (!product) notFound()

  return (
    <div>
      <AdminBreadcrumbs
        items={[
          { label: "Productos", href: "/admin/products" },
          { label: product.name },
        ]}
      />
      <h2 className="mb-6 text-2xl font-bold">Editar producto</h2>
      <ProductForm product={product} categories={categories} />
    </div>
  )
}
