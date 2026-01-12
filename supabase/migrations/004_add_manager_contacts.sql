-- Add contact fields to managers table
ALTER TABLE managers
  ADD COLUMN email TEXT,
  ADD COLUMN phone TEXT,
  ADD COLUMN whatsapp_link TEXT;

-- Add comments for documentation
COMMENT ON COLUMN managers.email IS 'Email address of the manager';
COMMENT ON COLUMN managers.phone IS 'Phone number of the manager';
COMMENT ON COLUMN managers.whatsapp_link IS 'WhatsApp link (e.g., https://wa.me/1234567890)';

