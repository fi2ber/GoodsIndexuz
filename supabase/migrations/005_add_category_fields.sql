-- Add additional fields to categories table
ALTER TABLE categories 
  ADD COLUMN IF NOT EXISTS description_ru TEXT,
  ADD COLUMN IF NOT EXISTS description_en TEXT,
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Add comments for documentation
COMMENT ON COLUMN categories.description_ru IS 'Russian description of the category';
COMMENT ON COLUMN categories.description_en IS 'English description of the category';
COMMENT ON COLUMN categories.image_url IS 'URL of the category image';
COMMENT ON COLUMN categories.sort_order IS 'Order for sorting categories';
COMMENT ON COLUMN categories.is_active IS 'Whether the category is active';
COMMENT ON COLUMN categories.deleted_at IS 'Soft delete timestamp';

-- Create index for soft delete queries
CREATE INDEX IF NOT EXISTS idx_categories_deleted_at ON categories(deleted_at) WHERE deleted_at IS NULL;

