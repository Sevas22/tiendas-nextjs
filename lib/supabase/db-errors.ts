/** Errores de Supabase cuando faltan tablas o migraciones SQL */
export function isMissingSchemaError(message: string): boolean {
  const m = message.toLowerCase()
  return (
    m.includes("schema cache") ||
    m.includes("could not find the table") ||
    m.includes("does not exist") ||
    m.includes("relation") && m.includes("does not exist")
  )
}
