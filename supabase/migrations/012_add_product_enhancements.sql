-- Migration: Add product enhancement fields
-- Description: Adds certificates, seasonality, logistics info, video, FAQs, and view tracking

-- Add new fields to products table
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS certificates_ru JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS certificates_en JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS seasonality JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS logistics_info_ru JSONB DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS logistics_info_en JSONB DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS video_url TEXT,
  ADD COLUMN IF NOT EXISTS faqs_ru JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS faqs_en JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Create product_views table for analytics
CREATE TABLE IF NOT EXISTS product_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_product_views_product_id ON product_views(product_id);
CREATE INDEX IF NOT EXISTS idx_product_views_viewed_at ON product_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_product_views_ip_product ON product_views(ip_address, product_id, viewed_at);
CREATE INDEX IF NOT EXISTS idx_products_view_count ON products(view_count) WHERE view_count > 0;

-- GIN indexes for JSONB fields (for efficient searching)
CREATE INDEX IF NOT EXISTS idx_products_certificates_ru ON products USING GIN (certificates_ru);
CREATE INDEX IF NOT EXISTS idx_products_certificates_en ON products USING GIN (certificates_en);
CREATE INDEX IF NOT EXISTS idx_products_seasonality ON products USING GIN (seasonality);
CREATE INDEX IF NOT EXISTS idx_products_faqs_ru ON products USING GIN (faqs_ru);
CREATE INDEX IF NOT EXISTS idx_products_faqs_en ON products USING GIN (faqs_en);

-- Comments for documentation
COMMENT ON COLUMN products.certificates_ru IS 'Array of certificate objects {name, image_url, id} in Russian';
COMMENT ON COLUMN products.certificates_en IS 'Array of certificate objects {name, image_url, id} in English';
COMMENT ON COLUMN products.seasonality IS 'Array of months (1-12) when product is available';
COMMENT ON COLUMN products.logistics_info_ru IS 'Logistics details (ports, shipping) in Russian';
COMMENT ON COLUMN products.logistics_info_en IS 'Logistics details (ports, shipping) in English';
COMMENT ON COLUMN products.video_url IS 'URL to product presentation video';
COMMENT ON COLUMN products.faqs_ru IS 'Array of FAQ objects {question, answer} in Russian';
COMMENT ON COLUMN products.faqs_en IS 'Array of FAQ objects {question, answer} in English';
COMMENT ON COLUMN products.view_count IS 'Total number of unique product views (updated daily)';
COMMENT ON TABLE product_views IS 'Tracks individual product views for analytics and preventing duplicate counts';

