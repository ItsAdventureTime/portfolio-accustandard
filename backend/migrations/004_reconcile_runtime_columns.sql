-- Demo-only compatibility migration for the pre-tagged GORM schema.
--
-- Older runtime images created acronym fields as d_csstatus and s_idate.
-- Preserve those values while establishing the canonical seed/API columns.
-- This script is intentionally idempotent and runs before AutoMigrate.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_class AS c
    JOIN pg_namespace AS n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname = 'approval_logs'
      AND c.relkind IN ('r', 'p')
  ) THEN
    ALTER TABLE public.approval_logs
      ADD COLUMN IF NOT EXISTS dcs_status text;

    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'approval_logs'
        AND column_name = 'd_csstatus'
    ) THEN
      UPDATE public.approval_logs
      SET dcs_status = COALESCE(dcs_status, d_csstatus)
      WHERE dcs_status IS NULL;
    END IF;

    UPDATE public.approval_logs
    SET dcs_status = 'NOT_REQUIRED'
    WHERE dcs_status IS NULL;

    ALTER TABLE public.approval_logs
      ALTER COLUMN dcs_status SET DEFAULT 'NOT_REQUIRED',
      ALTER COLUMN dcs_status SET NOT NULL;

    -- The alias is no longer part of the runtime model. Drop it after the
    -- value copy so new inserts cannot be rejected by its old NOT NULL rule.
    ALTER TABLE public.approval_logs
      DROP COLUMN IF EXISTS d_csstatus;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_class AS c
    JOIN pg_namespace AS n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname = 'soa_items'
      AND c.relkind IN ('r', 'p')
  ) THEN
    ALTER TABLE public.soa_items
      ADD COLUMN IF NOT EXISTS si_date timestamptz;

    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'soa_items'
        AND column_name = 's_idate'
    ) THEN
      UPDATE public.soa_items
      SET si_date = COALESCE(si_date, s_idate)
      WHERE si_date IS NULL;
    END IF;

    UPDATE public.soa_items
    SET si_date = CURRENT_TIMESTAMP
    WHERE si_date IS NULL;

    ALTER TABLE public.soa_items
      ALTER COLUMN si_date SET DEFAULT CURRENT_TIMESTAMP,
      ALTER COLUMN si_date SET NOT NULL;

    ALTER TABLE public.soa_items
      DROP COLUMN IF EXISTS s_idate;
  END IF;
END $$;
