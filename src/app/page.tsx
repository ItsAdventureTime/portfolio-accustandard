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
  Server,
  Trash2,
  Edit,
  X,
  Compass,
  Home,
  Menu
} from 'lucide-react';
import { BarcodeScannerModal } from '@/components/scanner/BarcodeScannerModal';
import { CommandPaletteModal } from '@/components/navigation/CommandPaletteModal';
import { MobileNavDrawer } from '@/components/navigation/MobileNavDrawer';
import { QuotationPDF, QuotationData } from '@/components/documents/QuotationPDF';
import { StatementOfAccountPDF, SOAData } from '@/components/documents/StatementOfAccountPDF';
import { useDemoStore, DEFAULT_INVENTORY, DEFAULT_APPROVALS, DEFAULT_SOA_ROWS, DEFAULT_AUDIT_LOGS } from '@/lib/useDemoStore';
import { exportToCSV } from '@/lib/exportUtils';

// Types for Simulator Engine
interface InventoryItem {
  id: string;
  sku: string;
  description: string;
  location: 'Quezon City' | 'Pampanga';
  lotNumber: string;
  expiryDate: string;
  onHand: number;
  reserved: number;
  unit: string;
  status: 'NORMAL' | 'NEAR_EXPIRY' | 'LOW_STOCK';
}

interface ApprovalDoc {
  id: string;
  qrn: string;
  type: 'Sales Quotation' | 'Purchase Order' | 'Request for Payment';
  maker: string;
  reviewerStatus: 'APPROVED' | 'PENDING' | 'REJECTED';
  gmStatus: 'APPROVED' | 'PENDING' | 'AWAITING';
  dcsStatus: 'APPROVED' | 'PENDING' | 'AWAITING';
  totalAmount: number;
}

interface SOARowItem {
  id: string;
  salesInvoiceNo: string;
  drNo: string;
  siDate: string;
  dueDate: string;
  ageDays: number;
  invoiceAmount: number;
  amountPaid: number;
  invoiceBalance: number;
  runningBalance: number;
}

