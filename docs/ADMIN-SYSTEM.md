# Sistema administrativo venextrading

## Arquitectura

```
app/
  admin/
    (auth)/login/          → Login admin (público)
    (dashboard)/           → Panel protegido
      page.tsx             → Dashboard + métricas
      products/            → CRUD productos
      settings/            → Configuración tienda
    actions/               → Server Actions (auth, products, settings)
  api/products/            → API pública (solo lectura, productos activos)

components/
  admin/                   → Sidebar, header, tablas, stats
  forms/                   → ProductForm, SettingsForm, AdminLoginForm
  layout/site-chrome.tsx   → Oculta navbar/footer en /admin

lib/
  auth/                    → session, roles
  supabase/                → client, server (cookies), middleware, mappers
  validators/              → Zod schemas

services/                  → Lógica de negocio (products, settings, storage)
types/                     → database.ts, admin.ts

middleware.ts              → Protege rutas /admin (excepto /admin/login)
```

## Base de datos (Supabase)

Ejecutar en orden:

1. `supabase/migrations/20250226000000_venextrading.sql`
2. `supabase/migrations/20250226100000_profiles_company_phone.sql`
3. `supabase/migrations/20250522000000_admin_ecommerce.sql`

### Tablas

| Tabla | Descripción |
|-------|-------------|
| `roles` | Catálogo: admin, customer, proveedor |
| `profiles` | Perfil + rol por usuario |
| `categories` | Categorías con slug |
| `products` | Productos extendidos (slug, stock, SKU, status, soft delete) |
| `product_images` | Galería por producto |
| `store_settings` | Configuración singleton de la tienda |
| `orders` / `order_items` | Pedidos (UI pedidos próximamente) |

### Storage

- `products` — imágenes de productos
- `store-assets` — logo, favicon, banners

### Crear primer administrador

Tras registrar un usuario en Supabase Auth:

```sql
update public.profiles set role = 'admin' where email = 'tu-email@ejemplo.com';
```

## Seguridad

1. **Middleware** — valida JWT y rol `admin` en cada ruta `/admin/*` excepto login.
2. **Server Actions** — `requireAdmin()` antes de mutaciones.
3. **RLS** — función `is_admin()`; políticas separadas para lectura pública y escritura admin.
4. **API pública** — solo productos `status = active` y `deleted_at IS NULL`.

## Variables de entorno

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Rutas

| Ruta | Acceso |
|------|--------|
| `/admin/login` | Público |
| `/admin` | Solo admin |
| `/admin/products` | Solo admin |
| `/admin/products/new` | Solo admin |
| `/admin/products/[id]/edit` | Solo admin |
| `/admin/settings` | Solo admin |

## Desarrollo local

```bash
pnpm install
pnpm dev
```

Abrir `http://localhost:3000/admin/login`.
