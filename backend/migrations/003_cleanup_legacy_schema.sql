-- Remove the incompatible prototype schema before the current GORM schema runs.
-- The legacy family is identified by tables that do not exist in the current
-- runtime. This is intentionally destructive for the demo database only.

DO $$
BEGIN
  IF to_regclass('public.users') IS NOT NULL
     OR to_regclass('public.inventory') IS NOT NULL
     OR to_regclass('public.costing_history') IS NOT NULL
     OR to_regclass('public.rfqs') IS NOT NULL
     OR to_regclass('public.quotations') IS NOT NULL
     OR to_regclass('public.goods_receipts') IS NOT NULL
     OR to_regclass('public.vendor_invoices') IS NOT NULL
     OR to_regclass('public.requests_for_payment') IS NOT NULL
     OR to_regclass('public.statements_of_account') IS NOT NULL
  THEN
    DROP TABLE IF EXISTS
      users,
      inventory,
      costing_history,
      rfqs,
      quotations,
      goods_receipts,
      vendor_invoices,
      requests_for_payment,
      statements_of_account,
      purchase_orders,
      audit_logs
    CASCADE;
  END IF;
END $$;
