-- venextrading: sistema administrativo e-commerce
-- Ejecutar en Supabase SQL Editor después de migraciones anteriores

-- =============================================================================
-- ROLES (catálogo de roles)
-- =============================================================================
create table if not exists public.roles (
  id text primary key,
  name text not null,
  description text,
  created_at timestamptz default now()
);

insert into public.roles (id, name, description) values
  ('admin', 'Administrador', 'Acceso completo al panel administrativo'),
  ('customer', 'Cliente', 'Usuario de la tienda'),
  ('proveedor', 'Proveedor', 'Vendedor legacy — gestión de productos propios')
on conflict (id) do nothing;

-- =============================================================================
-- PROFILES — ampliar roles
-- =============================================================================
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  alter column role set default 'customer';

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('admin', 'customer', 'proveedor'));

-- =============================================================================
-- CATEGORIES
-- =============================================================================
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  parent_id uuid references public.categories(id) on delete set null,
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_categories_slug on public.categories(slug);
create index if not exists idx_categories_parent on public.categories(parent_id);

-- =============================================================================
-- PRODUCTS — columnas extendidas
-- =============================================================================
alter table public.products
  add column if not exists slug text,
  add column if not exists stock int not null default 0,
  add column if not exists sku text,
  add column if not exists status text not null default 'active',
  add column if not exists discount decimal(10,2) not null default 0,
  add column if not exists category_id uuid references public.categories(id) on delete set null,
  add column if not exists deleted_at timestamptz;

alter table public.products drop constraint if exists products_status_check;
alter table public.products
  add constraint products_status_check
  check (status in ('draft', 'active', 'archived'));

create unique index if not exists idx_products_slug on public.products(slug) where slug is not null and deleted_at is null;
create index if not exists idx_products_status on public.products(status);
create index if not exists idx_products_deleted on public.products(deleted_at);
create index if not exists idx_products_sku on public.products(sku);

-- Generar slug desde nombre para filas existentes
update public.products
set slug = lower(regexp_replace(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'), '(^-|-$)', '', 'g'))
  || '-' || left(id::text, 8)
where slug is null;

-- =============================================================================
-- PRODUCT IMAGES
-- =============================================================================
create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  storage_path text,
  alt_text text,
  sort_order int default 0,
  is_primary boolean default false,
  created_at timestamptz default now()
);

create index if not exists idx_product_images_product on public.product_images(product_id);

-- =============================================================================
-- STORE SETTINGS (singleton)
-- =============================================================================
create table if not exists public.store_settings (
  id uuid primary key default gen_random_uuid(),
  store_name text not null default 'venextrading',
  logo_url text,
  favicon_url text,
  banner_urls jsonb default '[]'::jsonb,
  social_links jsonb default '{}'::jsonb,
  contact_email text,
  contact_phone text,
  address text,
  payment_methods jsonb default '[]'::jsonb,
  shipping_methods jsonb default '[]'::jsonb,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================================================
-- ORDERS
-- =============================================================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid references auth.users(id) on delete set null,
  customer_email text not null,
  customer_name text,
  customer_phone text,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  subtotal decimal(12,2) not null default 0,
  discount decimal(12,2) not null default 0,
  shipping_cost decimal(12,2) not null default 0,
  total decimal(12,2) not null default 0,
  shipping_address jsonb,
  payment_method text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_orders_user on public.orders(user_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created on public.orders(created_at desc);

-- =============================================================================
-- ORDER ITEMS
-- =============================================================================
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  product_sku text,
  quantity int not null default 1 check (quantity > 0),
  unit_price decimal(12,2) not null,
  discount decimal(12,2) not null default 0,
  total decimal(12,2) not null,
  created_at timestamptz default now()
);

create index if not exists idx_order_items_order on public.order_items(order_id);

-- =============================================================================
-- HELPERS
-- =============================================================================
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Trigger perfiles: rol por defecto customer
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
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- updated_at triggers
drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
  before update on public.products
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_categories_updated_at on public.categories;
create trigger set_categories_updated_at
  before update on public.categories
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_store_settings_updated_at on public.store_settings;
create trigger set_store_settings_updated_at
  before update on public.store_settings
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
  before update on public.orders
  for each row execute procedure public.set_updated_at();

-- =============================================================================
-- RLS
-- =============================================================================
alter table public.roles enable row level security;
alter table public.categories enable row level security;
alter table public.product_images enable row level security;
alter table public.store_settings enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Roles: lectura pública
drop policy if exists "Roles are viewable by everyone" on public.roles;
create policy "Roles are viewable by everyone"
  on public.roles for select using (true);

-- Categories
drop policy if exists "Categories public read" on public.categories;
create policy "Categories public read"
  on public.categories for select using (is_active = true or public.is_admin());

drop policy if exists "Categories admin write" on public.categories;
create policy "Categories admin write"
  on public.categories for all using (public.is_admin()) with check (public.is_admin());

-- Product images
drop policy if exists "Product images public read" on public.product_images;
create policy "Product images public read"
  on public.product_images for select using (
    exists (
      select 1 from public.products p
      where p.id = product_id and p.deleted_at is null
        and (p.status = 'active' or public.is_admin())
    )
  );

drop policy if exists "Product images admin write" on public.product_images;
create policy "Product images admin write"
  on public.product_images for all using (public.is_admin()) with check (public.is_admin());

-- Store settings
drop policy if exists "Store settings public read" on public.store_settings;
create policy "Store settings public read"
  on public.store_settings for select using (true);

drop policy if exists "Store settings admin write" on public.store_settings;
create policy "Store settings admin write"
  on public.store_settings for all using (public.is_admin()) with check (public.is_admin());

-- Orders
drop policy if exists "Users read own orders" on public.orders;
create policy "Users read own orders"
  on public.orders for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Admin manage orders" on public.orders;
create policy "Admin manage orders"
  on public.orders for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Customers create orders" on public.orders;
create policy "Customers create orders"
  on public.orders for insert with check (auth.uid() is not null);

-- Order items
drop policy if exists "Order items via order access" on public.order_items;
create policy "Order items via order access"
  on public.order_items for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists "Admin manage order items" on public.order_items;
create policy "Admin manage order items"
  on public.order_items for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Customers insert order items" on public.order_items;
create policy "Customers insert order items"
  on public.order_items for insert with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

-- Products: actualizar políticas
drop policy if exists "Products are viewable by everyone" on public.products;
create policy "Products public read"
  on public.products for select using (
    deleted_at is null and (status = 'active' or public.is_admin()
      or (auth.uid() is not null and user_id = auth.uid()))
  );

drop policy if exists "Proveedores and admins can insert products" on public.products;
drop policy if exists "Proveedores and admins can update own products" on public.products;
drop policy if exists "Proveedores and admins can delete own products" on public.products;

create policy "Admin full product access"
  on public.products for all using (public.is_admin()) with check (public.is_admin());

create policy "Proveedores manage own products"
  on public.products for insert with check (
    auth.uid() is not null
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'proveedor')
  );

create policy "Proveedores update own products"
  on public.products for update using (
    auth.uid() is not null and user_id = auth.uid()
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'proveedor')
  );

