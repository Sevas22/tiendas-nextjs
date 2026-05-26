/** Mensajes claros para errores comunes de Supabase Auth */
export function mapAuthError(message: string): string {
  const m = message.toLowerCase()

  if (m.includes("email not confirmed") || m.includes("email_not_confirmed")) {
    return "Debes confirmar tu correo antes de entrar. Revisa tu bandeja (y spam) o desactiva la confirmación en Supabase (ver docs/SUPABASE-PROYECTO.md)."
  }
  if (m.includes("rate limit") || m.includes("email rate limit")) {
    return "Límite de correos alcanzado. Espera unos minutos o crea el usuario desde el panel de Supabase."
  }
  if (m.includes("user already registered") || m.includes("already been registered")) {
    return "Este correo ya está registrado. Inicia sesión o usa otro email."
  }
  if (m.includes("invalid login credentials") || m.includes("invalid credentials")) {
    return "Correo o contraseña incorrectos."
  }
  if (m.includes("password") && m.includes("least")) {
    return "La contraseña no cumple los requisitos mínimos de Supabase."
  }
  if (m.includes("email_address_invalid") || m.includes("invalid email")) {
    return "El correo no es válido. Usa un email real (evita dominios de prueba bloqueados)."
  }
  if (m.includes("signup is disabled")) {
    return "El registro público está desactivado en Supabase. Actívalo en Authentication → Providers → Email."
  }
  if (m.includes("database error") || m.includes("profiles")) {
    return "Error en la base de datos. Ejecuta las migraciones SQL del proyecto en Supabase (ver docs/SUPABASE-PROYECTO.md)."
  }

  return message
}
