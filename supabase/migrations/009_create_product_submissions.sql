-- Enable pgcrypto extension for gen_random_bytes (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create product_submissions table
CREATE TABLE IF NOT EXISTS product_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Supplier information
  supplier_name TEXT NOT NULL,
  supplier_email TEXT NOT NULL,
  supplier_phone TEXT,
  supplier_company TEXT,
  supplier_location TEXT, -- Region in Uzbekistan
  
  -- Product information
  product_name_ru TEXT NOT NULL,
  product_name_en TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  description_ru TEXT,
  description_en TEXT,
  hs_code TEXT,
  grade_ru TEXT,
  grade_en TEXT,
  origin_place_ru TEXT,
  origin_place_en TEXT,
  calibers JSONB DEFAULT '[]'::jsonb,
  processing_method_ru TEXT,
  processing_method_en TEXT,
  packaging_options JSONB DEFAULT '[]'::jsonb,
  moq TEXT,
  shelf_life TEXT,
  export_readiness TEXT,
  
  -- Documents and images
  images JSONB DEFAULT '[]'::jsonb, -- Array of image URLs
  certificates JSONB DEFAULT '[]'::jsonb, -- Array of certificate file URLs
  
  -- Moderation status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'needs_revision')),
  rejection_reason TEXT,
  reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  
  -- Token for public status checking
  access_token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_submissions_status ON product_submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_created ON product_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_email ON product_submissions(supplier_email);
CREATE INDEX IF NOT EXISTS idx_submissions_category ON product_submissions(category_id);
CREATE INDEX IF NOT EXISTS idx_submissions_token ON product_submissions(access_token);

-- Add comments
COMMENT ON TABLE product_submissions IS 'Product submissions from potential suppliers';
COMMENT ON COLUMN product_submissions.status IS 'Moderation status: pending, approved, rejected, needs_revision';
COMMENT ON COLUMN product_submissions.access_token IS 'Unique token for public status checking';
COMMENT ON COLUMN product_submissions.rejection_reason IS 'Reason for rejection if status is rejected';

