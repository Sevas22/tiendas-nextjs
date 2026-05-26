import { AlertTriangle } from "lucide-react"
import { hasAdminServiceRole } from "@/lib/supabase/admin"

const API_KEYS_URL =
  "https://supabase.com/dashboard/project/iumphhulhzhxleomgfzx/settings/api-keys"

export function ServiceRoleBanner() {
  if (hasAdminServiceRole()) return null

  return (
    <div className="mb-6 flex gap-3 rounded-lg border border-amber-500/50 bg-amber-500/10 p-4 text-sm">
      <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
      <div className="space-y-2">
        <p className="font-medium text-foreground">
          Falta la clave secreta del servidor en <code className="text-xs">.env.local</code>
        </p>
        <p className="text-muted-foreground">
          Tu proyecto usa claves nuevas de Supabase. No busques <code className="text-xs">service_role</code>{" "}
          si no aparece: usa la <strong>Secret key</strong> (<code className="text-xs">sb_secret_...</code>).
        </p>
        <ol className="list-decimal space-y-2 pl-5 text-muted-foreground">
          <li>
            Abre{" "}
            <a
              href={API_KEYS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline"
            >
              Project Settings → API Keys
            </a>{" "}
            (no “Database”)
          </li>
          <li>
            Pestaña <strong>API Keys</strong> → sección <strong>Secret keys</strong>
          </li>
          <li>
            Si no hay ninguna: <strong>Create new API key</strong> → tipo Secret
          </li>
          <li>
            Copia la clave que empieza por <code className="text-xs">sb_secret_</code>
          </li>
          <li>
            Si no ves Secret keys, abre la pestaña{" "}
            <strong>Legacy API Keys</strong> y copia <code className="text-xs">service_role</code>{" "}
            (empieza por <code className="text-xs">eyJ</code>)
          </li>
          <li>
            En <code className="text-xs">.env.local</code>:
            <pre className="mt-1 overflow-x-auto rounded bg-muted p-2 text-xs text-foreground">
{`SUPABASE_SECRET_KEY=sb_secret_...pega_aquí
# o (legacy):
# SUPABASE_SERVICE_ROLE_KEY=eyJ...`}
            </pre>
          </li>
          <li>
            Guarda y reinicia <code className="text-xs">pnpm dev</code>
          </li>
        </ol>
      </div>
    </div>
  )
}
