CREATE TABLE IF NOT EXISTS debts (
  id BIGSERIAL PRIMARY KEY,
  shop TEXT NOT NULL,
  phone TEXT,
  product TEXT NOT NULL,
  qty NUMERIC NOT NULL,
  price NUMERIC NOT NULL,
  total NUMERIC NOT NULL,
  date DATE NOT NULL,
  due DATE,
  paid NUMERIC NOT NULL DEFAULT 0,
  payments JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS debts_created_at_idx ON debts(created_at DESC);
