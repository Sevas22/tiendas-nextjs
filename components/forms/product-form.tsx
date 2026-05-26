"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import Image from "next/image"
import { FileText, ImagePlus, X } from "lucide-react"
import {
  createProductAction,
  updateProductAction,
} from "@/app/admin/actions/products"
import { productFormSchema, type ProductFormValues } from "@/lib/validators/product"
import { slugify } from "@/lib/utils/slug"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ProductSpecificationsEditor } from "@/components/forms/product-specifications-editor"
import {
  ProductVariantsEditor,
  variantsFromProduct,
} from "@/components/forms/product-variants-editor"
import { ProductTypeToggle } from "@/components/forms/product-type-toggle"
import { PRODUCT_TYPE_OPTIONS, type ProductType } from "@/lib/constants/product-type"
import { recordToSpecRows, specRowsToRecord, type SpecificationRow } from "@/lib/utils/specifications"
import type { VariantDraft } from "@/types/variants"
import type { AdminCategory, AdminProduct } from "@/types/admin"
import type { ActionResult } from "@/types/admin"

function initialVariantDrafts(product?: AdminProduct): VariantDraft[] {
  if (product?.hasVariants && product.variants.length) {
    return variantsFromProduct(product.variants, product.optionGroupName).drafts
  }
  return [
    {
      clientId: crypto.randomUUID(),
      label: "",
      swatchColor: "#00247D",
      price: "",
      stock: "0",
      sku: "",
      status: "active",
    },
  ]
}

