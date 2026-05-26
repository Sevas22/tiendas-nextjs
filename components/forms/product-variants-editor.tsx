"use client"

import Image from "next/image"
import { Plus, Trash2, ImagePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { VariantDraft, VariantStatus } from "@/types/variants"

function createVariantDraft(partial?: Partial<VariantDraft>): VariantDraft {
  return {
    clientId: crypto.randomUUID(),
    label: "",
    swatchColor: "#00247D",
    price: "",
    stock: "0",
    sku: "",
    status: "active",
    ...partial,
  }
}

interface ProductVariantsEditorProps {
  enabled: boolean
  onEnabledChange: (enabled: boolean) => void
  optionGroupName: string
  onOptionGroupNameChange: (name: string) => void
  variants: VariantDraft[]
  onVariantsChange: (variants: VariantDraft[]) => void
}

export function ProductVariantsEditor({
  enabled,
  onEnabledChange,
  optionGroupName,
  onOptionGroupNameChange,
  variants,
  onVariantsChange,
}: ProductVariantsEditorProps) {
  const updateVariant = (clientId: string, patch: Partial<VariantDraft>) => {
    onVariantsChange(variants.map((v) => (v.clientId === clientId ? { ...v, ...patch } : v)))
  }

  const addVariant = () => {
    onVariantsChange([...variants, createVariantDraft()])
  }

  const removeVariant = (clientId: string) => {
    const next = variants.filter((v) => v.clientId !== clientId)
    onVariantsChange(next.length ? next : [createVariantDraft()])
  }

  const handleVariantImage = (clientId: string, file: File | null) => {
    if (!file) return
    updateVariant(clientId, { imageFile: file })
  }

  return (
    <div className="space-y-4 rounded-lg border border-border p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Label htmlFor="hasVariants">Este producto tiene variantes</Label>
          <p className="text-sm text-muted-foreground">
            Ej. sabores, colores o presentaciones. Cada variante con su precio, stock e imagen.
          </p>
        </div>
        <Switch id="hasVariants" checked={enabled} onCheckedChange={onEnabledChange} />
      </div>

      {enabled && (
        <>
          <div className="space-y-2">
            <Label>Nombre de la opción</Label>
            <Input
              value={optionGroupName}
              onChange={(e) => onOptionGroupNameChange(e.target.value)}
              placeholder="Ej. Sabor, Talla, Color"
            />
          </div>

          <div className="space-y-3">
            {variants.map((variant, index) => (
              <div
                key={variant.clientId}
                className="space-y-3 rounded-md border border-border/70 bg-muted/20 p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Variante {index + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeVariant(variant.clientId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-xs">Nombre *</Label>
                    <Input
                      value={variant.label}
                      onChange={(e) => updateVariant(variant.clientId, { label: e.target.value })}
                      placeholder="Chocolate, Vainilla..."
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Color</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={variant.swatchColor}
                        onChange={(e) =>
                          updateVariant(variant.clientId, { swatchColor: e.target.value })
                        }
                        className="h-9 w-12 cursor-pointer rounded border"
                      />
                      <Input
                        value={variant.swatchColor}
                        onChange={(e) =>
                          updateVariant(variant.clientId, { swatchColor: e.target.value })
                        }
                        className="font-mono text-xs"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Precio (opcional)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={variant.price}
                      onChange={(e) => updateVariant(variant.clientId, { price: e.target.value })}
                      placeholder="Hereda del producto"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Stock</Label>
                    <Input
                      type="number"
                      value={variant.stock}
                      onChange={(e) => updateVariant(variant.clientId, { stock: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">SKU</Label>
                    <Input
                      value={variant.sku}
                      onChange={(e) => updateVariant(variant.clientId, { sku: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Estado</Label>
                    <Select
                      value={variant.status}
                      onValueChange={(v) =>
                        updateVariant(variant.clientId, { status: v as VariantStatus })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Activo</SelectItem>
                        <SelectItem value="inactive">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button type="button" variant="secondary" size="sm" asChild>
                    <label className="cursor-pointer">
                      <ImagePlus className="mr-2 inline h-4 w-4" />
                      Imagen
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => {
                          const f = e.target.files?.[0]
                          if (f) handleVariantImage(variant.clientId, f)
                          e.target.value = ""
                        }}
                      />
                    </label>
                  </Button>
                  {(variant.imageFile || variant.imageUrl) && (
                    <div className="relative h-14 w-14 overflow-hidden rounded border">
                      <Image
                        src={
                          variant.imageFile
                            ? URL.createObjectURL(variant.imageFile)
                            : variant.imageUrl!
                        }
                        alt=""
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Button type="button" variant="outline" size="sm" onClick={addVariant}>
            <Plus className="mr-2 h-4 w-4" />
            Añadir variante
          </Button>
        </>
      )}
    </div>
  )
}

export function variantsFromProduct(
  variants: import("@/types/variants").ProductVariant[],
  optionGroupName: string | null
): { optionGroupName: string; drafts: VariantDraft[] } {
  return {
    optionGroupName: optionGroupName ?? "Opción",
    drafts: variants.length
      ? variants.map((v) =>
          createVariantDraft({
            id: v.id,
            label: v.title,
            swatchColor: v.swatchColor ?? "#00247D",
            price: v.price != null ? String(v.price) : "",
            stock: String(v.stock),
            sku: v.sku ?? "",
            status: v.status,
            imageUrl: v.imageUrl ?? undefined,
          })
        )
      : [createVariantDraft()],
  }
}
