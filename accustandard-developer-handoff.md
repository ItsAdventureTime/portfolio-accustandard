# Accustandard Developer Handoff Guide

Welcome to the developer handoff guide for the **Accustandard Medical ERP Dashboard**. This document summarizes core client requirements and technical guidelines gathered during system planning.

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
- QuickBooks Online (QBO) acts as financial accounting ledger via live API queue
- **Mandatory Repository & Version Control Policy:**
  0. **Documentation Sync:** Every code, UI, dependency, or architectural change MUST immediately update all documentation (`README.md`, `ARCHITECTURE.md`, `CONTRIBUTING.md`, `accustandard-developer-handoff.md`, `AGENT_PROMPT.md`, `GO_MIGRATION_PLAN.md`).
  1. **Local Commits:** Local commits use standard local `git` CLI (`git commit --no-gpg-sign`) without SSH keys, passkeys, or GPG prompts.
  2. **Remote GitHub Sync:** Remote commit and repository synchronization to GitHub (`https://github.com/ItsAdventureTime/bridge-accustandard.git`) MUST use `git push origin main` or official GitHub CLI (`gh`) over **HTTPS** authentication. SSH keys and passkeys are strictly avoided.

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

- **Approval Chain:** Maker &rarr; Reviewer &rarr; GM &rarr; DCS Chairman.
- **No Self-Approvals:** Maker cannot approve own document.
- **Stock Reservations:** Unconfirmed quotes release reserved stock after 3 days.
- **Class 3 Purchasing Lock:** Block PO creation without an approved linked Customer PO.
- **3-Way Matching:** Prevent receiving report posting if quantity or price exceeds PO limits.
