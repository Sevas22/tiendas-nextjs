/**
 * Ejecuta supabase/setup-completo.sql en tu proyecto remoto.
 *
 * Añade en .env.local (contraseña de Settings → Database):
 *   SUPABASE_DB_PASSWORD=tu_contraseña
 * o:
 *   DATABASE_URL=postgresql://postgres:...@db.iumphhulhzhxleomgfzx.supabase.co:5432/postgres
 *
 * Luego: pnpm run db:setup
 */

import { readFileSync, existsSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import pg from "pg"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")

function loadEnvLocal() {
  const path = join(root, ".env.local")
  if (!existsSync(path)) return {}
  const env = {}
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim()
    if (!t || t.startsWith("#")) continue
    const i = t.indexOf("=")
    if (i === -1) continue
    env[t.slice(0, i).trim()] = t.slice(i + 1).trim()
  }
  return env
}

function getConnectionString(env) {
  if (env.DATABASE_URL) return env.DATABASE_URL
  const password = env.SUPABASE_DB_PASSWORD
  if (!password) return null
  const host = "db.iumphhulhzhxleomgfzx.supabase.co"
  return `postgresql://postgres:${encodeURIComponent(password)}@${host}:5432/postgres`
}

async function main() {
  const env = { ...process.env, ...loadEnvLocal() }
  const connectionString = getConnectionString(env)

  if (!connectionString) {
    console.error(`
❌ Falta la contraseña de la base de datos.

1. Supabase → Settings → Database → Database password
2. En .env.local añade:

   SUPABASE_DB_PASSWORD=tu_contraseña_aquí

3. Ejecuta de nuevo: pnpm run db:setup
`)
    process.exit(1)
  }

  const sqlPath = join(root, "supabase", "setup-completo.sql")
  const sql = readFileSync(sqlPath, "utf8")

  console.log("🔗 Conectando a Supabase PostgreSQL...")
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  })

  try {
    await client.connect()
    console.log("📦 Ejecutando setup-completo.sql (puede tardar ~30s)...")
    await client.query(sql)
    console.log("✅ Base de datos creada correctamente.")
    console.log("   Tablas: profiles, products, categories, store_settings, orders, ...")
    console.log("\n👉 Recarga http://localhost:3000/admin/products")
  } catch (err) {
    console.error("❌ Error:", err.message)
    if (err.message.includes("password authentication")) {
      console.error("   Revisa SUPABASE_DB_PASSWORD en .env.local")
    }
    process.exit(1)
  } finally {
    await client.end()
  }
}

main()