interface ProductFormProps {
  product?: AdminProduct
  categories: AdminCategory[]
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [preview, setPreview] = useState<string | null>(product?.image ?? null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [techSheetFile, setTechSheetFile] = useState<File | null>(null)
  const [techSheetLabel, setTechSheetLabel] = useState<string | null>(
    product?.techSheetUrl ? "Ficha técnica actual" : null
  )
  const [keepExistingTechSheet, setKeepExistingTechSheet] = useState(!!product?.techSheetUrl)
  const [specRows, setSpecRows] = useState<SpecificationRow[]>(() =>
    recordToSpecRows(product?.specifications ?? {})
  )
  const [hasVariants, setHasVariants] = useState(product?.hasVariants ?? false)
  const [optionGroupName, setOptionGroupName] = useState(
    product?.optionGroupName ?? "Sabor"
  )
  const [variantDrafts, setVariantDrafts] = useState<VariantDraft[]>(() =>
    initialVariantDrafts(product)
  )
  const isEdit = !!product

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name ?? "",
      slug: product?.slug ?? "",
      description: product?.description ?? "",
      price: product?.price ?? 0,
      stock: product?.stock ?? 0,
      sku: product?.sku ?? "",
      status: product?.status ?? "draft",
      discount: product?.discount ?? 0,
      categoryId: product?.categoryId ?? "",
      category: product?.category ?? "",
      type: product?.type ?? "store",
    },
  })

  const watchName = form.watch("name")

  useEffect(() => {
    if (!isEdit && watchName) {
      form.setValue("slug", slugify(watchName))
    }
  }, [watchName, isEdit, form])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no puede superar 5 MB")
      e.target.value = ""
      return
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Solo se permiten archivos de imagen")
      e.target.value = ""
      return
    }

    setSelectedFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleTechSheetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const isPdf =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
    if (!isPdf) {
      toast.error("La ficha técnica debe ser un archivo PDF")
      e.target.value = ""
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("El PDF no puede superar 10 MB")
      e.target.value = ""
      return
    }

    setTechSheetFile(file)
    setTechSheetLabel(file.name)
    setKeepExistingTechSheet(false)
  }

  const clearTechSheet = () => {
    setTechSheetFile(null)
    setTechSheetLabel(null)
    setKeepExistingTechSheet(false)
    const input = document.getElementById("techSheetFile") as HTMLInputElement
    if (input) input.value = ""
  }

  const clearImage = () => {
    setSelectedFile(null)
    if (!isEdit) {
      setPreview(null)
    } else {
      setPreview(product?.image ?? null)
    }
    const input = document.getElementById("imageFile") as HTMLInputElement
    if (input) input.value = ""
  }

  const onSubmit = (values: ProductFormValues) => {
    if (!isEdit && !selectedFile) {
      toast.error("Sube una imagen del producto")
      return
    }

    const fd = new FormData()
    Object.entries(values).forEach(([key, val]) => {
      fd.append(key, String(val ?? ""))
    })
    fd.append("specifications", JSON.stringify(specRowsToRecord(specRows)))

    if (isEdit && product?.image) {
      fd.append("existingImage", product.image)
    }

    if (selectedFile) {
      fd.append("imageFile", selectedFile)
    }

    if (isEdit && product?.techSheetUrl && keepExistingTechSheet && !techSheetFile) {
      fd.append("existingTechSheetUrl", product.techSheetUrl)
    }

    if (techSheetFile) {
      fd.append("techSheetFile", techSheetFile)
    }

    fd.append("hasVariants", String(hasVariants))
    fd.append("optionGroupName", optionGroupName)
    fd.append(
      "variants",
      JSON.stringify(
        variantDrafts.map(({ imageFile: _f, ...rest }) => rest)
      )
    )
    for (const v of variantDrafts) {
      if (v.imageFile) {
        fd.append(`variantImage_${v.clientId}`, v.imageFile)
      }
    }

    startTransition(async () => {
      let result: ActionResult<{ id: string }> | ActionResult
      if (isEdit) {
        result = await updateProductAction(product.id, { success: false }, fd)
      } else {
        result = await createProductAction({ success: false }, fd)
      }

      if (result.success) {
        toast.success(isEdit ? "Producto actualizado" : "Producto creado")
        router.push("/admin/products")
        router.refresh()
      } else {
        toast.error(result.error ?? "Error al guardar")
      }
    })
  }

  const selectedCategory = categories.find((c) => c.id === form.watch("categoryId"))

  const productType = form.watch("type") as ProductType
  const typeMeta = PRODUCT_TYPE_OPTIONS.find((o) => o.value === productType)

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
      <div className="space-y-3 rounded-lg border border-border bg-card p-4">
        <Label>¿Dónde publicar este producto? *</Label>
        <ProductTypeToggle
          value={productType}
          onChange={(v) => form.setValue("type", v)}
        />
        {typeMeta && (
          <p className="text-sm text-muted-foreground">{typeMeta.description}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="name">Nombre *</Label>
          <Input id="name" {...form.register("name")} />
          {form.formState.errors.name && (
            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input id="slug" {...form.register("slug")} />
          {form.formState.errors.slug && (
            <p className="text-sm text-destructive">{form.formState.errors.slug.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" {...form.register("sku")} />
        </div>

        <div className="space-y-2">
          <Label>Precio (USD) *</Label>
          <Input type="number" step="0.01" {...form.register("price")} />
        </div>

        <div className="space-y-2">
          <Label>Stock *</Label>
          <Input type="number" {...form.register("stock")} />
        </div>

        <div className="space-y-2">
          <Label>Descuento (%)</Label>
          <Input type="number" {...form.register("discount")} />
        </div>

        <div className="space-y-2">
          <Label>Estado</Label>
          <Select
            value={form.watch("status")}
            onValueChange={(v) => form.setValue("status", v as ProductFormValues["status"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Borrador</SelectItem>
              <SelectItem value="active">Activo</SelectItem>
              <SelectItem value="archived">Archivado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label>Categoría</Label>
          <Select
            value={form.watch("categoryId") || "none"}
            onValueChange={(v) => {
              const cat = categories.find((c) => c.id === v)
              form.setValue("categoryId", v === "none" ? "" : v)
              if (cat) form.setValue("category", cat.name)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Sin categoría</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Nombre categoría (visible) *</Label>
          <Input
            {...form.register("category")}
            placeholder={selectedCategory?.name ?? "Categoría"}
          />
          {form.formState.errors.category && (
            <p className="text-sm text-destructive">{form.formState.errors.category.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Descripción *</Label>
        <Textarea rows={4} {...form.register("description")} />
        {form.formState.errors.description && (
          <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
        )}
      </div>

      <ProductSpecificationsEditor rows={specRows} onChange={setSpecRows} />

      <ProductVariantsEditor
        enabled={hasVariants}
        onEnabledChange={setHasVariants}
        optionGroupName={optionGroupName}
        onOptionGroupNameChange={setOptionGroupName}
        variants={variantDrafts}
        onVariantsChange={setVariantDrafts}
      />

      {hasVariants && (
        <p className="text-sm text-muted-foreground">
          El precio y stock del listado se calculan desde las variantes activas. Los campos
          Precio/Stock abajo aplican si desactivas variantes.
        </p>
      )}

      <div className="space-y-4 rounded-lg border border-border p-4">
        <Label>
          Imagen del producto {!isEdit && <span className="text-destructive">*</span>}
        </Label>
        <p className="text-sm text-muted-foreground">
          JPEG, PNG, WebP o GIF. Máximo 5 MB. Se guarda en Supabase Storage.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" variant="secondary" asChild className="cursor-pointer">
            <label htmlFor="imageFile" className="flex cursor-pointer items-center gap-2">
              <ImagePlus className="h-4 w-4" />
              {selectedFile ? "Cambiar imagen" : "Subir imagen"}
            </label>
          </Button>
          <input
            id="imageFile"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={handleFileChange}
          />
          {(selectedFile || preview) && (
            <Button type="button" variant="ghost" size="sm" onClick={clearImage}>
              <X className="mr-1 h-4 w-4" />
              Quitar
            </Button>
          )}
        </div>

        {preview && (
          <div className="relative h-48 w-48 overflow-hidden rounded-lg border bg-muted">
            <Image src={preview} alt="Vista previa" fill className="object-cover" unoptimized />
          </div>
        )}

        {isEdit && !selectedFile && product?.image && (
          <p className="text-xs text-muted-foreground">
            Si no subes otra imagen, se mantiene la actual.
          </p>
        )}
      </div>

      <div className="space-y-4 rounded-lg border border-border p-4">
        <Label>Ficha técnica (PDF, opcional)</Label>
        <p className="text-sm text-muted-foreground">
          Sube el documento PDF con las especificaciones del producto. Máximo 10 MB.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" variant="secondary" asChild className="cursor-pointer">
            <label htmlFor="techSheetFile" className="flex cursor-pointer items-center gap-2">
              <FileText className="h-4 w-4" />
              {techSheetFile ? "Cambiar PDF" : "Subir PDF"}
            </label>
          </Button>
          <input
            id="techSheetFile"
            type="file"
            accept="application/pdf,.pdf"
            className="sr-only"
            onChange={handleTechSheetChange}
          />
          {(techSheetFile || techSheetLabel) && (
            <Button type="button" variant="ghost" size="sm" onClick={clearTechSheet}>
              <X className="mr-1 h-4 w-4" />
              Quitar
            </Button>
          )}
        </div>

        {techSheetLabel && (
          <p className="text-sm text-foreground">
            {techSheetFile ? (
              <>Archivo seleccionado: <span className="font-medium">{techSheetLabel}</span></>
            ) : isEdit && product?.techSheetUrl && keepExistingTechSheet ? (
              <>
                PDF actual:{" "}
                <a
                  href={product.techSheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary underline"
                >
                  Ver ficha técnica
                </a>
              </>
            ) : null}
          </p>
        )}

        {isEdit && product?.techSheetUrl && keepExistingTechSheet && !techSheetFile && (
          <p className="text-xs text-muted-foreground">
            Si no subes otro PDF, se mantiene el documento actual.
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando..." : isEdit ? "Actualizar producto" : "Crear producto"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
