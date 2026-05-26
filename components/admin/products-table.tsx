"use client"

import Link from "next/link"
import Image from "next/image"
import { useTransition } from "react"
import { toast } from "sonner"
import { Pencil, Trash2, MoreHorizontal } from "lucide-react"
import { deleteProductAction } from "@/app/admin/actions/products"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { getProductTypeLabel } from "@/lib/constants/product-type"
import type { AdminProduct } from "@/types/admin"

const statusLabels: Record<string, string> = {
  draft: "Borrador",
  active: "Activo",
  archived: "Archivado",
}

export function ProductsTable({ products }: { products: AdminProduct[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
        <p className="text-muted-foreground">No hay productos que coincidan con los filtros.</p>
        <Button asChild className="mt-4">
          <Link href="/admin/products/new">Crear primer producto</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Img</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Sección</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <ProductRow key={product.id} product={product} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function ProductRow({ product }: { product: AdminProduct }) {
  const [pending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteProductAction(product.id)
      if (result.success) {
        toast.success("Producto eliminado")
      } else {
        toast.error(result.error ?? "Error al eliminar")
      }
    })
  }

  return (
    <TableRow>
      <TableCell>
        <div className="relative h-10 w-10 overflow-hidden rounded">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      </TableCell>
      <TableCell>
        <div>
          <p className="font-medium">{product.name}</p>
          <p className="text-xs text-muted-foreground">
            {product.slug}
            {product.hasVariants && (
              <span className="ml-2 text-primary">
                · Con variantes
                {(product.variants?.length ?? 0) > 0
                  ? ` (${product.variants.length})`
                  : ""}
              </span>
            )}
          </p>
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">{product.sku ?? "—"}</TableCell>
      <TableCell>
        <Badge variant="outline" className="font-normal">
          {getProductTypeLabel(product.type)}
        </Badge>
      </TableCell>
      <TableCell>${Number(product.price).toFixed(2)}</TableCell>
      <TableCell>
        <span className={product.stock < 5 ? "text-amber-600 font-medium" : ""}>
          {product.stock}
        </span>
      </TableCell>
      <TableCell>
        <Badge variant={product.status === "active" ? "default" : "secondary"}>
          {statusLabels[product.status] ?? product.status}
        </Badge>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" disabled={pending}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/products/${product.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Se archivará &quot;{product.name}&quot;. Esta acción no se puede deshacer
                    fácilmente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={handleDelete}
                  >
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}
