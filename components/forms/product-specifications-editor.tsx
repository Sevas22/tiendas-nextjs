"use client"

import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  createSpecRow,
  type SpecificationRow,
} from "@/lib/utils/specifications"

interface ProductSpecificationsEditorProps {
  rows: SpecificationRow[]
  onChange: (rows: SpecificationRow[]) => void
}

export function ProductSpecificationsEditor({
  rows,
  onChange,
}: ProductSpecificationsEditorProps) {
  const updateRow = (id: string, field: "label" | "value", text: string) => {
    onChange(rows.map((r) => (r.id === id ? { ...r, [field]: text } : r)))
  }

  const removeRow = (id: string) => {
    const next = rows.filter((r) => r.id !== id)
    onChange(next.length ? next : [createSpecRow()])
  }

  const addRow = () => {
    onChange([...rows, createSpecRow()])
  }

  return (
    <div className="space-y-4 rounded-lg border border-border p-4">
      <div>
        <Label>Especificaciones técnicas</Label>
        <p className="mt-1 text-sm text-muted-foreground">
          Añade las características que necesites (origen, peso, ingredientes, etc.). Cada producto
          puede tener las suyas.
        </p>
      </div>

      <div className="space-y-3">
        {rows.map((row, index) => (
          <div
            key={row.id}
            className="grid gap-2 rounded-md border border-border/60 bg-muted/30 p-3 sm:grid-cols-[1fr_1fr_auto]"
          >
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                Característica {index + 1}
              </Label>
              <Input
                value={row.label}
                onChange={(e) => updateRow(row.id, "label", e.target.value)}
                placeholder="Ej. Origen, Peso neto, Ingredientes"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Valor</Label>
              <Input
                value={row.value}
                onChange={(e) => updateRow(row.id, "value", e.target.value)}
                placeholder="Ej. China, 340g, Maíz dulce..."
              />
            </div>
            <div className="flex items-end justify-end sm:justify-center">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => removeRow(row.id)}
                aria-label="Eliminar característica"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button type="button" variant="outline" size="sm" onClick={addRow}>
        <Plus className="mr-2 h-4 w-4" />
        Añadir característica
      </Button>
    </div>
  )
}
