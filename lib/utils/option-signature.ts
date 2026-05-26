import { slugify } from "@/lib/utils/slug"

export function buildOptionSignature(
  pairs: { group: string; value: string }[]
): string {
  return pairs
    .map((p) => ({
      group: slugify(p.group) || "opcion",
      value: slugify(p.value) || "valor",
    }))
    .sort((a, b) => a.group.localeCompare(b.group))
    .map((p) => `${p.group}:${p.value}`)
    .join("|")
}