export default function DashboardHome() {
  const { secondsRemaining, formatTimer, resetDemoData } = useDemoStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'quotations' | 'soa' | 'purchasing' | 'rfp' | 'admin'>('overview');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [viewAsRole, setViewAsRole] = useState<string>('Chairman (DCS)');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals for CRUD Simulator
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [isAddSOARowOpen, setIsAddSOARowOpen] = useState(false);
  const [isPOReceivingModalOpen, setIsPOReceivingModalOpen] = useState(false);

  // Interactive Lists
  const [inventoryList, setInventoryList] = useState<InventoryItem[]>(DEFAULT_INVENTORY as any);
  const [approvalsList, setApprovalsList] = useState<ApprovalDoc[]>(DEFAULT_APPROVALS as any);
  const [soaData, setSoaData] = useState<SOAData>({
    statementDate: '10-Jul-26',
    clientName: 'GATCHALIAN MEDICAL LABORATORY',
    terms: '30 Days',
    salesperson: 'Sir. Roel Macaraeg',
    rows: DEFAULT_SOA_ROWS as any,
    preparedBy: 'Marrione Fuentes',
    preparedByTitle: 'Accounting Officer',
  });
  const [auditLogs, setAuditLogs] = useState<Array<{ id: string; time: string; user: string; action: string }>>(DEFAULT_AUDIT_LOGS);

  // Handle Manual or Auto Reset
  const handleRestoreDefaultState = () => {
    resetDemoData();
    setInventoryList(DEFAULT_INVENTORY as any);
    setApprovalsList(DEFAULT_APPROVALS as any);
    setSoaData((prev) => ({ ...prev, rows: DEFAULT_SOA_ROWS as any }));
    setAuditLogs(DEFAULT_AUDIT_LOGS);
    setToastMessage('Demo state restored to pristine default data!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Toast Helper
  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const addAuditLog = (action: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAuditLogs((prev) => [{ id: Date.now().toString(), time: timeStr, user: viewAsRole, action }, ...prev]);
  };

  // Interactive Quotation PDF State
  const [quotationData, setQuotationData] = useState<QuotationData>({
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
  });

  // New Stock Form Handler
  const [newStockSku, setNewStockSku] = useState('');
  const [newStockDesc, setNewStockDesc] = useState('');
  const [newStockLoc, setNewStockLoc] = useState<'Quezon City' | 'Pampanga'>('Quezon City');
  const [newStockLot, setNewStockLot] = useState('');
  const [newStockQty, setNewStockQty] = useState(50);

  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStockSku || !newStockDesc) return;
    const newItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      sku: newStockSku.toUpperCase(),
      description: newStockDesc,
      location: newStockLoc,
      lotNumber: newStockLot || `LOT-2026-${Math.floor(100 + Math.random() * 900)}`,
      expiryDate: '2027-12-31',
      onHand: Number(newStockQty),
      reserved: 0,
      unit: 'Units',
      status: 'NORMAL',
    };
    setInventoryList((prev) => [newItem, ...prev]);
    addAuditLog(`Added Stock Item ${newItem.sku} (${newItem.description}) to ${newItem.location}`);
    showNotification(`Successfully added ${newItem.sku} to ${newItem.location}!`);
    setIsAddStockOpen(false);
    setNewStockSku('');
    setNewStockDesc('');
  };

  const handleDeleteStock = (id: string, sku: string) => {
    setInventoryList((prev) => prev.filter((item) => item.id !== id));
    addAuditLog(`Removed Stock Item ${sku}`);
    showNotification(`Stock Item ${sku} removed.`);
  };

  const handleApproveDoc = (id: string, qrn: string) => {
    setApprovalsList((prev) =>
      prev.map((doc) => {
        if (doc.id === id) {
          if (viewAsRole.includes('Marketing')) return { ...doc, reviewerStatus: 'APPROVED' };
          if (viewAsRole.includes('General Manager')) return { ...doc, gmStatus: 'APPROVED' };
          if (viewAsRole.includes('Chairman') || viewAsRole.includes('Admin')) return { ...doc, dcsStatus: 'APPROVED' };
        }
        return doc;
      })
    );
    addAuditLog(`Approved ${qrn} under role [${viewAsRole}]`);
    showNotification(`Document ${qrn} approved by ${viewAsRole}!`);
  };

  const handleRejectDoc = (id: string, qrn: string) => {
    setApprovalsList((prev) => prev.filter((doc) => doc.id !== id));
    addAuditLog(`Rejected ${qrn} under role [${viewAsRole}]`);
    showNotification(`Document ${qrn} rejected.`);
  };

  const [newSiNo, setNewSiNo] = useState('');
  const [newDrNo, setNewDrNo] = useState('');
  const [newInvoiceAmt, setNewInvoiceAmt] = useState(15000);

  const handleAddSOARow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSiNo || !newDrNo) return;
    const amt = Number(newInvoiceAmt);
    const lastRunning = soaData.rows.length > 0 ? soaData.rows[soaData.rows.length - 1].runningBalance : 0;
    const newRow: SOARowItem = {
      id: `soa-${Date.now()}`,
      salesInvoiceNo: newSiNo,
      drNo: newDrNo,
      siDate: '01-Aug-26',
      dueDate: '8/31/2026',
      ageDays: 1,
      invoiceAmount: amt,
      amountPaid: 0,
      invoiceBalance: amt,
      runningBalance: lastRunning + amt,
    };
    setSoaData((prev) => ({ ...prev, rows: [...prev.rows, newRow] }));
    addAuditLog(`Added Invoice SI #${newSiNo} / DR #${newDrNo} for ₱${amt.toLocaleString()} to SOA`);
    showNotification(`Added Invoice SI #${newSiNo} to SOA statement!`);
    setIsAddSOARowOpen(false);
    setNewSiNo('');
    setNewDrNo('');
  };

  const [receivingQtyInput, setReceivingQtyInput] = useState(150);
  const approvedPOQty = 100;
  const [poErrorMsg, setPoErrorMsg] = useState<string | null>(null);

  const handleTestPOReceiving = (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(receivingQtyInput) > approvedPOQty) {
      setPoErrorMsg(`HARD-BLOCKED: Attempting to receive ${receivingQtyInput} units exceeds approved PO limit of ${approvedPOQty} units!`);
      addAuditLog(`PO Over-Receiving Hard-Blocked (${receivingQtyInput} > ${approvedPOQty})`);
    } else {
      setPoErrorMsg(null);
      addAuditLog(`Successfully received ${receivingQtyInput} units for PO-2026-0891`);
      showNotification(`Received ${receivingQtyInput} units. 3-Way Match Verified!`);
      setIsPOReceivingModalOpen(false);
    }
  };

  const filteredInventory = inventoryList.filter(
    (item) =>
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Tab Breadcrumb Title Helper for Zero-Confusion Wayfinding
  const getTabBreadcrumb = () => {
    switch (activeTab) {
      case 'overview':
        return 'Executive Overview & Pending Approvals Queue';
      case 'inventory':
        return 'Multi-Location Inventory Management (Quezon City & Pampanga)';
      case 'quotations':
        return 'Sales Quotation Generator & 3-Day Stock Reservation Engine';
      case 'soa':
        return 'Statement of Account (SOA) & Client Aging Ledger';
      case 'purchasing':
        return 'Purchasing & Receiving Report (3-Way Match Fraud Control)';
      case 'rfp':
        return 'Request for Payment (RFP) Non-PO Expenses';
      case 'admin':
        return 'Immutable System Audit Log Stream';
      default:
        return 'Executive Overview';
    }
  };

  return (
    <div className="min-h-screen bg-[#e2e8f0] text-[#1e293b] flex flex-col font-sans relative">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Predictable Navigation Top Shell Header */}
      <header className="wayfinding-header px-4 md:px-6 py-3 flex flex-wrap justify-between items-center gap-4">
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

        {/* View As Impersonation & Auto-Reset Timer Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 bg-slate-100 border border-slate-300 px-3 py-1.5 rounded text-xs shadow-inner">
            <Eye className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-slate-700 font-medium hidden md:inline">Simulate Role:</span>
            <select
              value={viewAsRole}
              onChange={(e) => {
                setViewAsRole(e.target.value);
                showNotification(`Switched role simulator to: ${e.target.value}`);
                addAuditLog(`Impersonated role: ${e.target.value}`);
              }}
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

          {/* 15-Minute Auto-Reset Countdown Badge */}
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-300 px-2.5 py-1.5 rounded text-xs text-amber-900 font-medium">
            <RefreshCcw className="w-3.5 h-3.5 text-amber-700 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="hidden xl:inline">Auto-Reset:</span>
            <span className="font-mono font-bold text-amber-800">{formatTimer()}</span>
            <button
              onClick={handleRestoreDefaultState}
              className="ml-1 text-[10px] bg-amber-200 hover:bg-amber-300 text-amber-900 px-1.5 py-0.5 rounded font-bold transition"
              title="Reset Demo Data Back to Default Seed State"
            >
              Reset Data
            </button>
          </div>
        </div>

        {/* Actions & Barcode Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 px-3 py-1.5 rounded text-xs transition"
          >
            <Search className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline font-semibold">Quick Search & Jump</span>
            <kbd className="bg-white text-slate-700 text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-300 shadow-xs">⌘K</kbd>
          </button>
          <div className="hidden lg:flex items-center gap-2 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded">
            <Server className="w-3.5 h-3.5 text-emerald-700" />
            <span>QBO API Live Sync</span>
          </div>
          <button
            onClick={() => setIsScannerOpen(true)}
            className="hidden sm:inline-flex btn-danger-red text-xs active:scale-95 transition touch-target"
          >
            <Camera className="w-4 h-4" />
            <span>Mobile Barcode Scanner</span>
          </button>
          {/* Mobile Hamburger Menu Toggle Button */}
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="md:hidden p-2 text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg touch-target flex items-center justify-center"
            aria-label="Open Mobile Menu"
          >
            <Menu className="w-6 h-6 text-blue-900" />
          </button>
        </div>
      </header>

      {/* Predictable Horizontal Top Navigation Bar (Hidden on Mobile <md to avoid duplicate menus) */}
      <nav className="hidden md:flex wayfinding-nav-strip px-4 md:px-6 overflow-x-auto no-scrollbar whitespace-nowrap gap-1 text-xs font-semibold text-slate-600">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-4 transition border-b-2 flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'border-blue-600 text-blue-700 font-bold bg-white'
              : 'border-transparent hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <Layers className="w-4 h-4 text-blue-600" />
          <span>Executive Overview</span>
          <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-blue-100 text-blue-800 rounded-full font-bold">{approvalsList.length}</span>
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
          <span>Inventory (QC & Pampanga)</span>
          <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-emerald-100 text-emerald-800 rounded-full font-bold">{inventoryList.length}</span>
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
          <span>Quotation Generator</span>
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
          <span>Statement of Account (SOA)</span>
          <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-blue-100 text-blue-800 rounded-full font-bold">{soaData.rows.length}</span>
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
          <span>Purchasing & 3-Way Match</span>
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
          <span>Request for Payment</span>
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
          <span>Audit Log Stream</span>
          <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-slate-200 text-slate-800 rounded-full font-bold">{auditLogs.length}</span>
        </button>
      </nav>

      {/* Predictable Context Breadcrumb Bar (Zero Confusion Wayfinding) */}
      <div className="bg-slate-100 border-b border-slate-300 px-4 md:px-6 py-2 flex items-center gap-2 text-xs text-slate-600">
        <Home className="w-3.5 h-3.5 text-blue-700" />
        <span className="font-semibold text-slate-800">Accustanda ERP</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-bold text-blue-800">{getTabBreadcrumb()}</span>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* TAB 1: EXECUTIVE OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="wayfinding-card p-5 relative overflow-hidden">
                <div className="flex justify-between items-center text-slate-500 text-xs mb-2">
                  <span className="font-semibold uppercase tracking-wider">Quezon City Warehouse</span>
                  <Box className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-3xl font-extrabold text-slate-900">
                  {inventoryList.filter((i) => i.location === 'Quezon City').reduce((acc, i) => acc + i.onHand, 0)}{' '}
                  <span className="text-xs font-normal text-slate-500">Units</span>
                </p>
                <div className="my-2 h-6 w-full">
                  <svg className="w-full h-full stroke-blue-600 fill-none stroke-2" viewBox="0 0 100 25">
                    <path d="M0,20 Q25,5 50,15 T100,5" />
                  </svg>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <div className="mt-2.5 flex justify-between text-[11px]">
                  <span className="text-emerald-700 font-semibold">
                    Available: {inventoryList.filter((i) => i.location === 'Quezon City').reduce((acc, i) => acc + (i.onHand - i.reserved), 0)}
                  </span>
                  <span className="text-amber-700 font-semibold">
                    Reserved: {inventoryList.filter((i) => i.location === 'Quezon City').reduce((acc, i) => acc + i.reserved, 0)}
                  </span>
                </div>
              </div>

              <div className="wayfinding-card p-5 relative overflow-hidden">
                <div className="flex justify-between items-center text-slate-500 text-xs mb-2">
                  <span className="font-semibold uppercase tracking-wider">Pampanga Warehouse</span>
                  <Box className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-3xl font-extrabold text-slate-900">
                  {inventoryList.filter((i) => i.location === 'Pampanga').reduce((acc, i) => acc + i.onHand, 0)}{' '}
                  <span className="text-xs font-normal text-slate-500">Units</span>
                </p>
                <div className="my-2 h-6 w-full">
                  <svg className="w-full h-full stroke-emerald-600 fill-none stroke-2" viewBox="0 0 100 25">
                    <path d="M0,15 Q25,20 50,10 T100,2" />
                  </svg>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '84%' }}></div>
                </div>
                <div className="mt-2.5 flex justify-between text-[11px]">
                  <span className="text-emerald-700 font-semibold">
                    Available: {inventoryList.filter((i) => i.location === 'Pampanga').reduce((acc, i) => acc + (i.onHand - i.reserved), 0)}
                  </span>
                  <span className="text-amber-700 font-semibold">
                    Reserved: {inventoryList.filter((i) => i.location === 'Pampanga').reduce((acc, i) => acc + i.reserved, 0)}
                  </span>
                </div>
              </div>

              <div className="wayfinding-card p-5 relative overflow-hidden">
                <div className="flex justify-between items-center text-slate-500 text-xs mb-2">
                  <span className="font-semibold uppercase tracking-wider">Pending Approvals</span>
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <p className="text-3xl font-extrabold text-amber-600">
                  {approvalsList.length} <span className="text-xs font-normal text-amber-700">Docs</span>
                </p>
                <div className="my-2 text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200">
                  <span>Simulating Role: <strong className="text-slate-900">{viewAsRole}</strong></span>
                </div>
                <div className="mt-1 text-[11px] text-slate-500 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                  <span>COSO 4-Layer Approval Matrix</span>
                </div>
              </div>

              <div className="wayfinding-card p-5 relative overflow-hidden">
                <div className="flex justify-between items-center text-slate-500 text-xs mb-2">
                  <span className="font-semibold uppercase tracking-wider">Gross Margin Avg</span>
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-3xl font-extrabold text-emerald-700">34.8%</p>
                <div className="my-2 h-6 w-full">
                  <svg className="w-full h-full stroke-emerald-600 fill-none stroke-2" viewBox="0 0 100 25">
                    <path d="M0,22 Q25,18 50,8 T100,2" />
                  </svg>
                </div>
                <div className="mt-1 text-[11px] text-slate-500">
                  <span>Batch FEFO cost basis tracking</span>
                </div>
              </div>
            </div>

            {/* COSO Stepper Tracker */}
            <div className="wayfinding-card p-5 space-y-4">
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
            {/* Desktop View: Tabular Approval Grid (Hidden on Mobile <sm) */}
            <div className="wayfinding-card p-0 overflow-hidden hidden sm:block">
              <div className="p-4 bg-slate-100 border-b border-slate-200 flex flex-wrap justify-between items-center gap-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Pending Approval Queue (Role View: {viewAsRole})
                  </h3>
                </div>
              </div>

              <div className="table-responsive-wrapper">
                <table className="wayfinding-grid">
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
                    {approvalsList.map((doc) => (
                      <tr key={doc.id}>
                        <td className="font-mono font-bold text-blue-700">{doc.qrn}</td>
                        <td>{doc.type}</td>
                        <td>{doc.maker}</td>
                        <td>
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${doc.reviewerStatus === 'APPROVED' ? 'badge-green' : 'badge-amber'}`}>
                            {doc.reviewerStatus}
                          </span>
                        </td>
                        <td>
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${doc.gmStatus === 'APPROVED' ? 'badge-green' : 'badge-amber'}`}>
                            {doc.gmStatus}
                          </span>
                        </td>
                        <td>
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${doc.dcsStatus === 'APPROVED' ? 'badge-green' : 'badge-amber'}`}>
                            {doc.dcsStatus}
                          </span>
                        </td>
                        <td className="text-right font-bold text-slate-900">₱{doc.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                        <td className="text-center space-x-1.5">
                          <button
                            onClick={() => handleApproveDoc(doc.id, doc.qrn)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded text-xs font-semibold shadow transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectDoc(doc.id, doc.qrn)}
                            className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-xs font-semibold shadow transition"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile View: Stacked Approval Cards (Visible only on Mobile <sm) */}
            <div className="space-y-3 sm:hidden">
              <div className="p-3 bg-slate-100 border border-slate-300 rounded-lg flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Pending Approvals ({approvalsList.length})</span>
                </h3>
                <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">{viewAsRole}</span>
              </div>

              {approvalsList.map((doc) => (
                <div key={doc.id} className="wayfinding-card p-4 space-y-3 border-l-4 border-l-amber-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono font-extrabold text-blue-700 text-sm block">{doc.qrn}</span>
                      <span className="text-xs font-bold text-slate-900 mt-0.5 block">{doc.type}</span>
                    </div>
                    <span className="text-sm font-extrabold text-slate-900">
                      ₱{doc.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 text-[10px] bg-slate-50 p-2.5 rounded border border-slate-200 text-center font-semibold">
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">Reviewer</span>
                      <span className={`px-1.5 py-0.5 rounded ${doc.reviewerStatus === 'APPROVED' ? 'badge-green' : 'badge-amber'}`}>
                        {doc.reviewerStatus}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">GM Status</span>
                      <span className={`px-1.5 py-0.5 rounded ${doc.gmStatus === 'APPROVED' ? 'badge-green' : 'badge-amber'}`}>
                        {doc.gmStatus}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">DCS Status</span>
                      <span className={`px-1.5 py-0.5 rounded ${doc.dcsStatus === 'APPROVED' ? 'badge-green' : 'badge-amber'}`}>
                        {doc.dcsStatus}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleApproveDoc(doc.id, doc.qrn)}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded text-xs font-extrabold shadow transition text-center"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectDoc(doc.id, doc.qrn)}
                      className="w-full bg-red-600 hover:bg-red-500 text-white py-2 rounded text-xs font-extrabold shadow transition text-center"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
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
                  Multi-Location Inventory Management (QC & Pampanga)
                </h2>
                <p className="text-xs text-slate-500">Live Stock Items: {inventoryList.length} SKUs maintained</p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Filter inventory SKU or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white border border-slate-300 text-slate-900 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={() => {
                    exportToCSV('accustanda_inventory_report.csv', inventoryList);
                    showNotification('Downloaded Inventory CSV Report!');
                    addAuditLog('Exported Inventory CSV Report');
                  }}
                  className="btn-danger-red text-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={() => setIsAddStockOpen(true)}
                  className="btn-primary-blue text-xs"
                >
                  <Plus className="w-4 h-4" />
                  Add Stock Batch
                </button>
              </div>
            </div>

            {/* Desktop View: Tabular Grid (Hidden on Mobile <sm) */}
            <div className="wayfinding-card p-0 overflow-hidden hidden sm:block">
              <div className="table-responsive-wrapper">
                <table className="wayfinding-grid">
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
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInventory.map((item) => (
                      <tr key={item.id}>
                        <td className="font-mono font-bold text-blue-700">{item.sku}</td>
                        <td className="font-medium">{item.description}</td>
                        <td>
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${item.location === 'Quezon City' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                            {item.location}
                          </span>
                        </td>
                        <td className="font-mono text-slate-600">{item.lotNumber}</td>
                        <td>
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${item.status === 'NEAR_EXPIRY' ? 'badge-amber' : 'badge-green'}`}>
                            {item.expiryDate} {item.status === 'NEAR_EXPIRY' && '(Near Expiry)'}
                          </span>
                        </td>
                        <td className="text-right font-bold text-slate-900">{item.onHand} {item.unit}</td>
                        <td className="text-right text-amber-700 font-bold">{item.reserved} {item.unit}</td>
                        <td className="text-right text-emerald-700 font-bold">{item.onHand - item.reserved} {item.unit}</td>
                        <td className="text-center">
                          <button
                            onClick={() => handleDeleteStock(item.id, item.sku)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Remove Stock Entry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile View: Stacked Stock Cards (Visible only on Mobile <sm) */}
            <div className="space-y-3 sm:hidden">
              {filteredInventory.map((item) => (
                <div key={item.id} className="wayfinding-card p-4 space-y-3 border-l-4 border-l-blue-600">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono font-extrabold text-blue-700 text-sm block">{item.sku}</span>
                      <h4 className="font-bold text-slate-900 text-xs mt-0.5">{item.description}</h4>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${item.location === 'Quezon City' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                      {item.location}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded border border-slate-200">
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block uppercase">Batch / Lot</span>
                      <span className="font-mono font-semibold text-slate-800">{item.lotNumber}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block uppercase">Expiry Date</span>
                      <span className={`font-semibold ${item.status === 'NEAR_EXPIRY' ? 'text-amber-700' : 'text-slate-800'}`}>
                        {item.expiryDate}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs pt-1">
                    <div className="flex gap-3">
                      <div>
                        <span className="text-[10px] text-slate-500 block">On Hand</span>
                        <span className="font-extrabold text-slate-900">{item.onHand} {item.unit}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Available</span>
                        <span className="font-extrabold text-emerald-700">{item.onHand - item.reserved} {item.unit}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteStock(item.id, item.sku)}
                      className="px-3 py-1 bg-red-50 text-red-700 font-semibold rounded border border-red-200 hover:bg-red-100 transition text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
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
                  Sales Quotation Generator & 3-Day Stock Reservation Engine
                </h2>
                <p className="text-xs text-slate-500">Flow: Client RFQ → Sales → Marketing (Reviewer) → GM → DCS</p>
              </div>
              <button
                onClick={() => window.print()}
                className="btn-danger-red text-xs"
              >
                <Download className="w-4 h-4" />
                Print / Export Quotation
              </button>
            </div>

            {/* Mobile Scroll Hint Banner */}
            <div className="md:hidden bg-blue-50 border border-blue-200 text-blue-900 p-2.5 rounded-lg text-xs flex items-center justify-between font-medium">
              <span>📱 Mobile Document Preview — Swipe horizontally to view full A4 Document</span>
              <span className="font-bold">➔ Swipe</span>
            </div>

            <div className="bg-slate-300 p-2 sm:p-6 rounded border border-slate-400 overflow-x-auto shadow-sm flex justify-start md:justify-center">
              <QuotationPDF data={quotationData} />
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
                <p className="text-xs text-slate-500">DR # Tracking, Client Aging, and Running Balances</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsAddSOARowOpen(true)}
                  className="btn-primary-blue text-xs"
                >
                  <Plus className="w-4 h-4" />
                  Add Invoice Row
                </button>
                <button
                  onClick={() => window.print()}
                  className="btn-danger-red text-xs"
                >
                  <Download className="w-4 h-4" />
                  Print / Export SOA
                </button>
              </div>
            </div>

            {/* Mobile Scroll Hint Banner */}
            <div className="md:hidden bg-blue-50 border border-blue-200 text-blue-900 p-2.5 rounded-lg text-xs flex items-center justify-between font-medium">
              <span>📱 Mobile Document Preview — Swipe horizontally to view full A4 Document</span>
              <span className="font-bold">➔ Swipe</span>
            </div>

            <div className="bg-slate-300 p-2 sm:p-6 rounded border border-slate-400 overflow-x-auto shadow-sm flex justify-start md:justify-center">
              <StatementOfAccountPDF data={soaData} />
            </div>
          </div>
        )}

        {/* TAB 5: PURCHASING */}
        {activeTab === 'purchasing' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                Purchasing & Receiving Report (3-Way Match & Fraud Control)
              </h2>
              <button
                onClick={() => setIsPOReceivingModalOpen(true)}
                className="btn-primary-blue text-xs"
              >
                <Plus className="w-4 h-4" />
                Test PO Receiving Rule
              </button>
            </div>

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

        {/* TAB 7: ADMIN & AUDIT LOG STREAM */}
        {activeTab === 'admin' && (
          <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-600" />
                Immutable System Audit Log Stream ({auditLogs.length} Events Logged)
              </h2>
              <button
                onClick={() => {
                  exportToCSV('accustanda_audit_trail_report.csv', auditLogs);
                  showNotification('Downloaded Audit Trail CSV Report!');
                }}
                className="btn-danger-red text-xs"
              >
                <Download className="w-4 h-4" />
                <span>Export Audit CSV</span>
              </button>
            </div>

            <div className="wayfinding-card p-4 space-y-2 font-mono text-xs">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-blue-700 font-bold">{log.time}</span>
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-800 rounded font-sans text-[11px] font-semibold">{log.user}</span>
                    <span className="text-slate-900">{log.action}</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold font-sans">✓ LOGGED</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MODAL 1: Add New Stock Batch Modal */}
      {isAddStockOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-300 mobile-modal-container">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold uppercase text-slate-900">Add New Stock Batch</h3>
              <button onClick={() => setIsAddStockOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStock} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">SKU / Barcode Code</label>
                <input
                  type="text"
                  placeholder="e.g. ACC-HEMA-10"
                  value={newStockSku}
                  onChange={(e) => setNewStockSku(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Item Description</label>
                <input
                  type="text"
                  placeholder="e.g. Rapid Dengue NS1 Ag Test Cassette 25s"
                  value={newStockDesc}
                  onChange={(e) => setNewStockDesc(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Warehouse Location</label>
                  <select
                    value={newStockLoc}
                    onChange={(e) => setNewStockLoc(e.target.value as any)}
                    className="w-full border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Quezon City">Quezon City</option>
                    <option value="Pampanga">Pampanga</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Initial Quantity</label>
                  <input
                    type="number"
                    value={newStockQty}
                    onChange={(e) => setNewStockQty(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddStockOpen(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-800 font-semibold rounded hover:bg-slate-300"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary-blue">
                  Add Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Add Invoice Row to SOA Modal */}
      {isAddSOARowOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-300 mobile-modal-container">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold uppercase text-slate-900">Add Invoice Row to SOA</h3>
              <button onClick={() => setIsAddSOARowOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSOARow} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Sales Invoice No. (SI #)</label>
                <input
                  type="text"
                  placeholder="e.g. 6140"
                  value={newSiNo}
                  onChange={(e) => setNewSiNo(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Delivery Receipt No. (DR #)</label>
                <input
                  type="text"
                  placeholder="e.g. 6132"
                  value={newDrNo}
                  onChange={(e) => setNewDrNo(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Invoice Amount (₱)</label>
                <input
                  type="number"
                  value={newInvoiceAmt}
                  onChange={(e) => setNewInvoiceAmt(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddSOARowOpen(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-800 font-semibold rounded hover:bg-slate-300"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary-blue">
                  Add Invoice Row
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Test PO Over-Receiving Simulator Modal */}
      {isPOReceivingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-300 mobile-modal-container">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold uppercase text-slate-900">PO Over-Receiving Simulator</h3>
              <button onClick={() => setIsPOReceivingModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTestPOReceiving} className="space-y-3 text-xs">
              <div className="p-3 bg-blue-50 border-l-4 border-blue-600 text-blue-900 rounded">
                <p className="font-bold">Purchase Order Reference: PO-2026-0891</p>
                <p>Approved Quantity: <strong>100 Kits</strong></p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Attempted Receiving Quantity</label>
                <input
                  type="number"
                  value={receivingQtyInput}
                  onChange={(e) => setReceivingQtyInput(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 font-bold"
                  required
                />
              </div>

              {poErrorMsg && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-900 font-bold rounded flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                  <span>{poErrorMsg}</span>
                </div>
              )}

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPOReceivingModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-800 font-semibold rounded hover:bg-slate-300"
                >
                  Close
                </button>
                <button type="submit" className="btn-danger-red">
                  Simulate Receiving
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Barcode Scanner Modal */}
      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={(scannedCode) => {
          showNotification(`Scanned Barcode SKU: ${scannedCode}`);
          addAuditLog(`Scanned Barcode SKU: ${scannedCode}`);
        }}
      />

      {/* Cmd+K Quick Search Command Palette Modal */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={(tabKey) => {
          setActiveTab(tabKey);
          showNotification(`Navigated to section: ${tabKey}`);
        }}
      />

      {/* Mobile Navigation Slide-Over Drawer */}
      <MobileNavDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        activeTab={activeTab}
        onSelectTab={(tabKey) => {
          setActiveTab(tabKey);
          showNotification(`Navigated to: ${tabKey}`);
        }}
        viewAsRole={viewAsRole}
        onChangeRole={(role) => {
          setViewAsRole(role);
          showNotification(`Switched role to: ${role}`);
          addAuditLog(`Impersonated role: ${role}`);
        }}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        approvalsCount={approvalsList.length}
        inventoryCount={inventoryList.length}
        soaCount={soaData.rows.length}
        auditCount={auditLogs.length}
      />

      {/* Mobile Bottom Navigation Bar (Persistent Thumb Zone Navigation for Mobile <768px) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-300 shadow-2xl px-2 py-1.5 flex justify-around items-center text-[10px] font-semibold text-slate-600 no-print">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg transition ${
            activeTab === 'overview' ? 'text-blue-700 font-extrabold bg-blue-50' : 'hover:text-slate-900'
          }`}
        >
          <Layers className="w-5 h-5 mb-0.5 text-blue-600" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg transition ${
            activeTab === 'inventory' ? 'text-emerald-700 font-extrabold bg-emerald-50' : 'hover:text-slate-900'
          }`}
        >
          <Package className="w-5 h-5 mb-0.5 text-emerald-600" />
          <span>Inventory</span>
        </button>

        <button
          onClick={() => setActiveTab('quotations')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg transition ${
            activeTab === 'quotations' || activeTab === 'soa' ? 'text-amber-700 font-extrabold bg-amber-50' : 'hover:text-slate-900'
          }`}
        >
          <FileText className="w-5 h-5 mb-0.5 text-amber-600" />
          <span>Sales</span>
        </button>

        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          className="flex flex-col items-center py-1 px-3 rounded-lg text-slate-700 hover:text-blue-900"
        >
          <Menu className="w-5 h-5 mb-0.5 text-blue-900" />
          <span>More</span>
        </button>
      </div>
    </div>
  );
}
