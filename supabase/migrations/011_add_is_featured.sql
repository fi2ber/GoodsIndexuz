-- Migration: Add is_featured field to products table
-- Description: Adds a boolean field to mark products as featured/priority for homepage display

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Индекс для быстрого поиска приоритетных товаров
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured) WHERE is_featured = true;

-- Комментарий для документации
COMMENT ON COLUMN products.is_featured IS 'Marks product as featured/priority for featured products section on homepage';

