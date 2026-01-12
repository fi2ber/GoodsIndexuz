-- Update product_submissions table: make phone required, email optional

-- First, update existing records: set phone to a default value if null
-- (We'll use a placeholder that will need to be updated manually)
UPDATE product_submissions 
SET supplier_phone = '+998000000000' 
WHERE supplier_phone IS NULL;

-- Make supplier_phone NOT NULL
ALTER TABLE product_submissions 
  ALTER COLUMN supplier_phone SET NOT NULL;

-- Make supplier_email optional (drop NOT NULL constraint)
ALTER TABLE product_submissions 
  ALTER COLUMN supplier_email DROP NOT NULL;

-- Add index for phone number searches
CREATE INDEX IF NOT EXISTS idx_submissions_phone 
  ON product_submissions(supplier_phone);

-- Add comment
COMMENT ON COLUMN product_submissions.supplier_phone IS 'Phone number in format +998XXXXXXXXX (required)';
COMMENT ON COLUMN product_submissions.supplier_email IS 'Email address (optional)';

