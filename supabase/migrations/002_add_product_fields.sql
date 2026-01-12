-- Migration: Add new product fields
-- Description: Adds HS code, grade, origin place, calibers, processing method, and description fields

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS hs_code TEXT,
  ADD COLUMN IF NOT EXISTS grade_ru TEXT,
  ADD COLUMN IF NOT EXISTS grade_en TEXT,
  ADD COLUMN IF NOT EXISTS origin_place_ru TEXT,
  ADD COLUMN IF NOT EXISTS origin_place_en TEXT,
  ADD COLUMN IF NOT EXISTS calibers JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS processing_method_ru TEXT,
  ADD COLUMN IF NOT EXISTS processing_method_en TEXT,
  ADD COLUMN IF NOT EXISTS description_ru TEXT,
  ADD COLUMN IF NOT EXISTS description_en TEXT;

-- Индекс для быстрого поиска по ТНВЭД коду
CREATE INDEX IF NOT EXISTS idx_products_hs_code ON products(hs_code) WHERE hs_code IS NOT NULL;

