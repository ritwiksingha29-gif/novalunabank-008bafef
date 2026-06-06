ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS initiated_at timestamptz,
  ADD COLUMN IF NOT EXISTS verified_at timestamptz,
  ADD COLUMN IF NOT EXISTS processed_at timestamptz,
  ADD COLUMN IF NOT EXISTS credited_at timestamptz;

UPDATE public.transactions SET initiated_at = saved_at WHERE initiated_at IS NULL;