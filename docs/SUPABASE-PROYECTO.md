# Supabase — venextrading (proyecto organizado)

## Identificación del proyecto

| Campo | Valor |
|-------|--------|
| **Project ref** | `iumphhulhzhxleomgfzx` |
| **Dashboard** | https://supabase.com/dashboard/project/iumphhulhzhxleomgfzx |
| **API URL** | `https://iumphhulhzhxleomgfzx.supabase.co` |

---

## Variables para Next.js (`.env.local`)

Copia esto en la raíz del repo como `.env.local` (no se sube a Git):

```env
# URL del proyecto
NEXT_PUBLIC_SUPABASE_URL=https://iumphhulhzhxleomgfzx.supabase.co

# Clave pública (publishable) — uso en navegador y Server Actions
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_AKDHxCWtu47LIAqtaaNQ8g_2MyCZzjB
```

Opcional (solo servidor, **nunca** expongas en el cliente):

```env
# Settings → API → service_role (secret)
SUPABASE_SERVICE_ROLE_KEY=eyJ...tu-service-role...
```

---

## Base de datos PostgreSQL (conexión directa)

Para DBeaver, pgAdmin, migraciones CLI o scripts:

```
Host:     db.iumphhulhzhxleomgfzx.supabase.co
Puerto:   5432
Base:     postgres
Usuario:  postgres
Contraseña: la que definiste al crear el proyecto (Dashboard → Settings → Database)
```

**Connection string:**

```
postgresql://postgres:[YOUR-PASSWORD]@db.iumphhulhzhxleomgfzx.supabase.co:5432/postgres
```

Sustituye `[YOUR-PASSWORD]` por la contraseña real de la base de datos.

---

## Supabase CLI (enlace local ↔ remoto)

Ejecuta en la carpeta del proyecto (`tiendas`):

```bash
# 1. Iniciar sesión en Supabase (abre el navegador)
supabase login

# 2. Crear carpeta de config si no existe (ya hay migrations/)
supabase init

# 3. Vincular este repo con tu proyecto en la nube
supabase link --project-ref iumphhulhzhxleomgfzx
```

Te pedirá la **contraseña de la base de datos** del proyecto al hacer `link`.

### Aplicar migraciones al remoto

```bash
supabase db push
```

O manualmente en **SQL Editor** del dashboard:

**Opción rápida (recomendada):** ejecuta todo `supabase/setup-completo.sql` de una vez.

O por partes:

1. `supabase/migrations/20250226000000_venextrading.sql`
2. `supabase/migrations/20250226100000_profiles_company_phone.sql`
3. `supabase/migrations/20250522000000_admin_ecommerce.sql`
4. `supabase/migrations/20250522100000_fix_auth_profile_trigger.sql`

---

## Los correos no llegan

Ver guía detallada: **[docs/EMAIL-SUPABASE.md](EMAIL-SUPABASE.md)**

Resumen: desactiva **Confirm email** en Authentication → Providers → Email, o confirma el usuario con SQL (`supabase/scripts/confirmar-email-manual.sql`).

---

## No puedo crear usuario / no puedo entrar

### Causa más común: confirmación de email activada

Tu proyecto **exige confirmar el correo** antes de iniciar sesión. El usuario se crea, pero al entrar aparece error o “credenciales incorrectas”.

**Solución recomendada (desarrollo):**

1. Supabase Dashboard → **Authentication** → **Providers** → **Email**
2. Desactiva **“Confirm email”** / **“Enable email confirmations”**
3. Guarda y vuelve a crear el usuario o pide **reenviar confirmación**

**Alternativa:** al crear usuario en **Authentication → Users → Add user**, marca **“Auto Confirm User”**.

### Crear admin desde el panel de Supabase (sin la web)

1. **Authentication → Users → Add user**
   - Email y contraseña
   - Activar **Auto Confirm User**
2. **SQL Editor**:

```sql
update public.profiles set role = 'admin' where email = 'tu-email@ejemplo.com';
```

3. Entrar en `/admin/login` con ese email y contraseña.

### Si falla el registro en `/registro`

- Ejecuta las 3 migraciones SQL (o `supabase db push`).
- Ejecuta también `20250522100000_fix_auth_profile_trigger.sql`.
- Usa un email real (Gmail, Outlook, etc.); algunos dominios de prueba están bloqueados.

---

## Crear usuario administrador

1. **Authentication → Users → Add user** (email + contraseña + **Auto Confirm User**).
2. En **SQL Editor**:

```sql
update public.profiles
set role = 'admin'
where email = 'tu-email@ejemplo.com';
```

3. Entrar en: http://localhost:3000/admin/login

---

## Dónde encontrar cada clave en el dashboard

| Necesitas | Ubicación |
|-----------|-----------|
| Project URL | Settings → API → Project URL |
| Publishable / anon | Settings → API → Publishable key |
| Service role | Settings → API → `service_role` (secreto) |
| DB password | Settings → Database → Database password |
| JWT Secret | Settings → API → JWT Secret |

---

## Reiniciar la app tras cambiar `.env.local`

```bash
pnpm dev
```
