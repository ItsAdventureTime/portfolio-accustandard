# Accustandard Developer Handoff Guide

> **Current runtime note (2026-08-12):** This guide describes the intended
> product. `IMPLEMENTATION_STATUS.md` records what the current demo actually
> persists and what remains unverified.

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
  1. **Remote GitHub Sync:** Remote synchronization to GitHub (`https://github.com/ItsAdventureTime/bridge-accustandard.git`) MUST use only official GitHub CLI (`gh`) over authenticated HTTPS. Do not use `git push`, SSH remotes, SSH keys, or passkeys.

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
