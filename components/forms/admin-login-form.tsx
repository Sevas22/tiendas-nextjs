"use client"

import { useActionState } from "react"
import { adminLoginAction } from "@/app/admin/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ActionResult } from "@/types/admin"

const initialState: ActionResult = { success: false }

export function AdminLoginForm({ redirectTo }: { redirectTo?: string }) {
  const [state, formAction, pending] = useActionState(adminLoginAction, initialState)

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">venextrading Admin</CardTitle>
        <CardDescription>Acceso super administrador (modo desarrollo)</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {redirectTo && (
            <input type="hidden" name="redirect" value={redirectTo} />
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              defaultValue="admin@venextrading.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </div>
          {state.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Entrando..." : "Iniciar sesión"}
          </Button>
        </form>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Auth con Supabase se configurará más adelante.
        </p>
      </CardContent>
    </Card>
  )
}
