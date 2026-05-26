"use client"

import { cn } from "@/lib/utils"
import {
  PRODUCT_TYPE_OPTIONS,
  type ProductType,
} from "@/lib/constants/product-type"

interface ProductTypeToggleProps {
  value: ProductType
  onChange: (value: ProductType) => void
  className?: string
}

export function ProductTypeToggle({ value, onChange, className }: ProductTypeToggleProps) {
  return (
    <div className={cn("inline-flex items-center gap-1 rounded-full", className)}>
      {PRODUCT_TYPE_OPTIONS.map((option) => {
        const active = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-full px-5 py-2.5 text-sm font-semibold transition-all",
              active
                ? "bg-[#00247D] text-white shadow-md"
                : "bg-transparent text-foreground hover:bg-muted/80"
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
