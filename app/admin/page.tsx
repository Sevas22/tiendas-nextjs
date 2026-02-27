"use client"

import { useState, useEffect } from "react"
import { AdminPanel } from "./AdminPanel"

const ADMIN_PASSWORD = "venextrading"

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = typeof window !== "undefined" ? sessionStorage.getItem("admin-auth") : null
    if (stored === "true") setIsLoggedIn(true)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true)
      setError("")
      if (typeof window !== "undefined") sessionStorage.setItem("admin-auth", "true")
    } else {
      setError("Incorrect password")
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setPassword("")
    if (typeof window !== "undefined") sessionStorage.removeItem("admin-auth")
  }

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background pt-24">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 pt-24">
        <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-lg">
          <h1 className="mb-6 text-center text-xl font-bold text-foreground">venextrading Admin</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-foreground">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingrese la contraseña"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                autoFocus
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    )
  }

  return <AdminPanel onLogout={handleLogout} />
}
