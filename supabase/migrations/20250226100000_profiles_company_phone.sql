-- Añadir company y phone a profiles para datos del proveedor
alter table public.profiles
  add column if not exists company text,
  add column if not exists phone text;

-- Actualizar trigger para guardar company y phone desde user_meta_data
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role, company, phone)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'proveedor'),
    new.raw_user_meta_data->>'company',
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$$ language plpgsql security definer;
