
ALTER TABLE public.transactions ALTER COLUMN created_by SET DEFAULT auth.uid();
UPDATE public.transactions SET created_by = (SELECT id FROM auth.users ORDER BY created_at LIMIT 1) WHERE created_by IS NULL;

DROP POLICY IF EXISTS "Authenticated users can insert transactions" ON public.transactions;
DROP POLICY IF EXISTS "Authenticated users can update transactions" ON public.transactions;
DROP POLICY IF EXISTS "Authenticated users can delete transactions" ON public.transactions;

CREATE POLICY "Owners can insert transactions"
  ON public.transactions FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Owners can update their transactions"
  ON public.transactions FOR UPDATE TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Owners can delete their transactions"
  ON public.transactions FOR DELETE TO authenticated
  USING (created_by = auth.uid());
