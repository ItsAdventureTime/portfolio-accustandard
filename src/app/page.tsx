'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  Building2,
  Package,
  FileText,
  FileCheck,
  CreditCard,
  UserCheck,
  Camera,
  Layers,
  Clock,
  TrendingUp,
  AlertTriangle,
  Eye,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Download,
  Plus
} from 'lucide-react';
import { BarcodeScannerModal } from '@/components/scanner/BarcodeScannerModal';
import { QuotationPDF, QuotationData } from '@/components/documents/QuotationPDF';
import { StatementOfAccountPDF, SOAData } from '@/components/documents/StatementOfAccountPDF';

export default function DashboardHome() {
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'quotations' | 'soa' | 'purchasing' | 'rfp' | 'admin'>('overview');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [viewAsRole, setViewAsRole] = useState<string>('Chairman (DCS)');

  // Sample Quotation Data matching photo_2026-08-01_23-55-26.jpg
  const sampleQuotation: QuotationData = {
    qrn: 'QRN20240415037',
    dateStr: 'April 15, 2024',
    clientName: 'Ms. Katherine Porciuncula',
    clientOrganization: 'Allied Care Experts Medical Center',
    clientAddress: 'Lot 2975, C-1 Doña Remedios Trinidad Hwy, Baliuag, Bulacan',
    items: [
      {
        id: 'q1',
        description: 'Calibration Sticks Bact Alert',
        packaging: '1 Kit',
        unitPrice: 31500.0,
      },
    ],
    deliveryTerms: '30-60 days from date of receipt of Purchase Order.',
    paymentTerms: 'Thirty (30) days upon invoice date',
    validityDays: 30,
    signatoryName: 'Katherine M. Payumo, RMT',
    signatoryTitle: 'Product Marketing Manager',
  };

  // Sample SOA Data matching photo_2026-08-01_23-55-13.jpg
  const sampleSOA: SOAData = {
    statementDate: '10-Jul-26',
    clientName: 'GATCHALIAN MEDICAL LABORATORY',
    terms: '30 Days',
    salesperson: 'Sir. Roel Macaraeg',
    rows: [
      {
        salesInvoiceNo: '6087',
        drNo: '6075',
        siDate: '18-Jun-26',
        dueDate: '7/18/2026',
        ageDays: 22,
        invoiceAmount: 16960.0,
        amountPaid: 0,
        invoiceBalance: 16960.0,
        runningBalance: 16960.0,
      },
      {
        salesInvoiceNo: '6107',
        drNo: '6097',
        siDate: '26-Jun-26',
        dueDate: '7/26/2026',
        ageDays: 14,
        invoiceAmount: 1968.0,
        amountPaid: 0,
        invoiceBalance: 1968.0,
        runningBalance: 18928.0,
      },
      {
        salesInvoiceNo: '6118',
        drNo: '6113',
        siDate: '30-Jun-26',
        dueDate: '7/30/2026',
        ageDays: 10,
        invoiceAmount: 13280.0,
        amountPaid: 0,
        invoiceBalance: 13280.0,
        runningBalance: 32208.0,
      },
    ],
    preparedBy: 'Marrione Fuentes',
    preparedByTitle: 'Accounting Officer',
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      {/* Top Brand & RBAC Control Header */}
      <header className="brand-header-bg text-white px-6 py-4 shadow-lg flex flex-wrap justify-between items-center gap-4 border-b border-blue-900">
        <div className="flex items-center space-x-3">
          <div className="bg-white p-2 rounded-xl shadow-md flex items-center justify-center">
            <span className="text-xl font-black text-blue-900">ACCUSTANDA</span>
            <span className="text-xl font-black text-red-600">R<sub className="text-sm">X</sub>D</span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">ERP DASHBOARD</h1>
            <p className="text-xs text-blue-200">Control-First Enterprise Operations & Multi-Location ERP</p>
          </div>
        </div>

        {/* View As Impersonation Bar */}
        <div className="flex items-center gap-3 bg-blue-950/60 backdrop-blur border border-blue-400/30 px-3.5 py-1.5 rounded-xl text-xs">
          <Eye className="w-4 h-4 text-amber-400" />
          <span className="text-blue-200">Admin Impersonation ("View As"):</span>
          <select
            value={viewAsRole}
            onChange={(e) => setViewAsRole(e.target.value)}
            className="bg-slate-900 text-white font-semibold rounded-lg px-2 py-1 border border-blue-400/40 focus:outline-none"
          >
            <option value="Admin">Admin (Bridge)</option>
            <option value="Chairman (DCS)">Chairman (DCS)</option>
            <option value="General Manager">General Manager (Karen)</option>
            <option value="Bookkeeper">Bookkeeper (Aila)</option>
            <option value="Warehouse">Warehouse (Marie)</option>
            <option value="Marketing">Marketing / Reviewer</option>
            <option value="Sales">Sales Officer</option>
          </select>
        </div>

        {/* Mobile Camera Barcode Trigger */}
        <button
          onClick={() => setIsScannerOpen(true)}
          className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-lg transition active:scale-95"
        >
          <Camera className="w-4 h-4" />
          Mobile Barcode Scanner
        </button>
      </header>

      {/* Main Navigation Tabs */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-2 flex flex-wrap gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-2 rounded-lg transition flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          Executive Overview
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-3.5 py-2 rounded-lg transition flex items-center gap-2 ${
            activeTab === 'inventory'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          Inventory (QC & Pampanga)
        </button>
        <button
          onClick={() => setActiveTab('quotations')}
          className={`px-3.5 py-2 rounded-lg transition flex items-center gap-2 ${
            activeTab === 'quotations'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          Quotation Routing
        </button>
        <button
          onClick={() => setActiveTab('soa')}
          className={`px-3.5 py-2 rounded-lg transition flex items-center gap-2 ${
            activeTab === 'soa'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          Statement of Account (SOA)
        </button>
        <button
          onClick={() => setActiveTab('purchasing')}
          className={`px-3.5 py-2 rounded-lg transition flex items-center gap-2 ${
            activeTab === 'purchasing'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Purchasing & 3-Way Match
        </button>
        <button
          onClick={() => setActiveTab('rfp')}
          className={`px-3.5 py-2 rounded-lg transition flex items-center gap-2 ${
            activeTab === 'rfp'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Request for Payment (RFP)
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`px-3.5 py-2 rounded-lg transition flex items-center gap-2 ${
            activeTab === 'admin'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Admin & Audit Logs
        </button>
      </nav>

      {/* Main Body */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {/* TAB 1: EXECUTIVE OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
                <div className="flex justify-between items-center text-slate-500 text-xs mb-1">
                  <span>Quezon City Stock</span>
                  <Package className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">1,480 Units</p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">Available: 1,120 | Reserved: 360</p>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
                <div className="flex justify-between items-center text-slate-500 text-xs mb-1">
                  <span>Pampanga Stock</span>
                  <Package className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">920 Units</p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">Available: 780 | Reserved: 140</p>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
                <div className="flex justify-between items-center text-slate-500 text-xs mb-1">
                  <span>Pending Approvals</span>
                  <Clock className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-2xl font-bold text-amber-600">4 Items</p>
                <p className="text-[11px] text-slate-500 mt-1">Routing to: {viewAsRole}</p>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
                <div className="flex justify-between items-center text-slate-500 text-xs mb-1">
                  <span>Gross Margin Avg</span>
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-2xl font-bold text-emerald-600">34.8%</p>
                <p className="text-[11px] text-slate-500 mt-1">Quotation vs Unit Cost basis</p>
              </div>
            </div>

            {/* Pending Approvals Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                Pending Maker-Checker-Approver Queue (Role: {viewAsRole})
              </h2>

              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                      <th className="py-2.5 px-3">Document QRN / Ref</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Maker</th>
                      <th className="py-2.5 px-3">Reviewer (Marketing)</th>
                      <th className="py-2.5 px-3">GM Status</th>
                      <th className="py-2.5 px-3">DCS (Chairman)</th>
                      <th className="py-2.5 px-3 text-right">Amount</th>
                      <th className="py-2.5 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr>
                      <td className="py-3 px-3 font-mono font-bold text-blue-600">QRN20240415037</td>
                      <td className="py-3 px-3">Sales Quotation</td>
                      <td className="py-3 px-3">Sales Officer</td>
                      <td className="py-3 px-3 text-emerald-600 font-semibold">Approved (Mktg)</td>
                      <td className="py-3 px-3 text-emerald-600 font-semibold">Approved (GM)</td>
                      <td className="py-3 px-3 text-amber-600 font-bold animate-pulse">Pending DCS</td>
                      <td className="py-3 px-3 text-right font-bold">₱31,500.00</td>
                      <td className="py-3 px-3 text-center space-x-1">
                        <button className="bg-emerald-600 text-white px-2.5 py-1 rounded font-semibold text-[11px] hover:bg-emerald-500">
                          Approve
                        </button>
                        <button className="bg-red-600 text-white px-2.5 py-1 rounded font-semibold text-[11px] hover:bg-red-500">
                          Reject
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-mono font-bold text-blue-600">PO-2026-0891</td>
                      <td className="py-3 px-3">Purchase Order</td>
                      <td className="py-3 px-3">Purchasing Officer</td>
                      <td className="py-3 px-3 text-emerald-600 font-semibold">Reviewed</td>
                      <td className="py-3 px-3 text-amber-600 font-bold">Pending GM</td>
                      <td className="py-3 px-3 text-slate-400">Awaiting Tier</td>
                      <td className="py-3 px-3 text-right font-bold">₱142,000.00</td>
                      <td className="py-3 px-3 text-center space-x-1">
                        <button className="bg-emerald-600 text-white px-2.5 py-1 rounded font-semibold text-[11px] hover:bg-emerald-500">
                          Approve
                        </button>
                        <button className="bg-red-600 text-white px-2.5 py-1 rounded font-semibold text-[11px] hover:bg-red-500">
                          Reject
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INVENTORY */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Multi-Location Inventory Management (QC & Pampanga)
              </h2>
              <button
                onClick={() => setIsScannerOpen(true)}
                className="bg-blue-600 text-white text-xs px-3.5 py-2 rounded-lg font-semibold flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Scan Barcode
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                    <th className="py-2.5 px-3">SKU / Barcode</th>
                    <th className="py-2.5 px-3">Item Description</th>
                    <th className="py-2.5 px-3">Location</th>
                    <th className="py-2.5 px-3">Batch / Lot</th>
                    <th className="py-2.5 px-3">Expiry Date</th>
                    <th className="py-2.5 px-3 text-right">On Hand</th>
                    <th className="py-2.5 px-3 text-right">Reserved (3-Day Limit)</th>
                    <th className="py-2.5 px-3 text-right">Available</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="py-3 px-3 font-mono font-bold">ACC-BACT-01</td>
                    <td className="py-3 px-3 font-medium">Calibration Sticks Bact Alert</td>
                    <td className="py-3 px-3">Pampanga</td>
                    <td className="py-3 px-3 font-mono">LOT-2026-A9</td>
                    <td className="py-3 px-3 text-emerald-600 font-semibold">2027-11-30</td>
                    <td className="py-3 px-3 text-right font-bold">45 Kits</td>
                    <td className="py-3 px-3 text-right text-amber-600 font-bold">5 Kits</td>
                    <td className="py-3 px-3 text-right text-emerald-600 font-bold">40 Kits</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-mono font-bold">ACC-REAG-04</td>
                    <td className="py-3 px-3 font-medium">Blood Chemistry Reagents Kit</td>
                    <td className="py-3 px-3">Quezon City</td>
                    <td className="py-3 px-3 font-mono">LOT-2026-B2</td>
                    <td className="py-3 px-3 text-amber-600 font-semibold">2026-09-15 (Near Expiry)</td>
                    <td className="py-3 px-3 text-right font-bold">120 Boxes</td>
                    <td className="py-3 px-3 text-right text-amber-600 font-bold">20 Boxes</td>
                    <td className="py-3 px-3 text-right text-emerald-600 font-bold">100 Boxes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: QUOTATIONS */}
        {activeTab === 'quotations' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Sales Quotation Generator & Approval Routing
                </h2>
                <p className="text-xs text-slate-500">Flow: Client → Sales RFQ → Marketing (Reviewer) → GM → DCS</p>
              </div>
              <button
                onClick={() => window.print()}
                className="bg-red-600 text-white text-xs px-3.5 py-2 rounded-lg font-semibold flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Print / Export Quotation
              </button>
            </div>

            {/* Rendered Quotation PDF Preview */}
            <div className="bg-slate-200 dark:bg-slate-800 p-6 rounded-2xl">
              <QuotationPDF data={sampleQuotation} />
            </div>
          </div>
        )}

        {/* TAB 4: STATEMENT OF ACCOUNT (SOA) */}
        {activeTab === 'soa' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Statement of Account (SOA) Module
                </h2>
                <p className="text-xs text-slate-500">Client Aging, DR numbers, and Running Balances</p>
              </div>
              <button
                onClick={() => window.print()}
                className="bg-red-600 text-white text-xs px-3.5 py-2 rounded-lg font-semibold flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Print / Export SOA
              </button>
            </div>

            {/* Rendered SOA PDF Preview */}
            <div className="bg-slate-200 dark:bg-slate-800 p-6 rounded-2xl">
              <StatementOfAccountPDF data={sampleSOA} />
            </div>
          </div>
        )}

        {/* TAB 5: PURCHASING */}
        {activeTab === 'purchasing' && (
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Purchasing & Receiving Report (3-Way Match & Anti-Fraud Control)
            </h2>
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/50 p-4 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="font-bold">Over-Receiving Rule Enforced:</p>
                <p>Receiving is strictly hard-blocked beyond approved Purchase Order quantities. Any excess quantity requires a formal, approved PO revision.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: REQUEST FOR PAYMENT */}
        {activeTab === 'rfp' && (
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Request for Payment (RFP) - Other Non-PO Expenses
            </h2>
            <p className="text-xs text-slate-500">Select GL Account from maintained list & route for approval.</p>
          </div>
        )}

        {/* TAB 7: ADMIN */}
        {activeTab === 'admin' && (
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Admin & System Control Log
            </h2>
            <p className="text-xs text-slate-500">Immutable audit logs and Admin overrides.</p>
          </div>
        )}
      </main>

      {/* Barcode Scanner Modal */}
      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={(scannedCode) => {
          alert(`Scanned Barcode: ${scannedCode}`);
        }}
      />
    </div>
  );
}
