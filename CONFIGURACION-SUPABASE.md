# Cómo configurar Supabase para venextrading

Así puedes activar el registro de proveedores, el login por OTP y el marketplace con productos en la base de datos.

---

## 1. Crear un proyecto en Supabase

1. Entra en **[supabase.com](https://supabase.com)** e inicia sesión.
2. Pulsa **"New project"**.
3. Elige organización, nombre del proyecto (ej. `venextrading`) y contraseña de la base de datos (guárdala).
4. Elige región y dale a **"Create new project"**. Espera a que termine de crearse.

---

## 2. Obtener URL y clave anónima (API Keys)

1. En el panel del proyecto, ve a **Settings** (engranaje) → **API**.
2. Ahí verás:
   - **Project URL** (ej. `https://xxxxx.supabase.co`)
   - **Project API keys** → **anon public** (una clave larga que empieza por `eyJ...`)

Cópialas; las usarás en el siguiente paso.

---

## 3. Variables de entorno en tu proyecto

1. En la raíz del proyecto (donde está `package.json`), crea el archivo **`.env.local`** si no existe.
2. Añade estas dos variables con tus valores reales:

```env
NEXT_PUBLIC_SUPABASE_URL=https://TU-PROJECT-ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Sustituye:
- `TU-PROJECT-ID` por el ID de tu proyecto (o la URL completa que te muestra Supabase).
- La clave larga por tu **anon public** key.

3. Reinicia el servidor de desarrollo (`pnpm dev` o `npm run dev`) para que cargue las variables.

---

## 4. Ejecutar el SQL en Supabase (tablas y permisos)

1. En Supabase, abre **SQL Editor**.
2. Crea una nueva query y pega **todo** el contenido del archivo:
   - `supabase/migrations/20250226000000_venextrading.sql`
3. Pulsa **Run**.
4. Luego haz lo mismo con el segundo archivo:
   - `supabase/migrations/20250226100000_profiles_company_phone.sql`
5. Ejecuta de nuevo con **Run**.

Con eso quedan creadas las tablas `profiles` y `products`, las políticas RLS y el trigger que crea el perfil al registrarse (con nombre, email, empresa y teléfono).

---

## 5. Evitar "Email rate limit exceeded" (recomendado para desarrollo)

Supabase limita cuántos correos envía por hora (p. ej. 3 con el SMTP por defecto). Si al **registrarte** o al **enviar código OTP** ves *"email rate limit exceeded"*:

**Desactivar la confirmación por email** (así el registro **no** envía correo y no consume el límite):

1. En Supabase: **Authentication** → **Providers** → **Email**.
2. Desactiva **"Confirm email"** (o "Enable email confirmations").
3. Guarda.

Con eso, al crear cuenta con **email + contraseña** el usuario queda registrado y puede entrar sin tener que abrir un enlace del correo. No se envía ningún email en el registro y no se gasta el rate limit.

Si más adelante quieres volver a pedir confirmación por email, activa de nuevo la opción.

---

## 6. Enviar el código OTP de 6 dígitos por correo (opcional)

Por defecto Supabase envía un correo de "Confirm your signup" con un **enlace** para confirmar. Nuestra app pide un **código de 6 dígitos** para iniciar sesión, así que hay que cambiar la plantilla para que el correo muestre ese número.

1. En Supabase ve a **Authentication** (menú izquierdo) → **Email Templates**.
2. El correo que recibiste dice "Confirm your signup", así que edita la plantilla **"Confirm signup"**. Si más adelante usas solo "Entrar con código", edita también **"Magic Link"**. En ambas incluye `{{ .Token }}` en el cuerpo.
3. En **Subject** puedes dejarlo o poner por ejemplo: `Tu código de acceso - venextrading`
4. En **Body** (cuerpo del mensaje) **sustituye o añade** el texto para que se vea el código. Debe incluir la variable **`{{ .Token }}`**, que es el código de 6 dígitos. Ejemplo:

```html
<h2>Confirmar registro</h2>
<p>Tu código de acceso a venextrading es:</p>
<p style="font-size:24px; font-weight:bold; letter-spacing:4px;">{{ .Token }}</p>
<p>Introduce este código en la página para iniciar sesión. El código caduca en 1 hora.</p>
<p>Si no has solicitado este correo, puedes ignorarlo.</p>
```

5. Pulsa **Save**.

A partir de ahí, cuando alguien se registre o pida "Enviar código", recibirá un email con el **número de 6 dígitos** y podrá escribirlo en la app para loguearse.

---

## 7. Probar que todo funciona

1. En la web, ve a **Crear cuenta** (o `/registro`).
2. Rellena nombre, email y (opcional) teléfono y empresa.
3. Pulsa **Enviar código**.
4. Revisa el correo (y la carpeta de spam) y usa el código o el enlace que te envíe Supabase.
5. Tras verificar, deberías entrar al panel de proveedor en `/admin` y poder subir productos.

---

## Resumen rápido

| Paso | Dónde | Qué hacer |
|------|--------|-----------|
| 1 | supabase.com | Crear proyecto |
| 2 | Settings → API | Copiar Project URL y anon key |
| 3 | `.env.local` | Poner `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| 4 | SQL Editor | Ejecutar los 2 archivos en `supabase/migrations/` |
| 5 | Auth → Providers → Email | Desactivar "Confirm email" para evitar rate limit en registro |
| 6 | Auth → Email Templates | (Opcional) Añadir `{{ .Token }}` para código OTP de 6 dígitos |

Si algo no funciona, revisa que las variables de entorno estén bien escritas (sin espacios), que hayas ejecutado ambos SQL y que hayas reiniciado el servidor después de crear o cambiar `.env.local`.
