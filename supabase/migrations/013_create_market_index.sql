-- Migration: Create market index tables
-- Description: Adds product_market_quotes for FOB price history and fx_rates_daily for currency conversion

-- Table for product market quotes (FOB USD/kg)
CREATE TABLE IF NOT EXISTS product_market_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quote_date DATE NOT NULL,
  incoterm TEXT NOT NULL DEFAULT 'FOB',
  unit TEXT NOT NULL DEFAULT 'USD_PER_KG',
  price_mid_usd NUMERIC(12,5) NOT NULL,
  tolerance_usd NUMERIC(12,5) NOT NULL DEFAULT 0.00500,
  notes TEXT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one quote per product per date per incoterm/unit combination
  CONSTRAINT unique_product_quote_date UNIQUE (product_id, quote_date, incoterm, unit)
);

-- Table for daily FX rates (USD to UZS)
CREATE TABLE IF NOT EXISTS fx_rates_daily (
  rate_date DATE PRIMARY KEY,
  usd_uzs NUMERIC(18,6) NOT NULL,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_market_quotes_product_date ON product_market_quotes(product_id, quote_date DESC);
CREATE INDEX IF NOT EXISTS idx_market_quotes_date ON product_market_quotes(quote_date DESC);
CREATE INDEX IF NOT EXISTS idx_fx_rates_date ON fx_rates_daily(rate_date DESC);

-- Enable Row Level Security
ALTER TABLE product_market_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE fx_rates_daily ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public read access (only create if they don't exist)
DO $$
BEGIN
  -- Create policy for product_market_quotes if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'product_market_quotes' 
    AND policyname = 'Market quotes are viewable by everyone'
  ) THEN
    CREATE POLICY "Market quotes are viewable by everyone" ON product_market_quotes
      FOR SELECT USING (true);
  END IF;

  -- Create policy for fx_rates_daily if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'fx_rates_daily' 
    AND policyname = 'FX rates are viewable by everyone'
  ) THEN
    CREATE POLICY "FX rates are viewable by everyone" ON fx_rates_daily
      FOR SELECT USING (true);
  END IF;
END $$;

-- Comments for documentation
COMMENT ON TABLE product_market_quotes IS 'Historical indicative FOB prices for products (USD/kg)';
COMMENT ON COLUMN product_market_quotes.price_mid_usd IS 'Mid-point price in USD per kg';
COMMENT ON COLUMN product_market_quotes.tolerance_usd IS 'Price tolerance (+/-) in USD, default 0.005 (0.5 cents)';
COMMENT ON COLUMN product_market_quotes.incoterm IS 'Trade term, default FOB';
COMMENT ON COLUMN product_market_quotes.unit IS 'Price unit, default USD_PER_KG';

COMMENT ON TABLE fx_rates_daily IS 'Daily exchange rates for currency conversion';
COMMENT ON COLUMN fx_rates_daily.usd_uzs IS 'USD to UZS exchange rate';
COMMENT ON COLUMN fx_rates_daily.source IS 'Source of the exchange rate (e.g., CBU, manual)';
