-- ==============================================================================
--           ZS MART - COMPLETE SUPABASE CLOUD DATABASE SCHEMA
-- ==============================================================================
-- Run this script in your Supabase SQL Editor (1-Click Run)
-- This creates the products, categories, settings tables and real-time support.
-- ==============================================================================

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  purchase_price NUMERIC,
  category_id TEXT NOT NULL,
  category_name TEXT NOT NULL,
  priority INTEGER,
  filter_name TEXT,
  has_image BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  image_version BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for instant search and category filtering
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

-- 4. Enable Row Level Security (RLS) but allow Public Read & Write for the App & Admin
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to everyone (Customer app & web)
DROP POLICY IF EXISTS "Public can view products" ON public.products;
CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view categories" ON public.categories;
CREATE POLICY "Public can view categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view settings" ON public.store_settings;
CREATE POLICY "Public can view settings" ON public.store_settings FOR SELECT USING (true);

-- Allow Admin / App write access
DROP POLICY IF EXISTS "Allow all modifications on products" ON public.products;
CREATE POLICY "Allow all modifications on products" ON public.products FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all modifications on categories" ON public.categories;
CREATE POLICY "Allow all modifications on categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all modifications on settings" ON public.store_settings;
CREATE POLICY "Allow all modifications on settings" ON public.store_settings FOR ALL USING (true) WITH CHECK (true);

-- 5. Enable Real-time Broadcasting (Instant 0.2s updates on all phones when rate changes)
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.store_settings;

-- 6. Create Storage Bucket for Product Images (if not exists)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read of images
DROP POLICY IF EXISTS "Public read product images" ON storage.objects;
CREATE POLICY "Public read product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

-- Allow image uploads and updates
DROP POLICY IF EXISTS "Allow upload product images" ON storage.objects;
CREATE POLICY "Allow upload product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Allow update product images" ON storage.objects;
CREATE POLICY "Allow update product images" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images');
