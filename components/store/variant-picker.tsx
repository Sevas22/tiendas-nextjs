"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import type { ProductOptionGroup, ProductVariant } from "@/types/variants"

interface VariantPickerProps {
  optionGroups: ProductOptionGroup[]
  variants: ProductVariant[]
  selectedVariantId: string | null
  onSelect: (variantId: string) => void
  basePrice: number
  className?: string
}

export function VariantPicker({
  optionGroups,
  variants,
  selectedVariantId,
  onSelect,
  basePrice,
  className,
}: VariantPickerProps) {
  const group = optionGroups[0]
  if (!group) return null

  const resolveVariant = (valueId: string) =>
    variants.find((v) => v.optionValueIds.includes(valueId))

  return (
    <div className={cn("space-y-3", className)}>
      <p className="text-sm font-semibold uppercase tracking-wider text-gold">
        {group.displayName ?? group.name}
      </p>
      <div className="flex flex-wrap gap-2">
        {group.values.map((opt) => {
          const variant = resolveVariant(opt.id)
          if (!variant) return null
          const active = selectedVariantId === variant.id
          const outOfStock = variant.stock <= 0

          return (
            <button
              key={opt.id}
              type="button"
              disabled={outOfStock}
              onClick={() => onSelect(variant.id)}
              className={cn(
                "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
                active
                  ? "border-[#00247D] bg-[#00247D] text-white shadow-md"
                  : "border-border bg-card hover:border-[#00247D]/50",
                outOfStock && "cursor-not-allowed opacity-40"
              )}
            >
              {opt.swatchColor && (
                <span
                  className="h-5 w-5 shrink-0 rounded-full border border-white/30"
                  style={{ backgroundColor: opt.swatchColor }}
                />
              )}
              {variant.imageUrl && (
                <span className="relative h-6 w-6 overflow-hidden rounded-full">
                  <Image
                    src={variant.imageUrl}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </span>
              )}
              {opt.label}
            </button>
          )
        })}
      </div>
      {selectedVariantId && (
        <p className="text-sm text-muted-foreground">
          {(() => {
            const v = variants.find((x) => x.id === selectedVariantId)
            if (!v) return null
            const price = v.price ?? basePrice
            return (
              <>
                Precio: <span className="font-semibold text-foreground">${price.toFixed(2)}</span>
                {" · "}
                Stock:{" "}
                <span className={v.stock < 5 ? "font-semibold text-amber-600" : ""}>
                  {v.stock > 0 ? `${v.stock} disponibles` : "Agotado"}
                </span>
              </>
            )
          })()}
        </p>
      )}
    </div>
  )
}
