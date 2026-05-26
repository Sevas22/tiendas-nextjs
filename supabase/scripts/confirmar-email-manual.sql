-- Confirmar email manualmente cuando no llega el correo de Supabase
-- Cambia el email y ejecuta en SQL Editor

update auth.users
set
  email_confirmed_at = now(),
  confirmed_at = coalesce(confirmed_at, now())
where email = 'tu-email@ejemplo.com';

-- Opcional: convertir en administrador del panel
-- update public.profiles set role = 'admin' where email = 'tu-email@ejemplo.com';

select id, email, email_confirmed_at, created_at
from auth.users
where email = 'tu-email@ejemplo.com';
