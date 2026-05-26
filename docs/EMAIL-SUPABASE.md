# Los correos de Supabase no llegan

En proyectos nuevos, Supabase envía confirmaciones con un **SMTP compartido** con límites muy bajos (pocos correos por hora). Es normal que **no llegue nada** a la bandeja, ni siquiera en spam.

La cuenta **sí se crea** (como ves el mensaje verde en `/registro`), pero no puedes entrar hasta confirmar el email.

---

## Solución 1 — Desactivar confirmación (recomendado en desarrollo)

1. Abre: https://supabase.com/dashboard/project/iumphhulhzhxleomgfzx/auth/providers
2. **Email** → desactiva **“Confirm email”**
3. Guarda
4. Crea de nuevo el usuario en `/registro` **o** confirma manualmente el que ya existe (solución 2)

Así el registro inicia sesión al instante sin correo.

---

## Solución 2 — Confirmar manualmente el usuario que ya creaste

En **SQL Editor** de Supabase, ejecuta (cambia el email):

```sql
-- Marcar email como confirmado
update auth.users
set
  email_confirmed_at = now(),
  confirmed_at = coalesce(confirmed_at, now())
where email = 'tu-email@ejemplo.com';

-- Si eres admin del panel:
update public.profiles
set role = 'admin'
where email = 'tu-email@ejemplo.com';
```

Luego entra en `/admin/login` con ese email y contraseña.

---

## Solución 3 — Crear usuario desde el panel (sin correo)

1. **Authentication** → **Users** → **Add user**
2. Email + contraseña
3. Activa **Auto Confirm User**
4. SQL para admin:

```sql
update public.profiles set role = 'admin' where email = 'tu-email@ejemplo.com';
```

---

## Solución 4 — SMTP propio (producción)

Para que los correos lleguen de verdad en producción:

1. **Project Settings** → **Authentication** → **SMTP Settings**
2. Configura un proveedor (Resend, SendGrid, Gmail SMTP, etc.)
3. Vuelve a activar plantillas de confirmación si las necesitas

---

## Resumen

| Entorno | Qué hacer |
|---------|-----------|
| Desarrollo local | Desactivar “Confirm email” |
| Usuario ya creado | SQL `email_confirmed_at` (solución 2) |
| Admin rápido | Add user + Auto Confirm + `role = admin` |
| Producción | SMTP propio |
