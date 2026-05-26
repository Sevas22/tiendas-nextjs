import { z } from "zod"

export const productFormSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(200),
  slug: z
    .string()
    .min(2)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug inválido (solo minúsculas, números y guiones)"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  price: z.coerce.number().min(0, "El precio no puede ser negativo"),
  stock: z.coerce.number().int().min(0, "El stock no puede ser negativo"),
  sku: z.string().max(64).optional().or(z.literal("")),
  status: z.enum(["draft", "active", "archived"]),
  discount: z.coerce.number().min(0).max(100),
  categoryId: z.string().uuid().optional().or(z.literal("")),
  category: z.string().min(1, "Selecciona o escribe una categoría"),
  type: z.enum(["catalog", "store"]),
})

export type ProductFormValues = z.infer<typeof productFormSchema>

/** Datos del formulario + campos asignados en servidor. */
export type ProductWritePayload = ProductFormValues & {
  techSheetUrl?: string | null
  specifications?: Record<string, string>
  hasVariants?: boolean
  optionGroupName?: string
}

export const productSearchSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  status: z.enum(["draft", "active", "archived", "all"]).default("all"),
  categoryId: z.string().uuid().optional(),
  type: z.enum(["catalog", "store", "all"]).default("all"),
})
