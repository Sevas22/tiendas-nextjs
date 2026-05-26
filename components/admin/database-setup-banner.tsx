import { AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DatabaseSetupBanner() {
  return (
    <Card className="mb-6 border-amber-500/50 bg-amber-500/5">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          Base de datos sin configurar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p>
          La tabla <code className="text-foreground">products</code> (y otras) no existen en tu
          proyecto Supabase. Debes ejecutar el SQL de migraciones una vez.
        </p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Abre{" "}
            <a
              href="https://supabase.com/dashboard/project/iumphhulhzhxleomgfzx/sql/new"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline"
            >
              Supabase → SQL Editor
            </a>
          </li>
          <li>
            Copia y ejecuta todo el archivo{" "}
            <code className="rounded bg-muted px-1 text-xs text-foreground">
              supabase/setup-completo.sql
            </code>{" "}
            (botón Run)
          </li>
          <li>Recarga esta página</li>
        </ol>
        <p className="text-xs">
          Proyecto: <code>iumphhulhzhxleomgfzx</code>
        </p>
      </CardContent>
    </Card>
  )
}
