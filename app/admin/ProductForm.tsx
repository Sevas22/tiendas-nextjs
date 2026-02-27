"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Product } from "@/lib/types"
import { useLanguage } from "@/contexts/language-context"

interface ProductFormProps {
  product: Product | null
  type: "catalog" | "store"
  onSave: (data: Omit<Product, "id" | "createdAt">) => void
  onCancel: () => void
}

export function ProductForm({ product, type, onSave, onCancel }: ProductFormProps) {
  const { t } = useLanguage()
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
  const [techSheetUrl, setTechSheetUrl] = useState("")
  const [specifications, setSpecifications] = useState<Record<string, string>>({})

  useEffect(() => {
    if (product) {
      setName(product.name)
      setPrice(product.price.toString())
      setCategory(product.category)
      setDescription(product.description)
      setImage(product.image)
      setTechSheetUrl(product.techSheetUrl || "")
      setSpecifications(product.specifications || {})
    } else {
      setName("")
      setPrice("")
      setCategory("")
      setDescription("")
      setImage("")
      setTechSheetUrl("")
      setSpecifications({})
    }
  }, [product])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const priceNum = parseFloat(price)
    if (isNaN(priceNum) || priceNum < 0) return
    if (!name.trim() || !category.trim() || !description.trim() || !image.trim()) return

    onSave({
      name: name.trim(),
      price: priceNum,
      category: category.trim(),
      description: description.trim(),
      image: image.trim(),
      type,
      techSheetUrl: type === "catalog" && techSheetUrl.trim() ? techSheetUrl.trim() : undefined,
      specifications: type === "catalog" && Object.keys(specifications).length > 0 ? specifications : undefined,
    })
  }

  const addSpec = () => {
    const key = prompt(t.admin.specKey)
    if (key?.trim()) {
      setSpecifications((prev) => ({ ...prev, [key.trim()]: "" }))
    }
  }

  const updateSpec = (key: string, value: string) => {
    setSpecifications((prev) => {
      const next = { ...prev }
      if (value === "") {
        delete next[key]
      } else {
        next[key] = value
      }
      return next
    })
  }

  const removeSpec = (key: string) => {
    setSpecifications((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="name">{t.admin.productName} *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Premium Jasmine Rice"
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="price">{t.admin.price} *</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="45.00"
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="category">{t.admin.category} *</Label>
          <Input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Grains & Cereals"
            required
            className="mt-1"
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="description">{t.admin.description} *</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Product description..."
            required
            className="mt-1"
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="image">{t.admin.imageUrl} *</Label>
          <Input
            id="image"
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://example.com/image.jpg"
            required
            className="mt-1"
          />
          {image && (
            <div className="mt-2 overflow-hidden rounded-lg border border-border">
              <img src={image} alt="Preview" className="h-32 w-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
            </div>
          )}
        </div>

        {type === "catalog" && (
          <div className="sm:col-span-2">
            <Label htmlFor="techSheetUrl">{t.admin.techSheetUrl}</Label>
            <Input
              id="techSheetUrl"
              type="url"
              value={techSheetUrl}
              onChange={(e) => setTechSheetUrl(e.target.value)}
              placeholder="https://example.com/ficha-tecnica.pdf"
              className="mt-1"
            />
          </div>
        )}

        {type === "catalog" && (
          <div className="sm:col-span-2">
            <div className="mb-2 flex items-center justify-between">
              <Label>{t.admin.specifications}</Label>
              <Button type="button" variant="outline" size="sm" onClick={addSpec}>
                {t.admin.addSpec}
              </Button>
            </div>
            <div className="space-y-2 rounded-lg border border-border p-3">
              {Object.entries(specifications).map(([key, value]) => (
                <div key={key} className="flex gap-2">
                  <Input
                    value={key}
                    disabled
                    className="flex-1 font-medium"
                  />
                  <Input
                    value={value}
                    onChange={(e) => updateSpec(key, e.target.value)}
                    placeholder={t.admin.specValue}
                    className="flex-1"
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeSpec(key)}>
                    ×
                  </Button>
                </div>
              ))}
              {Object.keys(specifications).length === 0 && (
                <p className="text-sm text-muted-foreground">Sin especificaciones. Haz clic en &quot;{t.admin.addSpec}&quot; para agregar.</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="submit">{t.admin.save}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          {t.admin.cancel}
        </Button>
      </div>
    </form>
  )
}
