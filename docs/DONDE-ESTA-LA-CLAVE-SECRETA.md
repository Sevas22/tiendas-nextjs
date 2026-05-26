# Dónde está la clave secreta en Supabase (venextrading)

Tu proyecto usa claves **nuevas**. La publishable ya la tienes (`sb_publishable_...`).

## Opción A — Secret key (recomendada)

1. Menú izquierdo del proyecto → **Project Settings** (engranaje abajo).
2. **API Keys** (no “API” antiguo, no “Database”).
3. Pestaña **API Keys**.
4. Bloque **Secret keys** → copiar o crear con **Create new API key**.

Formato: `sb_secret_XXXXXXXX`

En `.env.local`:

```env
SUPABASE_SECRET_KEY=sb_secret_...tu_clave...
```

## Opción B — Legacy (si no hay sb_secret)

1. Misma página: **Settings → API Keys**.
2. Pestaña **Legacy API Keys**.
3. Fila **service_role** → **Reveal**.
4. Copia (empieza por `eyJ`, es muy larga).

En `.env.local`:

```env
SUPABASE_SERVICE_ROLE_KEY=eyJ...tu_clave...
```

## Enlace directo

https://supabase.com/dashboard/project/iumphhulhzhxleomgfzx/settings/api-keys

## No confundir con

| Lugar | ¿Es la clave? |
|-------|----------------|
| Database → Schema Visualizer | No (solo tablas) |
| `.../rest/v1/` URL | No (es endpoint) |
| Publishable `sb_publishable_` | No (solo cliente, ya la tienes) |
