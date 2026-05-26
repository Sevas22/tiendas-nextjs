export type VariantStatus = "active" | "inactive"

export interface ProductOptionValue {
  id: string
  value: string
  label: string
  swatchColor: string | null
  position: number
}

export interface ProductOptionGroup {
  id: string
  name: string
  displayName: string | null
  position: number
  values: ProductOptionValue[]
}

export interface ProductVariant {
  id: string
  productId: string
  title: string
  sku: string | null
  price: number | null
  stock: number
  imageUrl: string | null
  swatchColor: string | null
  status: VariantStatus
  position: number
  optionSignature: string
  optionValueIds: string[]
}

/** Borrador en el formulario admin */
export interface VariantDraft {
  clientId: string
  id?: string
  label: string
  swatchColor: string
  price: string
  stock: string
  sku: string
  status: VariantStatus
  imageUrl?: string
  imageFile?: File | null
}

export interface ProductWithVariants {
  hasVariants: boolean
  optionGroups: ProductOptionGroup[]
  variants: ProductVariant[]
  defaultVariantId: string | null
}
