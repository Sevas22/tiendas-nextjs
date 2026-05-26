export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function uniqueSlug(base: string, suffix?: string): string {
  const slug = slugify(base)
  return suffix ? `${slug}-${suffix}` : slug
}
