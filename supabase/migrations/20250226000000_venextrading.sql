-- venextrading: perfiles (rol proveedor/admin) y productos
-- Ejecuta este SQL en el SQL Editor de tu proyecto Supabase

-- Perfiles: extiende auth.users con rol
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  role text not null default 'proveedor' check (role in ('proveedor', 'admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Productos: misma estructura que el unique product (catalog/store)
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  price decimal(10,2) not null,
  category text not null,
  description text not null,
  image text not null,
  type text not null check (type in ('catalog', 'store')),
  specifications jsonb default '{}',
  tech_sheet_url text,
  created_at date default current_date,
  updated_at timestamptz default now(),
  user_id uuid references auth.users on delete set null
);

-- Índices
create index if not exists idx_products_type on public.products(type);
create index if not exists idx_products_user_id on public.products(user_id);
create index if not exists idx_products_category on public.products(category);

-- RLS
alter table public.profiles enable row level security;
alter table public.products enable row level security;

-- Perfiles: el usuario ve su propio perfil
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Crear perfil al registrarse (trigger)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'proveedor')
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Productos: todos pueden leer; solo autenticados con rol proveedor/admin pueden insertar/update/delete (sus propios productos si queremos restringir por user_id)
create policy "Products are viewable by everyone"
  on public.products for select
  using (true);

create policy "Proveedores and admins can insert products"
  on public.products for insert
  with check (
    auth.uid() is not null
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('proveedor', 'admin')
    )
  );

create policy "Proveedores and admins can update own products"
  on public.products for update
  using (
    auth.uid() is not null
    and exists (select 1 from public.profiles where id = auth.uid() and role in ('proveedor', 'admin'))
    and (user_id = auth.uid() or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
  );

create policy "Proveedores and admins can delete own products"
  on public.products for delete
  using (
    auth.uid() is not null
    and exists (select 1 from public.profiles where id = auth.uid() and role in ('proveedor', 'admin'))
    and (user_id = auth.uid() or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
  );
