export type ProductType = "catalog" | "store"

export const PRODUCT_TYPE_OPTIONS: {
  value: ProductType
  label: string
  description: string
  publicPath: string
}[] = [
  {
    value: "catalog",
    label: "Al por mayor",
    description: "Aparece en la sección Al por mayor (/products). Catálogo B2B.",
    publicPath: "/products",
  },
  {
    value: "store",
    label: "Tienda",
    description: "Aparece en la tienda en línea (/store). Venta con precio visible.",
    publicPath: "/store",
  },
]

export function getProductTypeLabel(type: ProductType): string {
  return PRODUCT_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? type
}
