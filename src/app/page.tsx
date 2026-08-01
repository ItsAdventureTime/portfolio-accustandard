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
  ChevronRight,
  Activity,
  Box,
  Layers3,
  ShieldCheck,
  Sparkles,
  Server
} from 'lucide-react';
import { BarcodeScannerModal } from '@/components/scanner/BarcodeScannerModal';
import { QuotationPDF, QuotationData } from '@/components/documents/QuotationPDF';
import { StatementOfAccountPDF, SOAData } from '@/components/documents/StatementOfAccountPDF';

export default function DashboardHome() {
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'quotations' | 'soa' | 'purchasing' | 'rfp' | 'admin'>('overview');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [viewAsRole, setViewAsRole] = useState<string>('Chairman (DCS)');
  const [searchQuery, setSearchQuery] = useState('');

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
    <div className="min-h-screen bg-[#e2e8f0] text-[#1e293b] flex flex-col font-sans">
      {/* Soft Slate Top Shell Header */}
      <header className="soft-slate-header px-4 md:px-6 py-3 flex flex-wrap justify-between items-center gap-4">
        {/* Brand Lockup matching photo_2026-08-01_23-55-07.jpg */}
        <div className="flex items-center space-x-3">
          <div className="bg-white px-3 py-1.5 rounded flex flex-col justify-center border border-slate-300 shadow-sm">
            <div className="flex items-center leading-none">
              <span className="text-xl font-black text-blue-900 tracking-tighter">ACCUSTANDA</span>
              <span className="text-xl font-black text-red-600 ml-0.5">R<span className="text-sm font-black italic">x</span></span>
              <span className="text-xl font-black text-blue-900">D</span>
            </div>
            <div className="w-full border-b-2 border-red-600 my-0.5"></div>
            <span className="text-[7.5px] font-extrabold text-slate-900 tracking-tighter uppercase whitespace-nowrap">
              MEDICAL AND DIAGNOSTIC SUPPLIES CORPORATION
            </span>
          </div>
          <div className="hidden sm:block border-l border-slate-300 pl-3">
            <h1 className="text-xs font-bold tracking-wider uppercase text-slate-800 flex items-center gap-1.5">
              <span>ENTERPRISE ERP DASHBOARD</span>
              <span className="bg-blue-100 text-blue-800 border border-blue-300 text-[10px] px-1.5 py-0.5 rounded font-mono">v4.0</span>
            </h1>
            <p className="text-[11px] text-slate-500">COSO Control-First Multi-Location Supply Chain</p>
          </div>
        </div>

        {/* View As Impersonation Bar */}
        <div className="flex items-center gap-2 bg-slate-100 border border-slate-300 px-3 py-1.5 rounded text-xs shadow-inner">
          <Eye className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="text-slate-700 font-medium hidden md:inline">Impersonate ("View As"):</span>
          <select
            value={viewAsRole}
            onChange={(e) => setViewAsRole(e.target.value)}
            className="bg-white text-slate-900 font-semibold rounded px-2.5 py-1 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
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
          <div className="hidden lg:flex items-center gap-2 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded">
            <Server className="w-3.5 h-3.5 text-emerald-700" />
            <span>QBO API Live Sync</span>
          </div>
          <button
            onClick={() => setIsScannerOpen(true)}
            className="btn-danger-red text-xs active:scale-95 transition touch-target"
          >
            <Camera className="w-4 h-4" />
            <span>Mobile Barcode Scanner</span>
          </button>
        </div>
      </header>

      {/* Top Horizontal Navigation Bar */}
      <nav className="soft-slate-nav-strip px-4 md:px-6 flex overflow-x-auto no-scrollbar whitespace-nowrap gap-1 text-xs font-semibold text-slate-600">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-4 transition border-b-2 flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'border-blue-600 text-blue-700 font-bold bg-white'
              : 'border-transparent hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <Layers className="w-4 h-4 text-blue-600" />
          Executive Overview
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`py-3 px-4 transition border-b-2 flex items-center gap-2 ${
            activeTab === 'inventory'
              ? 'border-blue-600 text-blue-700 font-bold bg-white'
              : 'border-transparent hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <Package className="w-4 h-4 text-blue-600" />
          Inventory (QC & Pampanga)
        </button>
        <button
          onClick={() => setActiveTab('quotations')}
          className={`py-3 px-4 transition border-b-2 flex items-center gap-2 ${
            activeTab === 'quotations'
              ? 'border-blue-600 text-blue-700 font-bold bg-white'
              : 'border-transparent hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <FileText className="w-4 h-4 text-blue-600" />
          Quotation Routing
        </button>
        <button
          onClick={() => setActiveTab('soa')}
          className={`py-3 px-4 transition border-b-2 flex items-center gap-2 ${
            activeTab === 'soa'
              ? 'border-blue-600 text-blue-700 font-bold bg-white'
              : 'border-transparent hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <FileCheck className="w-4 h-4 text-blue-600" />
          Statement of Account (SOA)
        </button>
        <button
          onClick={() => setActiveTab('purchasing')}
          className={`py-3 px-4 transition border-b-2 flex items-center gap-2 ${
            activeTab === 'purchasing'
              ? 'border-blue-600 text-blue-700 font-bold bg-white'
              : 'border-transparent hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <Building2 className="w-4 h-4 text-blue-600" />
          Purchasing & 3-Way Match
        </button>
        <button
          onClick={() => setActiveTab('rfp')}
          className={`py-3 px-4 transition border-b-2 flex items-center gap-2 ${
            activeTab === 'rfp'
              ? 'border-blue-600 text-blue-700 font-bold bg-white'
              : 'border-transparent hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <CreditCard className="w-4 h-4 text-blue-600" />
          Request for Payment (RFP)
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`py-3 px-4 transition border-b-2 flex items-center gap-2 ${
            activeTab === 'admin'
              ? 'border-blue-600 text-blue-700 font-bold bg-white'
              : 'border-transparent hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <UserCheck className="w-4 h-4 text-blue-600" />
          Admin & Audit Trail
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* TAB 1: EXECUTIVE OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Soft Slate KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="soft-slate-card p-5">
                <div className="flex justify-between items-center text-slate-500 text-xs mb-2">
                  <span className="font-semibold uppercase tracking-wider">Quezon City Stock</span>
                  <Box className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-3xl font-extrabold text-slate-900">1,480 <span className="text-xs font-normal text-slate-500">Units</span></p>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-3 overflow-hidden">
                  <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <div className="mt-2.5 flex justify-between text-[11px]">
                  <span className="text-emerald-700 font-semibold">Available: 1,120</span>
                  <span className="text-amber-700 font-semibold">Reserved: 360</span>
                </div>
              </div>

              <div className="soft-slate-card p-5">
                <div className="flex justify-between items-center text-slate-500 text-xs mb-2">
                  <span className="font-semibold uppercase tracking-wider">Pampanga Stock</span>
                  <Box className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-3xl font-extrabold text-slate-900">920 <span className="text-xs font-normal text-slate-500">Units</span></p>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-3 overflow-hidden">
                  <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '84%' }}></div>
                </div>
                <div className="mt-2.5 flex justify-between text-[11px]">
                  <span className="text-emerald-700 font-semibold">Available: 780</span>
                  <span className="text-amber-700 font-semibold">Reserved: 140</span>
                </div>
              </div>

              <div className="soft-slate-card p-5">
                <div className="flex justify-between items-center text-slate-500 text-xs mb-2">
                  <span className="font-semibold uppercase tracking-wider">Pending Approvals</span>
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <p className="text-3xl font-extrabold text-amber-600">4 <span className="text-xs font-normal text-amber-700">Docs</span></p>
                <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                  <span>Routing to: <strong className="text-slate-900">{viewAsRole}</strong></span>
                </div>
              </div>

              <div className="soft-slate-card p-5">
                <div className="flex justify-between items-center text-slate-500 text-xs mb-2">
                  <span className="font-semibold uppercase tracking-wider">Gross Margin Avg</span>
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-3xl font-extrabold text-emerald-700">34.8%</p>
                <div className="mt-3 text-[11px] text-slate-500">
                  <span>Batch FEFO cost basis tracking</span>
                </div>
              </div>
            </div>

            {/* Approval Stepper Tracker */}
            <div className="soft-slate-card p-5 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  COSO Segregation of Duties — 4-Layer Approval Chain
                </h3>
                <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded font-semibold text-xs border border-blue-300">All Documents to Chairman at Launch</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 border-l-4 border-blue-600 rounded shadow-sm">
                  <span className="text-[10px] font-bold uppercase text-blue-700">Layer 1: Maker</span>
                  <p className="font-semibold text-slate-900 mt-1">Encodes Transaction</p>
                  <p className="text-[11px] text-slate-500">Sales / Purchasing / Bookkeeper</p>
                </div>
                <div className="p-3 bg-slate-50 border-l-4 border-blue-600 rounded shadow-sm">
                  <span className="text-[10px] font-bold uppercase text-blue-700">Layer 2: Reviewer</span>
                  <p className="font-semibold text-slate-900 mt-1">Checks Completeness</p>
                  <p className="text-[11px] text-slate-500">Marketing Officer</p>
                </div>
                <div className="p-3 bg-slate-50 border-l-4 border-blue-600 rounded shadow-sm">
                  <span className="text-[10px] font-bold uppercase text-blue-700">Layer 3: GM</span>
                  <p className="font-semibold text-slate-900 mt-1">Business Approval</p>
                  <p className="text-[11px] text-slate-500">General Manager (Karen)</p>
                </div>
                <div className="p-3 bg-amber-50 border-l-4 border-amber-500 rounded shadow-sm">
                  <span className="text-[10px] font-bold uppercase text-amber-700">Layer 4: DCS</span>
                  <p className="font-semibold text-amber-900 mt-1">Final Approval</p>
                  <p className="text-[11px] text-amber-700">Chairman (DCS)</p>
                </div>
              </div>
            </div>

            {/* Pending Approvals Data Grid */}
            <div className="soft-slate-card p-0 overflow-hidden">
              <div className="p-4 bg-slate-100 border-b border-slate-200 flex flex-wrap justify-between items-center gap-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Pending Approval Queue (Role View: {viewAsRole})
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search document QRN..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white border border-slate-300 text-slate-900 rounded px-3 py-1 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="soft-slate-data-grid">
                  <thead>
                    <tr>
                      <th>Document QRN / Ref</th>
                      <th>Document Type</th>
                      <th>Maker</th>
                      <th>Reviewer (Mktg)</th>
                      <th>GM Status</th>
                      <th>DCS (Chairman)</th>
                      <th className="text-right">Total Amount</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="font-mono font-bold text-blue-700">QRN20240415037</td>
                      <td>Sales Quotation</td>
                      <td>Sales Officer</td>
                      <td><span className="badge-green px-2 py-0.5 rounded text-xs font-semibold"><Check className="w-3 h-3 inline" /> Approved</span></td>
                      <td><span className="badge-green px-2 py-0.5 rounded text-xs font-semibold"><Check className="w-3 h-3 inline" /> Approved</span></td>
                      <td><span className="badge-amber px-2 py-0.5 rounded text-xs font-semibold animate-pulse"><Clock className="w-3 h-3 inline" /> Pending DCS</span></td>
                      <td className="text-right font-bold text-slate-900">₱31,500.00</td>
                      <td className="text-center space-x-1.5">
                        <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded text-xs font-semibold shadow transition">
                          Approve
                        </button>
                        <button className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-xs font-semibold shadow transition">
                          Reject
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="font-mono font-bold text-blue-700">PO-2026-0891</td>
                      <td>Purchase Order</td>
                      <td>Purchasing Officer</td>
                      <td><span className="badge-blue px-2 py-0.5 rounded text-xs font-semibold">Reviewed</span></td>
                      <td><span className="badge-amber px-2 py-0.5 rounded text-xs font-semibold">Pending GM</span></td>
                      <td><span className="badge-blue px-2 py-0.5 rounded text-xs font-semibold">Awaiting Tier</span></td>
                      <td className="text-right font-bold text-slate-900">₱142,000.00</td>
                      <td className="text-center space-x-1.5">
                        <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded text-xs font-semibold shadow transition">
                          Approve
                        </button>
                        <button className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-xs font-semibold shadow transition">
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
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-600" />
                  Multi-Location Inventory Management
                </h2>
                <p className="text-xs text-slate-500">Tracking stock across Quezon City and Pampanga warehouses</p>
              </div>
              <button
                onClick={() => setIsScannerOpen(true)}
                className="btn-primary-blue text-xs"
              >
                <Camera className="w-4 h-4" />
                Scan Barcode
              </button>
            </div>

            <div className="soft-slate-card p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="soft-slate-data-grid">
                  <thead>
                    <tr>
                      <th>SKU / Barcode</th>
                      <th>Item Description</th>
                      <th>Location</th>
                      <th>Batch / Lot</th>
                      <th>Expiry Date</th>
                      <th className="text-right">On Hand</th>
                      <th className="text-right">Reserved (3-Day Expiry)</th>
                      <th className="text-right">Available</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="font-mono font-bold text-blue-700">ACC-BACT-01</td>
                      <td className="font-medium">Calibration Sticks Bact Alert</td>
                      <td>Pampanga</td>
                      <td className="font-mono text-slate-600">LOT-2026-A9</td>
                      <td><span className="badge-green px-2 py-0.5 rounded text-xs font-semibold">2027-11-30</span></td>
                      <td className="text-right font-bold text-slate-900">45 Kits</td>
                      <td className="text-right text-amber-700 font-bold">5 Kits</td>
                      <td className="text-right text-emerald-700 font-bold">40 Kits</td>
                    </tr>
                    <tr>
                      <td className="font-mono font-bold text-blue-700">ACC-REAG-04</td>
                      <td className="font-medium">Blood Chemistry Reagents Kit</td>
                      <td>Quezon City</td>
                      <td className="font-mono text-slate-600">LOT-2026-B2</td>
                      <td><span className="badge-amber px-2 py-0.5 rounded text-xs font-semibold">2026-09-15 (Near Expiry)</span></td>
                      <td className="text-right font-bold text-slate-900">120 Boxes</td>
                      <td className="text-right text-amber-700 font-bold">20 Boxes</td>
                      <td className="text-right text-emerald-700 font-bold">100 Boxes</td>
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
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Sales Quotation Generator & Approval Routing
                </h2>
                <p className="text-xs text-slate-500">Flow: Client → Sales RFQ → Marketing (Reviewer) → GM → DCS</p>
              </div>
              <button
                onClick={() => window.print()}
                className="btn-danger-red text-xs"
              >
                <Download className="w-4 h-4" />
                Print / Export Quotation
              </button>
            </div>

            {/* Rendered Quotation PDF Preview */}
            <div className="bg-slate-300 p-4 md:p-6 rounded border border-slate-400 overflow-x-auto shadow-sm">
              <QuotationPDF data={sampleQuotation} />
            </div>
          </div>
        )}

        {/* TAB 4: STATEMENT OF ACCOUNT (SOA) */}
        {activeTab === 'soa' && (
          <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-blue-600" />
                  Statement of Account (SOA) Module
                </h2>
                <p className="text-xs text-slate-500">Client Aging, DR numbers, and Running Balances</p>
              </div>
              <button
                onClick={() => window.print()}
                className="btn-danger-red text-xs"
              >
                <Download className="w-4 h-4" />
                Print / Export SOA
              </button>
            </div>

            {/* Rendered SOA PDF Preview */}
            <div className="bg-slate-300 p-4 md:p-6 rounded border border-slate-400 overflow-x-auto shadow-sm">
              <StatementOfAccountPDF data={sampleSOA} />
            </div>
          </div>
        )}

        {/* TAB 5: PURCHASING */}
        {activeTab === 'purchasing' && (
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              Purchasing & Receiving Report (3-Way Match & Fraud Control)
            </h2>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded text-xs text-amber-900 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="font-bold uppercase">PO Over-Receiving Rule Enforced:</p>
                <p>Receiving is strictly hard-blocked beyond approved Purchase Order quantities. Any excess quantity requires a formal, approved PO revision.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: REQUEST FOR PAYMENT */}
        {activeTab === 'rfp' && (
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-600" />
              Request for Payment (RFP) - Non-PO Expenses
            </h2>
            <p className="text-xs text-slate-500">Select GL Account from maintained list & route for approval.</p>
          </div>
        )}

        {/* TAB 7: ADMIN */}
        {activeTab === 'admin' && (
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-600" />
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
