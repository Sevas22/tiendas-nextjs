-- Product variants (Shopify-style): parent product + sellable variants

alter table public.products
  add column if not exists has_variants boolean not null default false;

-- =============================================================================
-- OPTION GROUPS & VALUES
-- =============================================================================
create table if not exists public.product_option_groups (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  display_name text,
  position int not null default 0,
  created_at timestamptz default now(),
  unique (product_id, name)
);

create table if not exists public.product_option_values (
  id uuid primary key default gen_random_uuid(),
  option_group_id uuid not null references public.product_option_groups(id) on delete cascade,
  value text not null,
  label text not null,
  swatch_color char(7),
  position int not null default 0,
  metadata jsonb default '{}'::jsonb,
  unique (option_group_id, value)
);

-- =============================================================================
-- VARIANTS (sellable SKU)
-- =============================================================================
create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  title text not null,
  sku text,
  price numeric(12,2),
  stock int not null default 0,
  image_url text,
  swatch_color char(7),
  status text not null default 'active' check (status in ('active', 'inactive')),
  position int not null default 0,
  option_signature text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (product_id, option_signature)
);

create index if not exists idx_product_variants_product on public.product_variants(product_id);
create index if not exists idx_product_variants_product_status on public.product_variants(product_id, status);

create table if not exists public.product_variant_options (
  variant_id uuid not null references public.product_variants(id) on delete cascade,
  option_value_id uuid not null references public.product_option_values(id) on delete restrict,
  primary key (variant_id, option_value_id)
);

alter table public.product_images
  add column if not exists variant_id uuid references public.product_variants(id) on delete cascade;

-- =============================================================================
-- TRIGGERS
-- =============================================================================
drop trigger if exists set_product_variants_updated_at on public.product_variants;
create trigger set_product_variants_updated_at
  before update on public.product_variants
  for each row execute procedure public.set_updated_at();

-- =============================================================================
-- RLS
-- =============================================================================
alter table public.product_option_groups enable row level security;
alter table public.product_option_values enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_variant_options enable row level security;

drop policy if exists "Option groups public read" on public.product_option_groups;
create policy "Option groups public read"
  on public.product_option_groups for select
  using (
    exists (
      select 1 from public.products p
      where p.id = product_id and p.status = 'active' and p.deleted_at is null
    )
  );

drop policy if exists "Option values public read" on public.product_option_values;
create policy "Option values public read"
  on public.product_option_values for select
  using (
    exists (
      select 1 from public.product_option_groups g
      join public.products p on p.id = g.product_id
      where g.id = option_group_id and p.status = 'active' and p.deleted_at is null
    )
  );

drop policy if exists "Variants public read" on public.product_variants;
create policy "Variants public read"
  on public.product_variants for select
  using (
    status = 'active'
    and exists (
      select 1 from public.products p
      where p.id = product_id and p.status = 'active' and p.deleted_at is null
    )
  );

drop policy if exists "Variant options public read" on public.product_variant_options;
create policy "Variant options public read"
  on public.product_variant_options for select using (true);

drop policy if exists "Option groups admin" on public.product_option_groups;
create policy "Option groups admin"
  on public.product_option_groups for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Option values admin" on public.product_option_values;
create policy "Option values admin"
  on public.product_option_values for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Variants admin" on public.product_variants;
create policy "Variants admin"
  on public.product_variants for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Variant options admin" on public.product_variant_options;
create policy "Variant options admin"
  on public.product_variant_options for all using (public.is_admin()) with check (public.is_admin());
