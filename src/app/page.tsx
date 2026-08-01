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
  Plus,
  ArrowRight,
  RefreshCcw,
  Check,
  ChevronRight
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
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      {/* IBM Carbon Shell Header Bar */}
      <header className="carbon-header-shell px-6 py-3 shadow-md flex flex-wrap justify-between items-center gap-4">
        {/* Brand Lockup */}
        <div className="flex items-center space-x-3">
          <div className="bg-white px-2.5 py-1 flex items-center justify-center border border-slate-300">
            <span className="text-lg font-black text-blue-900 tracking-tight">ACCUSTANDA</span>
            <span className="text-lg font-black text-red-600 ml-0.5">R<sub className="text-xs">X</sub>D</span>
          </div>
          <div className="border-l border-slate-700 pl-3">
            <h1 className="text-sm font-bold tracking-wide uppercase text-slate-100">ENTERPRISE DASHBOARD</h1>
            <p className="text-[11px] text-slate-400">COSO Control-First ERP & Inventory System</p>
          </div>
        </div>

        {/* View As Impersonation Selector (IBM Carbon Style) */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs">
          <Eye className="w-4 h-4 text-amber-400" />
          <span className="text-slate-300 font-medium">Impersonate ("View As"):</span>
          <select
            value={viewAsRole}
            onChange={(e) => setViewAsRole(e.target.value)}
            className="bg-slate-800 text-white font-semibold px-2 py-1 border border-slate-600 focus:outline-none focus:border-blue-500"
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

        {/* Actions & Barcode Trigger */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>QBO API Live Sync</span>
          </div>
          <button
            onClick={() => setIsScannerOpen(true)}
            className="carbon-btn-danger text-xs px-3.5 py-2 font-semibold active:scale-95 transition"
          >
            <Camera className="w-4 h-4" />
            Mobile Barcode Scanner
          </button>
        </div>
      </header>

      {/* IBM Carbon Tab Navigation Shell */}
      <nav className="bg-slate-900 border-b border-slate-800 px-4 md:px-6 flex overflow-x-auto no-scrollbar whitespace-nowrap text-xs font-semibold text-slate-400">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-4 transition border-b-2 flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'border-blue-500 text-white font-bold bg-slate-800/60'
              : 'border-transparent hover:text-slate-200 hover:bg-slate-800/30'
          }`}
        >
          <Layers className="w-4 h-4" />
          Executive Overview
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`py-3 px-4 transition border-b-2 flex items-center gap-2 ${
            activeTab === 'inventory'
              ? 'border-blue-500 text-white font-bold bg-slate-800/60'
              : 'border-transparent hover:text-slate-200 hover:bg-slate-800/30'
          }`}
        >
          <Package className="w-4 h-4" />
          Inventory (QC & Pampanga)
        </button>
        <button
          onClick={() => setActiveTab('quotations')}
          className={`py-3 px-4 transition border-b-2 flex items-center gap-2 ${
            activeTab === 'quotations'
              ? 'border-blue-500 text-white font-bold bg-slate-800/60'
              : 'border-transparent hover:text-slate-200 hover:bg-slate-800/30'
          }`}
        >
          <FileText className="w-4 h-4" />
          Quotation Routing
        </button>
        <button
          onClick={() => setActiveTab('soa')}
          className={`py-3 px-4 transition border-b-2 flex items-center gap-2 ${
            activeTab === 'soa'
              ? 'border-blue-500 text-white font-bold bg-slate-800/60'
              : 'border-transparent hover:text-slate-200 hover:bg-slate-800/30'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          Statement of Account (SOA)
        </button>
        <button
          onClick={() => setActiveTab('purchasing')}
          className={`py-3 px-4 transition border-b-2 flex items-center gap-2 ${
            activeTab === 'purchasing'
              ? 'border-blue-500 text-white font-bold bg-slate-800/60'
              : 'border-transparent hover:text-slate-200 hover:bg-slate-800/30'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Purchasing & 3-Way Match
        </button>
        <button
          onClick={() => setActiveTab('rfp')}
          className={`py-3 px-4 transition border-b-2 flex items-center gap-2 ${
            activeTab === 'rfp'
              ? 'border-blue-500 text-white font-bold bg-slate-800/60'
              : 'border-transparent hover:text-slate-200 hover:bg-slate-800/30'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Request for Payment (RFP)
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`py-3 px-4 transition border-b-2 flex items-center gap-2 ${
            activeTab === 'admin'
              ? 'border-blue-500 text-white font-bold bg-slate-800/60'
              : 'border-transparent hover:text-slate-200 hover:bg-slate-800/30'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Admin & Audit Trail
        </button>
      </nav>

      {/* Main Content Area (IBM Carbon Layout Grid) */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* TAB 1: EXECUTIVE OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* IBM Carbon 4-Column Grid Metric Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="carbon-tile">
                <div className="flex justify-between items-center text-slate-500 text-xs mb-2">
                  <span className="font-semibold uppercase tracking-wider">Quezon City Stock</span>
                  <Package className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white">1,480</p>
                <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between text-[11px]">
                  <span className="text-emerald-600 font-semibold">Available: 1,120</span>
                  <span className="text-amber-600 font-semibold">Reserved: 360</span>
                </div>
              </div>

              <div className="carbon-tile">
                <div className="flex justify-between items-center text-slate-500 text-xs mb-2">
                  <span className="font-semibold uppercase tracking-wider">Pampanga Stock</span>
                  <Package className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white">920</p>
                <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between text-[11px]">
                  <span className="text-emerald-600 font-semibold">Available: 780</span>
                  <span className="text-amber-600 font-semibold">Reserved: 140</span>
                </div>
              </div>

              <div className="carbon-tile">
                <div className="flex justify-between items-center text-slate-500 text-xs mb-2">
                  <span className="font-semibold uppercase tracking-wider">Pending Approvals</span>
                  <Clock className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-3xl font-extrabold text-amber-600">4 Docs</p>
                <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
                  <span>Routing to: <strong className="text-slate-800 dark:text-slate-200">{viewAsRole}</strong></span>
                </div>
              </div>

              <div className="carbon-tile">
                <div className="flex justify-between items-center text-slate-500 text-xs mb-2">
                  <span className="font-semibold uppercase tracking-wider">Gross Margin Avg</span>
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-3xl font-extrabold text-emerald-600">34.8%</p>
                <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
                  <span>Cost basis per batch</span>
                </div>
              </div>
            </div>

            {/* Approval Stepper Tracker (IBM Carbon Progress Indicator) */}
            <div className="carbon-tile space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Segregation of Duties — 4-Layer Approval Chain
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 bg-blue-50 dark:bg-slate-800 border-l-4 border-blue-600">
                  <span className="text-[10px] font-bold uppercase text-blue-600">Layer 1: Maker</span>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">Creates Document</p>
                  <p className="text-[11px] text-slate-500">Sales / Purchasing</p>
                </div>
                <div className="p-2.5 bg-blue-50 dark:bg-slate-800 border-l-4 border-blue-600">
                  <span className="text-[10px] font-bold uppercase text-blue-600">Layer 2: Reviewer</span>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">Checks Accuracy</p>
                  <p className="text-[11px] text-slate-500">Marketing Officer</p>
                </div>
                <div className="p-2.5 bg-blue-50 dark:bg-slate-800 border-l-4 border-blue-600">
                  <span className="text-[10px] font-bold uppercase text-blue-600">Layer 3: GM</span>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">Business Approval</p>
                  <p className="text-[11px] text-slate-500">General Manager (Karen)</p>
                </div>
                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 border-l-4 border-amber-500">
                  <span className="text-[10px] font-bold uppercase text-amber-600">Layer 4: DCS</span>
                  <p className="font-semibold text-amber-900 dark:text-amber-200">Final Approval</p>
                  <p className="text-[11px] text-amber-700 dark:text-amber-300">Chairman (DCS)</p>
                </div>
              </div>
            </div>

            {/* Pending Approvals Data Table */}
            <div className="carbon-tile p-0 overflow-hidden">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                    Pending Approval Queue (Role View: {viewAsRole})
                  </h3>
                </div>
                <span className="carbon-tag carbon-tag-amber">Launch Rule: Routing to DCS</span>
              </div>

              <div className="overflow-x-auto">
                <table className="carbon-data-table">
                  <thead>
                    <tr>
                      <th>QRN / Ref #</th>
                      <th>Document Type</th>
                      <th>Maker</th>
                      <th>Reviewer (Mktg)</th>
                      <th>GM Status</th>
                      <th>DCS Status</th>
                      <th className="text-right">Total Amount</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="font-mono font-bold text-blue-600">QRN20240415037</td>
                      <td>Sales Quotation</td>
                      <td>Sales Officer</td>
                      <td><span className="carbon-tag carbon-tag-green">Approved</span></td>
                      <td><span className="carbon-tag carbon-tag-green">Approved</span></td>
                      <td><span className="carbon-tag carbon-tag-amber">Pending DCS</span></td>
                      <td className="text-right font-bold">₱31,500.00</td>
                      <td className="text-center space-x-1">
                        <button className="bg-emerald-700 hover:bg-emerald-600 text-white px-2.5 py-1 text-xs font-semibold">
                          Approve
                        </button>
                        <button className="bg-red-700 hover:bg-red-600 text-white px-2.5 py-1 text-xs font-semibold">
                          Reject
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="font-mono font-bold text-blue-600">PO-2026-0891</td>
                      <td>Purchase Order</td>
                      <td>Purchasing Officer</td>
                      <td><span className="carbon-tag carbon-tag-blue">Reviewed</span></td>
                      <td><span className="carbon-tag carbon-tag-amber">Pending GM</span></td>
                      <td><span className="carbon-tag carbon-tag-gray">Awaiting Tier</span></td>
                      <td className="text-right font-bold">₱142,000.00</td>
                      <td className="text-center space-x-1">
                        <button className="bg-emerald-700 hover:bg-emerald-600 text-white px-2.5 py-1 text-xs font-semibold">
                          Approve
                        </button>
                        <button className="bg-red-700 hover:bg-red-600 text-white px-2.5 py-1 text-xs font-semibold">
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
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Multi-Location Inventory Control
                </h2>
                <p className="text-xs text-slate-500">Tracking stock across Quezon City and Pampanga warehouses</p>
              </div>
              <button
                onClick={() => setIsScannerOpen(true)}
                className="carbon-btn-primary text-xs"
              >
                <Camera className="w-4 h-4" />
                Scan Barcode
              </button>
            </div>

            <div className="carbon-tile p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="carbon-data-table">
                  <thead>
                    <tr>
                      <th>SKU / Barcode</th>
                      <th>Item Description</th>
                      <th>Location</th>
                      <th>Batch / Lot</th>
                      <th>Expiry Date</th>
                      <th className="text-right">On Hand</th>
                      <th className="text-right">Reserved (3-Day Limit)</th>
                      <th className="text-right">Available</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="font-mono font-bold">ACC-BACT-01</td>
                      <td className="font-semibold">Calibration Sticks Bact Alert</td>
                      <td>Pampanga</td>
                      <td className="font-mono">LOT-2026-A9</td>
                      <td><span className="carbon-tag carbon-tag-green">2027-11-30</span></td>
                      <td className="text-right font-bold">45 Kits</td>
                      <td className="text-right text-amber-600 font-bold">5 Kits</td>
                      <td className="text-right text-emerald-600 font-bold">40 Kits</td>
                    </tr>
                    <tr>
                      <td className="font-mono font-bold">ACC-REAG-04</td>
                      <td className="font-semibold">Blood Chemistry Reagents Kit</td>
                      <td>Quezon City</td>
                      <td className="font-mono">LOT-2026-B2</td>
                      <td><span className="carbon-tag carbon-tag-amber">2026-09-15 (Near Expiry)</span></td>
                      <td className="text-right font-bold">120 Boxes</td>
                      <td className="text-right text-amber-600 font-bold">20 Boxes</td>
                      <td className="text-right text-emerald-600 font-bold">100 Boxes</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: QUOTATIONS */}
        {activeTab === 'quotations' && (
          <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Sales Quotation Generator & Stock Reservation
                </h2>
                <p className="text-xs text-slate-500">Named Flow: Client → Sales RFQ → Marketing (Reviewer) → GM → DCS</p>
              </div>
              <button
                onClick={() => window.print()}
                className="carbon-btn-danger text-xs"
              >
                <Download className="w-4 h-4" />
                Print / Export Quotation
              </button>
            </div>

            {/* Rendered Quotation PDF Preview */}
            <div className="bg-slate-300 dark:bg-slate-900 p-4 md:p-6 border border-slate-400 dark:border-slate-800 overflow-x-auto">
              <QuotationPDF data={sampleQuotation} />
            </div>
          </div>
        )}

        {/* TAB 4: STATEMENT OF ACCOUNT (SOA) */}
        {activeTab === 'soa' && (
          <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Statement of Account (SOA) Module
                </h2>
                <p className="text-xs text-slate-500">Client Aging, DR numbers, and Running Balances</p>
              </div>
              <button
                onClick={() => window.print()}
                className="carbon-btn-danger text-xs"
              >
                <Download className="w-4 h-4" />
                Print / Export SOA
              </button>
            </div>

            {/* Rendered SOA PDF Preview */}
            <div className="bg-slate-300 dark:bg-slate-900 p-4 md:p-6 border border-slate-400 dark:border-slate-800 overflow-x-auto">
              <StatementOfAccountPDF data={sampleSOA} />
            </div>
          </div>
        )}

        {/* TAB 5: PURCHASING */}
        {activeTab === 'purchasing' && (
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Purchasing & Receiving Report (3-Way Match)
            </h2>
            <div className="bg-amber-50 dark:bg-amber-950/40 border-l-4 border-amber-500 p-4 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="font-bold uppercase">PO Over-Receiving Rule Enforced:</p>
                <p>Receiving is strictly hard-blocked beyond approved Purchase Order quantities. Excess quantities require an approved PO revision.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: REQUEST FOR PAYMENT */}
        {activeTab === 'rfp' && (
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Request for Payment (RFP) - Non-PO Expenses
            </h2>
            <p className="text-xs text-slate-500">Select GL Account from maintained list & route for approval.</p>
          </div>
        )}

        {/* TAB 7: ADMIN */}
        {activeTab === 'admin' && (
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
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
