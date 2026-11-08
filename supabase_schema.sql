-- ==============================================================================
--           ZS MART - COMPLETE SECURE SUPABASE CLOUD DATABASE SCHEMA
-- ==============================================================================
-- Run this script in your Supabase SQL Editor (SQL Editor -> New Query -> Run)
-- This creates/updates all tables, columns, buckets, and enforces strict RLS.
-- ==============================================================================

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  category_id TEXT NOT NULL,
  category_name TEXT NOT NULL,
  priority INTEGER,
  filter_name TEXT,
  has_image BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  image_version BIGINT,
  retail_price NUMERIC NULL,
  variants JSONB NULL DEFAULT '[]'::jsonb,
  in_stock BOOLEAN NULL DEFAULT true,
  description TEXT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all modern columns exist on existing table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS retail_price NUMERIC NULL;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS variants JSONB NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS in_stock BOOLEAN NULL DEFAULT true;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS description TEXT NULL DEFAULT '';
ALTER TABLE public.products DROP COLUMN IF EXISTS purchase_price;

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_name ON public.products USING gin(to_tsvector('english', name));

-- 2. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  priority INTEGER DEFAULT 999999,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Store Settings Table
CREATE TABLE IF NOT EXISTS public.store_settings (
  id TEXT PRIMARY KEY DEFAULT 'main',
  delivery_fee NUMERIC DEFAULT 99,
  free_delivery_threshold NUMERIC DEFAULT 1999,
  min_order_amount NUMERIC DEFAULT 0,
  delivery_timing TEXT DEFAULT 'Delivery Timing: 10:00 AM – 10:00 PM',
  whatsapp TEXT DEFAULT '923368945775',
  store_name TEXT DEFAULT 'ZS Mart',
  announcement TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Private Purchase Rates Table (Wholesale khareed rates)
CREATE TABLE IF NOT EXISTS public.purchase_rates (
  product_id BIGINT PRIMARY KEY,
  purchase_price NUMERIC NOT NULL DEFAULT 0,
  purchase_rate NUMERIC NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.purchase_rates ADD COLUMN IF NOT EXISTS purchase_rate NUMERIC DEFAULT 0;
ALTER TABLE public.purchase_rates ADD COLUMN IF NOT EXISTS purchase_price NUMERIC DEFAULT 0;
UPDATE public.purchase_rates SET purchase_rate = purchase_price WHERE (purchase_rate IS NULL OR purchase_rate = 0) AND purchase_price > 0;
UPDATE public.purchase_rates SET purchase_price = purchase_rate WHERE (purchase_price IS NULL OR purchase_price = 0) AND purchase_rate > 0;

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_rates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view products" ON public.products;
CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view categories" ON public.categories;
CREATE POLICY "Public can view categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view settings" ON public.store_settings;
CREATE POLICY "Public can view settings" ON public.store_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow all modifications on products" ON public.products;
DROP POLICY IF EXISTS "Admin modify products" ON public.products;
CREATE POLICY "Admin modify products" ON public.products FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Allow all modifications on categories" ON public.categories;
DROP POLICY IF EXISTS "Admin modify categories" ON public.categories;
CREATE POLICY "Admin modify categories" ON public.categories FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Allow all modifications on settings" ON public.store_settings;
DROP POLICY IF EXISTS "Admin modify settings" ON public.store_settings;
CREATE POLICY "Admin modify settings" ON public.store_settings FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admin modify purchase rates" ON public.purchase_rates;
CREATE POLICY "Admin modify purchase rates" ON public.purchase_rates FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- 6. Storage Buckets (Product Images & Parchi Orders)
-- NOTE: parchi-orders is public: true so customer photos & voice notes can be viewed via direct URLs by Admin and customer
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES 
  ('product-images', 'product-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']),
  ('parchi-orders', 'parchi-orders', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/ogg', 'audio/wav', 'application/octet-stream'])
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public read product images" ON storage.objects;
CREATE POLICY "Public read product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Allow upload product images" ON storage.objects;
CREATE POLICY "Allow upload product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'service_role');

DROP POLICY IF EXISTS "Allow update product images" ON storage.objects;
CREATE POLICY "Allow update product images" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images' AND auth.role() = 'service_role');

DROP POLICY IF EXISTS "Public read parchi orders" ON storage.objects;
CREATE POLICY "Public read parchi orders" ON storage.objects FOR SELECT USING (bucket_id = 'parchi-orders');

DROP POLICY IF EXISTS "Allow upload parchi orders" ON storage.objects;
CREATE POLICY "Allow upload parchi orders" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'parchi-orders');

-- 7. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT,
  customer_phone TEXT,
  customer_address TEXT,
  delivery_type TEXT,
  payment_method TEXT,
  subtotal NUMERIC DEFAULT 0,
  delivery_fee NUMERIC DEFAULT 0,
  total NUMERIC DEFAULT 0,
  total_savings NUMERIC DEFAULT 0,
  profit NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'placed',
  items JSONB DEFAULT '[]'::jsonb,
  raw_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON public.orders(customer_phone);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can insert orders" ON public.orders;
CREATE POLICY "Public can insert orders" ON public.orders FOR INSERT WITH CHECK (
  customer_phone IS NOT NULL 
  AND length(customer_phone) >= 7
  AND total >= 0
);

DROP POLICY IF EXISTS "Public can view orders" ON public.orders;
DROP POLICY IF EXISTS "Public can view order status by id" ON public.orders;
DROP POLICY IF EXISTS "Public can update orders" ON public.orders;
DROP POLICY IF EXISTS "Admin modify orders" ON public.orders;
CREATE POLICY "Admin modify orders" ON public.orders FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

INSERT INTO public.store_settings (id, delivery_fee, free_delivery_threshold, whatsapp, store_name, announcement)
VALUES ('order_statuses', 0, 0, '', 'ZS Mart', '{}')
ON CONFLICT (id) DO NOTHING;

-- 8. Enable Real-time Broadcasting
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.store_settings;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

-- 9. Expenses Table (DSR Daily Expenses)
CREATE TABLE IF NOT EXISTS public.expenses (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  title TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  category TEXT DEFAULT 'misc',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_expenses_date ON public.expenses(date DESC);
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin manage expenses" ON public.expenses;
CREATE POLICY "Admin manage expenses" ON public.expenses FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- 10. Purchasing Sections Table
CREATE TABLE IF NOT EXISTS public.purchasing_sections (
  id TEXT PRIMARY KEY DEFAULT 'main',
  sections JSONB DEFAULT '[]'::jsonb,
  item_sections JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.purchasing_sections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin manage purchasing_sections" ON public.purchasing_sections;
CREATE POLICY "Admin manage purchasing_sections" ON public.purchasing_sections FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- 11. Purchasing Sheets Table
CREATE TABLE IF NOT EXISTS public.purchasing_sheets (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  title TEXT,
  market_name TEXT,
  items JSONB DEFAULT '[]'::jsonb,
  sections JSONB DEFAULT '[]'::jsonb,
  total_items INTEGER DEFAULT 0,
  total_qty NUMERIC DEFAULT 0,
  total_amount NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_purchasing_sheets_date ON public.purchasing_sheets(date DESC);
ALTER TABLE public.purchasing_sheets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin manage purchasing_sheets" ON public.purchasing_sheets;
CREATE POLICY "Admin manage purchasing_sheets" ON public.purchasing_sheets FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
