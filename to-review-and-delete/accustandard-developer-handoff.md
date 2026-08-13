# Accustandard Developer Handoff Guide

> **Current runtime note (2026-08-12):** This guide describes the intended
> product. `IMPLEMENTATION_STATUS.md` records what the current demo actually
> persists and what remains unverified.

> **Authority:** `implementation_plan.md` governs UI/UX scope. The confirmed
> acceptance handoff governs business rules; `IMPLEMENTATION_STATUS.md`
> governs runtime status; `README.md`, `ARCHITECTURE.md`, and `CONTRIBUTING.md`
> govern operations.

Welcome to the developer handoff guide for the **Accustandard Medical ERP Dashboard**. This document summarizes core client requirements and technical guidelines gathered during system planning; it is not evidence that the demo runtime has completed acceptance.

---

## 🎯 Project Goals

Accustandard requires a single integrated ERP web application to serve as its operational system of record. The platform focuses on fraud prevention, using segregation of duties, configurable approvals, immutable audit logs, strict inventory controls, and role-based access control (RBAC).

---

## 🏗️ Architecture & Remote Control Summary

- Single responsive Next.js web application
- Unified login portal with interactive 7-role switcher
- Role-based access control enforced at navigation and action levels
- Read-only "View As" mode for administrators with audited overrides
- Internal database acts as operational source of truth
- QuickBooks Online (QBO) is a future accounting integration; v1 uses a manual export/queue boundary
- **Mandatory Repository & Version Control Policy:**
  0. **Documentation Sync:** Every code, UI, dependency, or architectural change MUST update the applicable source-of-truth document and every affected operational guide. Historical prompts and transcripts remain explicitly non-authoritative rather than receiving copied stale instructions.
  1. **Remote GitHub Sync:** Follow `GITHUB_HTTPS_WORKFLOW.md`. Use official
     GitHub CLI (`gh`) to authenticate/configure Git, then synchronize only
     through the authenticated HTTPS remote
     (`https://github.com/ItsAdventureTime/bridge-accustandard.git`). Never use
     SSH remotes, SSH keys, `gh ssh-key`, or passkeys. Demo VPS transfer is a
     separate user-run SSH/rsync operation.

---

## 👥 Supported Roles

- **Admin (Bridge):** System configuration and audited overrides
- **Chairman / DCS:** Final corporate approval
- **General Manager (Karen):** Operational approvals
- **Bookkeeper (Aila):** Ledger view and SOA management
- **Warehouse & Inventory (Marie):** Stock receipts, barcode scanning, and FEFO tracking
- **Marketing Manager:** RFQ review and contract margin ROI calculations
- **Sales Officer:** Customer RFQ generation and quote creation

---

## 📋 Core Functional Scope

1. **Inventory Management:** Multi-location tracking (Quezon City & Pampanga), FEFO expiry tracking, serial numbers, stock transfers, and Class 1/2/3 replenishment planning.
2. **Barcode Scanning:** Camera-based PWA scanning for stock-in receiving reports and stock-out picking.
3. **Sales & RFQ Flow:** RFQ logging, 3-day soft stock reservations, official quote printing, and Marketing ROI calculations.
4. **Purchasing & Fraud Controls:** PO generation, 3-way match validation (PO ↔ Receiving Report ↔ Invoice), and over-receiving blocks.
5. **Expense Management:** Request for Payment (RFP) routing with chart-of-accounts GL selection.
6. **QuickBooks Online Integration:** Live sync queue with QBO reference tracking.

---

## 🔒 Mandatory Business Rules

- **Approval Chain:** Sales Quote Maker &rarr; Marketing Reviewer &rarr; GM; DCS is not a Sales Quote stage. Purchasing/RFP DCS approval remains configurable.
- **No Self-Approvals:** Maker cannot approve own document.
- **Stock Reservations:** Unconfirmed quotes release reserved stock after 3 days.
- **Class 3 Purchasing Lock:** Block PO creation without an approved linked Customer PO.
- **3-Way Matching:** Prevent receiving report posting if quantity or price exceeds PO limits.

## 2026 UI/API Baseline

The Next.js shell uses the AccuStandard navy/sapphire/red token system, collapsible desktop navigation, and mobile bottom navigation below 1024px. Operational data hydrates from the Go API under `/accustandard/demo/api/v1`; the frontend seed is an offline fallback only.
