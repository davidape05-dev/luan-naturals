-- LUÀN Naturals schema
-- Run this in the Supabase SQL editor on a fresh project.

create extension if not exists "pgcrypto";

create table products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  scent_notes text,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  label text not null,        -- e.g. "500ml"
  ml integer not null,
  price numeric(10, 2) not null,
  stock integer not null default 0,
  created_at timestamptz not null default now()
);

create type order_status as enum ('pending', 'paid', 'failed', 'fulfilled', 'cancelled');
create type delivery_zone as enum ('cbd', 'outskirts');
create type order_source as enum ('online', 'manual');

create table orders (
  id uuid primary key default gen_random_uuid(),
  order_code text unique not null,           -- short human-friendly code, e.g. LU-1042
  customer_name text not null,
  customer_phone text not null,
  delivery_zone delivery_zone,
  delivery_fee numeric(10, 2) not null default 0,
  delivery_address text,
  status order_status not null default 'pending',
  source order_source not null default 'online',
  mpesa_receipt text,                        -- filled in once Pay Hero confirms payment
  total numeric(10, 2) not null default 0,
  created_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  product_variant_id uuid not null references product_variants (id),
  product_name text not null,   -- snapshot, in case product is edited later
  variant_label text not null,
  unit_price numeric(10, 2) not null,
  quantity integer not null
);

-- One ledger for both online (automatic) and offline (manual) stock changes.
create table stock_movements (
  id uuid primary key default gen_random_uuid(),
  product_variant_id uuid not null references product_variants (id),
  change integer not null,          -- negative for a sale, positive for a restock
  reason text not null,             -- 'online_order', 'manual_sale', 'restock', 'adjustment'
  order_id uuid references orders (id),
  created_at timestamptz not null default now()
);

create table reviews (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id),
  product_id uuid not null references products (id),
  rating integer not null check (rating between 1 and 5),
  comment text,
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);

-- Row Level Security: public can read active products/variants and approved
-- reviews; everything else is admin-only via the service role / authenticated
-- admin user. Tighten further once the admin app is built.
alter table products enable row level security;
alter table product_variants enable row level security;
alter table reviews enable row level security;

create policy "Public can read active products" on products
  for select using (is_active = true);

create policy "Public can read variants of active products" on product_variants
  for select using (
    exists (
      select 1 from products
      where products.id = product_variants.product_id
      and products.is_active = true
    )
  );

create policy "Public can read approved reviews" on reviews
  for select using (is_approved = true);

-- Admin write access: this is a single-admin business, so any authenticated
-- Supabase user (i.e. you, logged into /admin) can manage everything below.
-- Orders, order_items, stock_movements have RLS disabled by default above
-- (no public read policy was created for them), so only an authenticated
-- session or the service role can touch them at all.

create policy "Authenticated users manage products" on products
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated users manage variants" on product_variants
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated users manage reviews" on reviews
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

alter table orders enable row level security;
alter table order_items enable row level security;
alter table stock_movements enable row level security;

create policy "Authenticated users manage orders" on orders
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated users manage order items" on order_items
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated users manage stock movements" on stock_movements
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- The checkout API route (public, unauthenticated) still needs to create
-- orders/order_items and decrement stock. It should use the Supabase
-- service role key (server-side only, never exposed to the browser) for
-- that insert, which bypasses RLS by design — this is standard practice
-- for public checkout flows.

-- Create an "admin" user for yourself from the Supabase dashboard:
-- Authentication > Users > Add user (email + password). That's the
-- account you'll log into /admin with.

-- Create a public storage bucket named "product-images" from the
-- Supabase dashboard (Storage > New bucket) for product photo uploads.