create policy "Proveedores delete own products"
  on public.products for delete using (
    auth.uid() is not null and user_id = auth.uid()
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'proveedor')
  );

-- Profiles: admin puede leer todos
drop policy if exists "Admins can read all profiles" on public.profiles;
create policy "Admins can read all profiles"
  on public.profiles for select using (auth.uid() = id or public.is_admin());

-- =============================================================================
-- STORAGE
-- =============================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'products',
  'products',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
)
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'store-assets',
  'store-assets',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
on conflict (id) do nothing;

drop policy if exists "Public read product images" on storage.objects;
create policy "Public read product images"
  on storage.objects for select
  using (bucket_id in ('products', 'store-assets'));

drop policy if exists "Admin upload product images" on storage.objects;
create policy "Admin upload product images"
  on storage.objects for insert
  with check (bucket_id in ('products', 'store-assets') and public.is_admin());

drop policy if exists "Admin update product images" on storage.objects;
create policy "Admin update product images"
  on storage.objects for update
  using (bucket_id in ('products', 'store-assets') and public.is_admin());

drop policy if exists "Admin delete product images" on storage.objects;
create policy "Admin delete product images"
  on storage.objects for delete
  using (bucket_id in ('products', 'store-assets') and public.is_admin());

-- =============================================================================
-- SEEDS
-- =============================================================================
insert into public.categories (name, slug, description, sort_order) values
  ('Electrónica', 'electronica', 'Dispositivos y componentes electrónicos', 1),
  ('Hogar', 'hogar', 'Productos para el hogar', 2),
  ('Industrial', 'industrial', 'Equipos y suministros industriales', 3)
on conflict (slug) do nothing;

insert into public.store_settings (
  store_name,
  contact_email,
  social_links,
  payment_methods,
  shipping_methods
)
select
  'venextrading',
  'contacto@venextrading.com',
  '{"instagram":"","facebook":"","linkedin":"","whatsapp":""}'::jsonb,
  '["Transferencia","Pago móvil","Zelle"]'::jsonb,
  '["Envío nacional","Retiro en almacén"]'::jsonb
where not exists (select 1 from public.store_settings limit 1);
