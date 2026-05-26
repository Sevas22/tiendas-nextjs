# Credenciales super admin (temporal)

El panel `/admin` **no usa Supabase Auth** por ahora. Login fijo con cookie.

## Acceso al panel

| Campo | Valor por defecto |
|-------|-------------------|
| **URL** | http://localhost:3000/admin/login |
| **Email** | `admin@venextrading.com` |
| **Contraseña** | `VenexAdmin2025!` |

---

## Supabase: dos claves distintas

Tu `.env.local` debe tener **ambas**:

```env
# Pública — ya la tienes (empieza por sb_publishable_...)
NEXT_PUBLIC_SUPABASE_URL=https://iumphhulhzhxleomgfzx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...

# SECRETA — falta para el admin (empieza por eyJ...)
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

| Clave | Dónde está | Para qué |
|-------|------------|----------|
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | publishable / anon | Sitio público, lecturas |
| `SUPABASE_SERVICE_ROLE_KEY` | **service_role** (secret) | Panel admin: crear/editar productos |

### Cómo copiar service_role

1. Abre: https://supabase.com/dashboard/project/iumphhulhzhxleomgfzx/settings/api  
2. Sección **Project API keys**  
3. Fila **service_role** → botón **Reveal**  
4. Copia todo (es larga, tipo `eyJhbGciOiJIUzI1NiIs...`)  
5. Pégala en `.env.local`:

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.PEGAR_COMPLETA
```

6. **Guarda** y reinicia el servidor:

```powershell
pnpm dev
```

El aviso amarillo del panel desaparecerá cuando la clave esté bien cargada.

---

## Crear tablas en Supabase (si aún no lo hiciste)

```powershell
# Añade también en .env.local:
# SUPABASE_DB_PASSWORD=tu_password_de_database

pnpm run db:setup
```

O ejecuta `supabase/setup-completo.sql` en el SQL Editor.

---

## Personalizar super admin

```env
ADMIN_EMAIL=tu-email@ejemplo.com
ADMIN_PASSWORD=TuClaveSegura123
```

---

## Cerrar sesión

Menú usuario (arriba derecha) → Cerrar sesión.
