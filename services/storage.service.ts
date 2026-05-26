import { createAdminDbClient } from "@/lib/supabase/admin"

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const MAX_PDF_SIZE = 10 * 1024 * 1024

export async function uploadProductImage(
  file: File,
  productId: string
): Promise<{ url: string; path: string } | { error: string }> {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { error: "Formato no permitido. Usa JPEG, PNG, WebP o GIF." }
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return { error: "La imagen no puede superar 5 MB." }
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
  const path = `${productId}/${Date.now()}.${ext}`

  const supabase = createAdminDbClient()
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error } = await supabase.storage.from("products").upload(path, buffer, {
    contentType: file.type,
    upsert: false,
  })

  if (error) return { error: error.message }

  const { data } = supabase.storage.from("products").getPublicUrl(path)
  return { url: data.publicUrl, path }
}

export async function uploadProductTechSheet(
  file: File,
  folderId: string
): Promise<{ url: string; path: string } | { error: string }> {
  const isPdf =
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
  if (!isPdf) {
    return { error: "La ficha técnica debe ser un archivo PDF." }
  }
  if (file.size > MAX_PDF_SIZE) {
    return { error: "El PDF no puede superar 10 MB." }
  }

  const path = `${folderId}/ficha-tecnica-${Date.now()}.pdf`
  const supabase = createAdminDbClient()
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error } = await supabase.storage.from("products").upload(path, buffer, {
    contentType: "application/pdf",
    upsert: false,
  })

  if (error) return { error: error.message }

  const { data } = supabase.storage.from("products").getPublicUrl(path)
  return { url: data.publicUrl, path }
}

export async function uploadStoreAsset(
  file: File,
  folder: "logo" | "favicon" | "banners"
): Promise<{ url: string; path: string } | { error: string }> {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type) && file.type !== "image/svg+xml") {
    return { error: "Formato no permitido." }
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return { error: "El archivo no puede superar 5 MB." }
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "png"
  const path = `${folder}/${Date.now()}.${ext}`
  const supabase = createAdminDbClient()
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error } = await supabase.storage.from("store-assets").upload(path, buffer, {
    contentType: file.type,
    upsert: true,
  })

  if (error) return { error: error.message }

  const { data } = supabase.storage.from("store-assets").getPublicUrl(path)
  return { url: data.publicUrl, path }
}

export async function deleteStorageFile(
  bucket: "products" | "store-assets",
  path: string
): Promise<void> {
  const supabase = createAdminDbClient()
  await supabase.storage.from(bucket).remove([path])
}
