# Accustandard Developer Handoff

This developer handoff is based on the confirmed requirements gathered with the client.

## Executive Summary
Accustandard requires a single integrated ERP web application that will become the operational system of record. The application is control-first and designed around fraud prevention through segregation of duties, configurable approvals, immutable audit logs, inventory controls, and RBAC.

## Confirmed Architecture
- Single responsive web application
- Single login portal
- Role-based access control
- Admin can View As any user (read-only) and perform audited overrides
- Operational database is the source of truth
- QuickBooks Online is the accounting ledger
- Preferred real-time QBO API integration with CSV/Excel fallback

## Confirmed Roles
- Admin (Bridge)
- Chairman / DCS
- General Manager (Karen)
- Bookkeeper (Aila)
- Warehouse & Inventory (Marie)
- Purchasing Officer (TBD)
- Sales (TBD)
- Price Maintenance (TBD)
- Vendor Maintenance (TBD)

## Functional Scope
- Inventory (multi-location, batch/expiry, serials, transfers, adjustments)
- Barcode scanning via mobile/PWA
- Sales quotation, reservation, approvals, SO, DR, Invoice
- Purchasing, Receiving, 3-way match, AP
- Request for Payment
- Price maintenance
- Vendor maintenance
- Executive dashboards
- Reporting
- QuickBooks Online integration
- Audit logs and approval engine

## Business Rules
- Maker, Reviewer, GM, DCS approval chain
- No self-approval
- No edits after approval
- Approved revisions restart approval
- PO over-receiving blocked
- Quotation reservation expires after 3 days (configurable)
- All approvals route to DCS at launch
- Threshold engine configurable for future

## Migration
- Existing system: JDEV (not trusted)
- Physical inventory count will be the basis for opening balances.

## Open Items
- Purchasing Officer assignment
- Sales assignment
- Price Maintenance assignee
- Vendor Maintenance assignee
- Costing methodology
- Price tiers
- Future approval thresholds
- Bank accounts for RFP
