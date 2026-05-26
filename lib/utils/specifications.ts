export type SpecificationRow = {
  id: string
  label: string
  value: string
}

export function createSpecRow(label = "", value = ""): SpecificationRow {
  return { id: crypto.randomUUID(), label, value }
}

export function recordToSpecRows(specs: Record<string, string>): SpecificationRow[] {
  const entries = Object.entries(specs)
  if (!entries.length) return [createSpecRow()]
  return entries.map(([label, value]) => createSpecRow(label, value))
}

export function specRowsToRecord(rows: SpecificationRow[]): Record<string, string> {
  const out: Record<string, string> = {}
  for (const row of rows) {
    const label = row.label.trim()
    const value = row.value.trim()
    if (label && value) out[label] = value
  }
  return out
}

export function normalizeSpecifications(input: unknown): Record<string, string> {
  if (!input) return {}
  if (Array.isArray(input)) {
    return specRowsToRecord(
      input.map((item) => {
        if (item && typeof item === "object" && "label" in item && "value" in item) {
          return createSpecRow(String(item.label), String(item.value))
        }
        return createSpecRow()
      })
    )
  }
  if (typeof input === "object") {
    const out: Record<string, string> = {}
    for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
      const label = k.trim()
      const value = String(v ?? "").trim()
      if (label && value) out[label] = value
    }
    return out
  }
  return {}
}
