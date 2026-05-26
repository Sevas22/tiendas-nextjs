-- Corrige creación de perfil al registrar usuario (evita fallos silenciosos en signUp)

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  user_role text;
begin
  user_role := coalesce(new.raw_user_meta_data->>'role', 'customer');
  if user_role not in ('admin', 'customer', 'proveedor') then
    user_role := 'customer';
  end if;

  insert into public.profiles (id, email, full_name, role, company, phone)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    user_role,
    new.raw_user_meta_data->>'company',
    new.raw_user_meta_data->>'phone'
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, profiles.full_name),
    company = coalesce(excluded.company, profiles.company),
    phone = coalesce(excluded.phone, profiles.phone),
    updated_at = now();

  return new;
exception
  when others then
    raise log 'handle_new_user error for %: %', new.id, sqlerrm;
    return new;
end;
$$;

-- Permitir que el trigger inserte perfiles (por si RLS bloquea en algunos entornos)
drop policy if exists "Service role can insert profiles" on public.profiles;
-- El trigger usa security definer; no hace falta policy extra para signup
