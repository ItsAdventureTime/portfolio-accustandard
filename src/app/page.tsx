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
import { SystemAlertModal } from '@/components/modals/SystemAlertModal';
import { QuotationPDF, QuotationData } from '@/components/documents/QuotationPDF';
import { StatementOfAccountPDF, SOAData } from '@/components/documents/StatementOfAccountPDF';
import { useDemoStore, DEFAULT_INVENTORY, DEFAULT_APPROVALS, DEFAULT_SOA_ROWS, DEFAULT_PO_LIST, DEFAULT_RFP_LIST, DEFAULT_AUDIT_LOGS } from '@/lib/useDemoStore';
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

interface POItem {
  id: string;
  poNumber: string;
  vendorName: string;
  itemDescription: string;
  poQty: number;
  rrQtyReceived: number;
  invoiceRef: string;
  totalAmount: number;
  status: 'VERIFIED_3WAY' | 'PENDING_RECEIVING' | 'REJECTED';
}

interface RFPItem {
  id: string;
  rfpNumber: string;
  payeeName: string;
  glAccount: string;
  description: string;
  amount: number;
  status: 'APPROVED_DCS' | 'PENDING_GM' | 'PENDING_MKTG' | 'REJECTED';
}

export default function DashboardHome() {
  const { secondsRemaining, formatTimer, resetDemoData } = useDemoStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'quotations' | 'soa' | 'purchasing' | 'rfp' | 'admin'>('overview');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [viewAsRole, setViewAsRole] = useState<string>('Admin');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals for CRUD Simulator
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [isAddSOARowOpen, setIsAddSOARowOpen] = useState(false);
  const [isPOReceivingModalOpen, setIsPOReceivingModalOpen] = useState(false);
  const [isAddPOOpen, setIsAddPOOpen] = useState(false);
  const [isAddRFPOpen, setIsAddRFPOpen] = useState(false);

  // Interactive Lists
  const [inventoryList, setInventoryList] = useState<InventoryItem[]>(DEFAULT_INVENTORY as any);
  const [approvalsList, setApprovalsList] = useState<ApprovalDoc[]>(DEFAULT_APPROVALS as any);
  const [poList, setPoList] = useState<POItem[]>(DEFAULT_PO_LIST as any);
  const [rfpList, setRfpList] = useState<RFPItem[]>(DEFAULT_RFP_LIST as any);
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
    setPoList(DEFAULT_PO_LIST as any);
    setRfpList(DEFAULT_RFP_LIST as any);
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

  // Central Role Authorization Check (COSO Segregation of Duties Control)
  type PermissionAction =
    | 'APPROVE_DOC'
    | 'REJECT_DOC'
    | 'STOCK_MGMT'
    | 'SALES_QUOTATION'
    | 'FINANCE_SOA'
    | 'PO_MGMT'
    | 'RFP_MGMT'
    | 'PO_RECEIVING';

  const checkRolePermission = (action: PermissionAction, detail?: any): { allowed: boolean; message?: string } => {
    if (viewAsRole === 'Admin') return { allowed: true };

    switch (action) {
      case 'STOCK_MGMT': {
        if (viewAsRole === 'Warehouse') return { allowed: true };
        return {
          allowed: false,
          message: `⛔ COSO SoD Violation: Role [${viewAsRole}] is not authorized to alter physical inventory! Only Warehouse or Admin can manage stock.`,
        };
      }
      case 'SALES_QUOTATION': {
        if (['Sales', 'Marketing', 'General Manager'].includes(viewAsRole)) return { allowed: true };
        return {
          allowed: false,
          message: `⛔ COSO SoD Violation: Role [${viewAsRole}] cannot encode or alter Sales Quotations! Only Sales, Marketing, or GM can alter quotations.`,
        };
      }
      case 'FINANCE_SOA': {
        if (viewAsRole === 'Bookkeeper') return { allowed: true };
        return {
          allowed: false,
          message: `⛔ COSO SoD Violation: Role [${viewAsRole}] cannot modify Statement of Account (SOA) ledgers! Only Bookkeeper or Admin can post invoices.`,
        };
      }
      case 'PO_MGMT': {
        if (['General Manager', 'Bookkeeper'].includes(viewAsRole)) return { allowed: true };
        return {
          allowed: false,
          message: `⛔ COSO SoD Violation: Role [${viewAsRole}] cannot generate or delete Purchase Orders (PO)! Only General Manager or Bookkeeper can manage POs.`,
        };
      }
      case 'RFP_MGMT': {
        if (['Bookkeeper', 'General Manager'].includes(viewAsRole)) return { allowed: true };
        return {
          allowed: false,
          message: `⛔ COSO SoD Violation: Role [${viewAsRole}] cannot manage Request for Payment (RFP) vouchers! Only Bookkeeper or GM can manage RFPs.`,
        };
      }
      case 'PO_RECEIVING': {
        if (['Warehouse', 'General Manager'].includes(viewAsRole)) return { allowed: true };
        return {
          allowed: false,
          message: `⛔ COSO SoD Violation: Role [${viewAsRole}] cannot perform Goods Receiving Report (GRR) entries! Only Warehouse or GM can receive shipments.`,
        };
      }
      case 'APPROVE_DOC': {
        const doc = detail;
        if (['Sales', 'Bookkeeper', 'Warehouse'].includes(viewAsRole)) {
          return {
            allowed: false,
            message: `⛔ COSO SoD Violation: Operational role [${viewAsRole}] is strictly prohibited from approving management control documents!`,
          };
        }
        if (doc) {
          if (doc.reviewerStatus === 'PENDING') {
            if (!['Marketing', 'General Manager', 'Chairman (DCS)'].includes(viewAsRole)) {
              return {
                allowed: false,
                message: `⛔ COSO Control Violation: Role [${viewAsRole}] is not authorized for Layer 2 Marketing Review!`,
              };
            }
          } else if (doc.gmStatus === 'PENDING') {
            if (!['General Manager', 'Chairman (DCS)'].includes(viewAsRole)) {
              return {
                allowed: false,
                message: `⛔ COSO Control Violation: Role [${viewAsRole}] is not authorized for Layer 3 General Manager approval!`,
              };
            }
          } else if (doc.dcsStatus === 'PENDING' || doc.dcsStatus === 'AWAITING') {
            if (viewAsRole !== 'Chairman (DCS)') {
              return {
                allowed: false,
                message: `⛔ COSO Control Violation: Only Chairman (DCS) can grant Layer 4 Final Approval!`,
              };
            }
          }
        }
        return { allowed: true };
      }
      case 'REJECT_DOC': {
        if (['Sales', 'Bookkeeper', 'Warehouse'].includes(viewAsRole)) {
          return {
            allowed: false,
            message: `⛔ COSO SoD Violation: Operational role [${viewAsRole}] cannot reject executive approval documents!`,
          };
        }
        return { allowed: true };
      }
      default:
        return { allowed: false, message: `Action not permitted for role ${viewAsRole}` };
    }
  };

  // Symmetrical Deletion & Item Handlers with Role Protection
  const handleRemoveQuotationItem = (itemId: string) => {
    const auth = checkRolePermission('SALES_QUOTATION');
    if (!auth.allowed) {
      showNotification(auth.message || 'Unauthorized');
      addAuditLog(`BLOCKED Quotation Item Removal under role [${viewAsRole}]`);
      return;
    }
    setQuotationData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }));
    addAuditLog('Removed item from Sales Quotation QRN20240415037');
    showNotification('Removed item from Quotation!');
  };

  const [isAddQuotationItemOpen, setIsAddQuotationItemOpen] = useState(false);
  const [newQuotationDesc, setNewQuotationDesc] = useState('');
  const [newQuotationPkg, setNewQuotationPkg] = useState('1 Box');
  const [newQuotationPrice, setNewQuotationPrice] = useState(45000);

  const handleAddQuotationItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuotationDesc) return;
    const auth = checkRolePermission('SALES_QUOTATION');
    if (!auth.allowed) {
      showNotification(auth.message || 'Unauthorized');
      addAuditLog(`BLOCKED Quotation Item Addition under role [${viewAsRole}]`);
      return;
    }
    const newItem = {
      id: `q-${Date.now()}`,
      description: newQuotationDesc,
      packaging: newQuotationPkg,
      unitPrice: Number(newQuotationPrice),
    };
    setQuotationData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
    addAuditLog(`Added quotation item: ${newQuotationDesc} (₱${Number(newQuotationPrice).toLocaleString()})`);
    showNotification('Added new item to Sales Quotation!');
    setIsAddQuotationItemOpen(false);
    setNewQuotationDesc('');
  };

  const handleDeleteSOARow = (rowId: string) => {
    const auth = checkRolePermission('FINANCE_SOA');
    if (!auth.allowed) {
      showNotification(auth.message || 'Unauthorized');
      addAuditLog(`BLOCKED SOA Row Deletion under role [${viewAsRole}]`);
      return;
    }
    setSoaData((prev) => {
      const filtered = prev.rows.filter((r) => r.id !== rowId);
      // Recalculate running balances
      let currentRunning = 0;
      const updatedRows = filtered.map((r) => {
        currentRunning += r.invoiceBalance;
        return { ...r, runningBalance: currentRunning };
      });
      return { ...prev, rows: updatedRows };
    });
    addAuditLog('Deleted invoice row from Statement of Account (SOA)');
    showNotification('Deleted invoice row from SOA ledger!');
  };

  const handleDeletePO = (poId: string) => {
    const auth = checkRolePermission('PO_MGMT');
    if (!auth.allowed) {
      showNotification(auth.message || 'Unauthorized');
      addAuditLog(`BLOCKED PO Deletion under role [${viewAsRole}]`);
      return;
    }
    setPoList((prev) => prev.filter((p) => p.id !== poId));
    addAuditLog('Deleted Purchase Order entry');
    showNotification('Deleted Purchase Order!');
  };

  const handleDeleteRFP = (rfpId: string) => {
    const auth = checkRolePermission('RFP_MGMT');
    if (!auth.allowed) {
      showNotification(auth.message || 'Unauthorized');
      addAuditLog(`BLOCKED RFP Deletion under role [${viewAsRole}]`);
      return;
    }
    setRfpList((prev) => prev.filter((r) => r.id !== rfpId));
    addAuditLog('Deleted RFP Payment Voucher entry');
    showNotification('Deleted Payment Voucher!');
  };

  const [newVendorName, setNewVendorName] = useState('');
  const [newPoItemDesc, setNewPoItemDesc] = useState('');
  const [newPoQty, setNewPoQty] = useState(100);
  const [newPoAmount, setNewPoAmount] = useState(140000);

  const handleAddPO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendorName || !newPoItemDesc) return;
    const auth = checkRolePermission('PO_MGMT');
    if (!auth.allowed) {
      showNotification(auth.message || 'Unauthorized');
      addAuditLog(`BLOCKED PO Creation under role [${viewAsRole}]`);
      return;
    }
    const num = Math.floor(100 + Math.random() * 900);
    const poNum = `PO-2026-0${num}`;
    const amt = Number(newPoAmount);
    const newPO: POItem = {
      id: `po-${Date.now()}`,
      poNumber: poNum,
      vendorName: newVendorName,
      itemDescription: newPoItemDesc,
      poQty: Number(newPoQty),
      rrQtyReceived: 0,
      invoiceRef: 'Awaiting',
      totalAmount: amt,
      status: 'PENDING_RECEIVING',
    };
    setPoList((prev) => [newPO, ...prev]);

    // Also route to approvals list for COSO pipeline
    const newApproval: ApprovalDoc = {
      id: `app-po-${Date.now()}`,
      qrn: poNum,
      type: 'Purchase Order',
      maker: 'Purchasing Officer',
      reviewerStatus: 'APPROVED',
      gmStatus: 'PENDING',
      dcsStatus: 'AWAITING',
      totalAmount: amt,
    };
    setApprovalsList((prev) => [newApproval, ...prev]);
    addAuditLog(`Created Purchase Order ${poNum} for ${newVendorName} (₱${amt.toLocaleString()})`);
    showNotification(`Created ${poNum} and routed for GM Approval!`);
    setIsAddPOOpen(false);
    setNewVendorName('');
    setNewPoItemDesc('');
  };

  // New RFP Form Handler
  const [newPayeeName, setNewPayeeName] = useState('');
  const [newGlAccount, setNewGlAccount] = useState('6100 - Freight & Delivery');
  const [newRfpDesc, setNewRfpDesc] = useState('');
  const [newRfpAmount, setNewRfpAmount] = useState(15000);

  const handleAddRFP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayeeName || !newRfpDesc) return;
    const auth = checkRolePermission('RFP_MGMT');
    if (!auth.allowed) {
      showNotification(auth.message || 'Unauthorized');
      addAuditLog(`BLOCKED RFP Creation under role [${viewAsRole}]`);
      return;
    }
    const num = Math.floor(100 + Math.random() * 900);
    const rfpNum = `RFP-2026-0${num}`;
    const amt = Number(newRfpAmount);
    const newRFP: RFPItem = {
      id: `rfp-${Date.now()}`,
      rfpNumber: rfpNum,
      payeeName: newPayeeName,
      glAccount: newGlAccount,
      description: newRfpDesc,
      amount: amt,
      status: 'PENDING_GM',
    };
    setRfpList((prev) => [newRFP, ...prev]);

    // Route to approvals queue
    const newApproval: ApprovalDoc = {
      id: `app-rfp-${Date.now()}`,
      qrn: rfpNum,
      type: 'Request for Payment',
      maker: 'Bookkeeper (Aila)',
      reviewerStatus: 'APPROVED',
      gmStatus: 'PENDING',
      dcsStatus: 'AWAITING',
      totalAmount: amt,
    };
    setApprovalsList((prev) => [newApproval, ...prev]);
    addAuditLog(`Created RFP Expense ${rfpNum} for ${newPayeeName} (₱${amt.toLocaleString()})`);
    showNotification(`Created ${rfpNum} and routed for Approval!`);
    setIsAddRFPOpen(false);
    setNewPayeeName('');
    setNewRfpDesc('');
  };

  const [newStockSku, setNewStockSku] = useState('');
  const [newStockDesc, setNewStockDesc] = useState('');
  const [newStockLoc, setNewStockLoc] = useState<'Quezon City' | 'Pampanga'>('Quezon City');
  const [newStockLot, setNewStockLot] = useState('');
  const [newStockQty, setNewStockQty] = useState(50);

  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStockSku || !newStockDesc) return;
    const auth = checkRolePermission('STOCK_MGMT');
    if (!auth.allowed) {
      showNotification(auth.message || 'Unauthorized');
      addAuditLog(`BLOCKED Stock Addition under role [${viewAsRole}]`);
      return;
    }
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
    const auth = checkRolePermission('STOCK_MGMT');
    if (!auth.allowed) {
      showNotification(auth.message || 'Unauthorized');
      addAuditLog(`BLOCKED Stock Removal under role [${viewAsRole}]`);
      return;
    }
    setInventoryList((prev) => prev.filter((item) => item.id !== id));
    addAuditLog(`Removed Stock Item ${sku}`);
    showNotification(`Stock Item ${sku} removed.`);
  };

  const handleApproveDoc = (id: string, qrn: string) => {
    const targetDoc = approvalsList.find((d) => d.id === id);
    if (!targetDoc) return;

    const auth = checkRolePermission('APPROVE_DOC', targetDoc);
    if (!auth.allowed) {
      showNotification(auth.message || 'Unauthorized action!');
      addAuditLog(`BLOCKED Approval for ${qrn} under role [${viewAsRole}] - COSO Violation`);
      return;
    }

    setApprovalsList((prev) =>
      prev.map((doc) => {
        if (doc.id === id) {
          if (doc.reviewerStatus === 'PENDING' && ['Marketing', 'General Manager', 'Chairman (DCS)', 'Admin'].includes(viewAsRole)) {
            return { ...doc, reviewerStatus: 'APPROVED', gmStatus: 'PENDING' };
          }
          if (doc.gmStatus === 'PENDING' && ['General Manager', 'Chairman (DCS)', 'Admin'].includes(viewAsRole)) {
            return { ...doc, gmStatus: 'APPROVED', dcsStatus: 'PENDING' };
          }
          if ((doc.dcsStatus === 'PENDING' || doc.dcsStatus === 'AWAITING') && (viewAsRole === 'Chairman (DCS)' || viewAsRole === 'Admin')) {
            return { ...doc, dcsStatus: 'APPROVED' };
          }
        }
        return doc;
      })
    );

    addAuditLog(`Approved ${qrn} under role [${viewAsRole}]`);
    showNotification(`Document ${qrn} approved by ${viewAsRole}!`);
  };

  const handleRejectDoc = (id: string, qrn: string) => {
    const auth = checkRolePermission('REJECT_DOC');
    if (!auth.allowed) {
      showNotification(auth.message || 'Unauthorized action!');
      addAuditLog(`BLOCKED Rejection for ${qrn} under role [${viewAsRole}] - COSO Violation`);
      return;
    }
    setApprovalsList((prev) => prev.filter((doc) => doc.id !== id));
    addAuditLog(`Rejected ${qrn} under role [${viewAsRole}]`);
    showNotification(`Document ${qrn} rejected by ${viewAsRole}.`);
  };

  const [newSiNo, setNewSiNo] = useState('');
  const [newDrNo, setNewDrNo] = useState('');
  const [newInvoiceAmt, setNewInvoiceAmt] = useState(15000);

  const handleAddSOARow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSiNo || !newDrNo) return;
    const auth = checkRolePermission('FINANCE_SOA');
    if (!auth.allowed) {
      showNotification(auth.message || 'Unauthorized');
      addAuditLog(`BLOCKED SOA Row Creation under role [${viewAsRole}]`);
      return;
    }
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
    const auth = checkRolePermission('PO_RECEIVING');
    if (!auth.allowed) {
      showNotification(auth.message || 'Unauthorized');
      addAuditLog(`BLOCKED PO Goods Receiving under role [${viewAsRole}]`);
      return;
    }
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
      {/* Center-Screen High-Salience System Alert Modal (Execution Halt Overlay) */}
      <SystemAlertModal
        message={toastMessage}
        onClose={() => setToastMessage(null)}
        viewAsRole={viewAsRole}
      />

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
            <span className="text-[9px] sm:text-[10px] md:text-xs font-black text-slate-900 tracking-wider uppercase whitespace-nowrap">
              MEDICAL AND DIAGNOSTIC SUPPLIES CORPORATION
            </span>
          </div>
          <div className="hidden sm:block border-l border-slate-300 pl-3">
            <h1 className="text-xs md:text-sm font-extrabold tracking-wider uppercase text-slate-800 flex items-center gap-1.5">
              <span>ENTERPRISE ERP DASHBOARD</span>
              <span className="bg-blue-100 text-blue-800 border border-blue-300 text-xs px-2 py-0.5 rounded font-mono font-bold">v4.0</span>
            </h1>
            <p className="text-xs text-slate-600 font-medium">COSO Control-First Multi-Location Supply Chain</p>
          </div>
        </div>

        {/* View As Impersonation & Auto-Reset Timer Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 bg-slate-100 border border-slate-300 px-3 py-2 rounded text-xs md:text-sm shadow-inner">
            <Eye className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-slate-800 font-bold hidden md:inline">Simulate Role:</span>
            <select
              value={viewAsRole}
              onChange={(e) => {
                setViewAsRole(e.target.value);
                showNotification(`Switched role simulator to: ${e.target.value}`);
                addAuditLog(`Impersonated role: ${e.target.value}`);
              }}
              className="bg-white text-slate-900 font-bold rounded px-3 py-1 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs md:text-sm"
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

          {/* 30-Minute Auto-Reset Countdown Badge */}
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-300 px-3 py-2 rounded text-xs md:text-sm text-amber-900 font-semibold">
            <RefreshCcw className="w-4 h-4 text-amber-700 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="hidden xl:inline font-bold">Auto-Reset:</span>
            <span className="font-mono font-bold text-amber-900 text-xs md:text-sm">{formatTimer()}</span>
            <button
              onClick={handleRestoreDefaultState}
              className="ml-1 text-xs bg-amber-200 hover:bg-amber-300 text-amber-950 px-2 py-1 rounded font-extrabold transition shadow-xs"
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
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 px-3.5 py-2 rounded text-xs md:text-sm transition font-medium"
          >
            <Search className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline font-bold">Quick Search & Jump</span>
            <kbd className="bg-white text-slate-800 text-xs font-mono px-1.5 py-0.5 rounded border border-slate-300 shadow-xs font-bold">⌘K</kbd>
          </button>
          <div className="hidden lg:flex items-center gap-2 text-xs md:text-sm text-emerald-900 bg-emerald-50 border border-emerald-300 px-3.5 py-2 rounded font-semibold">
            <Server className="w-4 h-4 text-emerald-700" />
            <span>QBO API Live Sync</span>
          </div>
          <button
            onClick={() => setIsScannerOpen(true)}
            className="hidden sm:inline-flex btn-danger-red text-xs md:text-sm active:scale-95 transition touch-target font-bold"
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
      <nav className="hidden md:flex wayfinding-nav-strip px-4 md:px-6 overflow-x-auto no-scrollbar whitespace-nowrap gap-1.5 text-sm font-semibold text-slate-700">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3.5 px-4.5 transition border-b-2 flex items-center gap-2.5 ${
            activeTab === 'overview'
              ? 'border-blue-600 text-blue-700 font-extrabold bg-white text-sm'
              : 'border-transparent hover:text-slate-900 hover:bg-slate-200/50 text-sm'
          }`}
        >
          <Layers className="w-4 h-4 text-blue-600" />
          <span>Executive Overview</span>
          <span className="ml-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full font-bold">{approvalsList.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`py-3.5 px-4.5 transition border-b-2 flex items-center gap-2.5 ${
            activeTab === 'inventory'
              ? 'border-blue-600 text-blue-700 font-extrabold bg-white text-sm'
              : 'border-transparent hover:text-slate-900 hover:bg-slate-200/50 text-sm'
          }`}
        >
          <Package className="w-4 h-4 text-blue-600" />
          <span>Inventory (QC & Pampanga)</span>
          <span className="ml-1 px-2 py-0.5 text-xs bg-emerald-100 text-emerald-800 rounded-full font-bold">{inventoryList.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('quotations')}
          className={`py-3.5 px-4.5 transition border-b-2 flex items-center gap-2.5 ${
            activeTab === 'quotations'
              ? 'border-blue-600 text-blue-700 font-extrabold bg-white text-sm'
              : 'border-transparent hover:text-slate-900 hover:bg-slate-200/50 text-sm'
          }`}
        >
          <FileText className="w-4 h-4 text-blue-600" />
          <span>Quotation Generator</span>
        </button>
        <button
          onClick={() => setActiveTab('soa')}
          className={`py-3.5 px-4.5 transition border-b-2 flex items-center gap-2.5 ${
            activeTab === 'soa'
              ? 'border-blue-600 text-blue-700 font-extrabold bg-white text-sm'
              : 'border-transparent hover:text-slate-900 hover:bg-slate-200/50 text-sm'
          }`}
        >
          <FileCheck className="w-4 h-4 text-blue-600" />
          <span>Statement of Account (SOA)</span>
          <span className="ml-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full font-bold">{soaData.rows.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('purchasing')}
          className={`py-3.5 px-4.5 transition border-b-2 flex items-center gap-2.5 ${
            activeTab === 'purchasing'
              ? 'border-blue-600 text-blue-700 font-extrabold bg-white text-sm'
              : 'border-transparent hover:text-slate-900 hover:bg-slate-200/50 text-sm'
          }`}
        >
          <Building2 className="w-4 h-4 text-blue-600" />
          <span>Purchasing & 3-Way Match</span>
        </button>
        <button
          onClick={() => setActiveTab('rfp')}
          className={`py-3.5 px-4.5 transition border-b-2 flex items-center gap-2.5 ${
            activeTab === 'rfp'
              ? 'border-blue-600 text-blue-700 font-extrabold bg-white text-sm'
              : 'border-transparent hover:text-slate-900 hover:bg-slate-200/50 text-sm'
          }`}
        >
          <CreditCard className="w-4 h-4 text-blue-600" />
          <span>Request for Payment</span>
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`py-3.5 px-4.5 transition border-b-2 flex items-center gap-2.5 ${
            activeTab === 'admin'
              ? 'border-blue-600 text-blue-700 font-extrabold bg-white text-sm'
              : 'border-transparent hover:text-slate-900 hover:bg-slate-200/50 text-sm'
          }`}
        >
          <UserCheck className="w-4 h-4 text-blue-600" />
          <span>Audit Log Stream</span>
          <span className="ml-1 px-2 py-0.5 text-xs bg-slate-200 text-slate-800 rounded-full font-bold">{auditLogs.length}</span>
        </button>
      </nav>

      {/* Predictable Context Breadcrumb Bar (Zero Confusion Wayfinding) */}
      <div className="bg-slate-100 border-b border-slate-300 px-4 md:px-6 py-2.5 flex items-center gap-2 text-xs md:text-sm text-slate-700 font-medium">
        <Home className="w-4 h-4 text-blue-700 shrink-0" />
        <span className="font-bold text-slate-800">Accustanda ERP</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="font-extrabold text-blue-800">{getTabBreadcrumb()}</span>
      </div>

      {/* Main Content Area — Maximum Screen Utilization Layout with Precise Mobile Bottom Clearance */}
      <main className="flex-1 p-4 md:p-6 pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:pb-6 max-w-[1600px] mx-auto w-full space-y-6">
        {/* TAB 1: EXECUTIVE OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* IBM Carbon v11 High-Contrast Metric Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="wayfinding-card p-5 relative overflow-hidden bg-white">
                <div className="flex justify-between items-center text-slate-500 text-xs mb-2">
                  <span className="font-bold uppercase tracking-wider text-xs md:text-sm text-slate-700">Managed Inventory</span>
                  <Box className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-3xl md:text-4xl font-extrabold text-slate-900">
                  {inventoryList.reduce((acc, i) => acc + i.onHand, 0)}{' '}
                  <span className="text-sm font-bold text-slate-500">Units</span>
                </p>
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between text-xs md:text-sm font-semibold">
                  <span className="text-blue-700 font-bold">QC: {inventoryList.filter((i) => i.location === 'Quezon City').reduce((acc, i) => acc + i.onHand, 0)}</span>
                  <span className="text-purple-700 font-bold">Pampanga: {inventoryList.filter((i) => i.location === 'Pampanga').reduce((acc, i) => acc + i.onHand, 0)}</span>
                </div>
              </div>

              <div className="wayfinding-card p-5 relative overflow-hidden bg-white">
                <div className="flex justify-between items-center text-slate-500 text-xs mb-2">
                  <span className="font-bold uppercase tracking-wider text-xs md:text-sm text-amber-800">Pending Approvals</span>
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <p className="text-3xl md:text-4xl font-extrabold text-amber-600">
                  {approvalsList.length} <span className="text-sm font-bold text-amber-700">Requests</span>
                </p>
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between text-xs md:text-sm font-semibold">
                  <span className="text-slate-700 font-semibold">Role: <strong className="text-slate-950 font-extrabold">{viewAsRole}</strong></span>
                  <span className="text-emerald-700 font-extrabold">COSO 4-Layer</span>
                </div>
              </div>

              <div className="wayfinding-card p-5 relative overflow-hidden bg-white">
                <div className="flex justify-between items-center text-slate-500 text-xs mb-2">
                  <span className="font-bold uppercase tracking-wider text-xs md:text-sm text-slate-700">Active SOA Balance</span>
                  <FileCheck className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-3xl md:text-4xl font-extrabold text-slate-900">₱32,208.00</p>
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between text-xs md:text-sm font-semibold">
                  <span className="text-slate-700 font-semibold">Client: Gatchalian Med Lab</span>
                  <span className="text-emerald-700 font-extrabold">Current</span>
                </div>
              </div>

              <div className="wayfinding-card p-5 relative overflow-hidden bg-white">
                <div className="flex justify-between items-center text-slate-500 text-xs mb-2">
                  <span className="font-bold uppercase tracking-wider text-xs md:text-sm text-slate-700">Integration Hub</span>
                  <Server className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-2xl md:text-3xl font-extrabold text-emerald-700 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>QBO API Live</span>
                </p>
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between text-xs md:text-sm font-semibold">
                  <span className="text-slate-600 font-medium">Auto FEFO Sync</span>
                  <span className="text-emerald-700 font-extrabold">Connected</span>
                </div>
              </div>
            </div>

            {/* COSO Stepper Tracker */}
            <div className="wayfinding-card p-5 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm md:text-base font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  COSO Segregation of Duties — 4-Layer Approval Chain
                </h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded font-bold text-xs md:text-sm border border-blue-300">All Documents to Chairman at Launch</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs md:text-sm">
                <div className="p-3 bg-slate-50 border-l-4 border-blue-600 rounded shadow-sm">
                  <span className="text-xs font-extrabold uppercase text-blue-700">Layer 1: Maker</span>
                  <p className="font-bold text-slate-900 mt-1 text-xs md:text-sm">Encodes Transaction</p>
                  <p className="text-xs text-slate-600 font-medium">Sales / Purchasing / Bookkeeper</p>
                </div>
                <div className="p-3 bg-slate-50 border-l-4 border-blue-600 rounded shadow-sm">
                  <span className="text-xs font-extrabold uppercase text-blue-700">Layer 2: Reviewer</span>
                  <p className="font-bold text-slate-900 mt-1 text-xs md:text-sm">Checks Completeness</p>
                  <p className="text-xs text-slate-600 font-medium">Marketing Officer</p>
                </div>
                <div className="p-3 bg-slate-50 border-l-4 border-blue-600 rounded shadow-sm">
                  <span className="text-xs font-extrabold uppercase text-blue-700">Layer 3: GM</span>
                  <p className="font-bold text-slate-900 mt-1 text-xs md:text-sm">Business Approval</p>
                  <p className="text-xs text-slate-600 font-medium">General Manager (Karen)</p>
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
                  <Clock className="w-5 h-5 text-blue-600" />
                  <h3 className="text-sm md:text-base font-extrabold uppercase tracking-wider text-slate-950">
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
                    {approvalsList.map((doc) => {
                      const canApproveThisDoc = checkRolePermission('APPROVE_DOC', doc).allowed;
                      const canRejectThisDoc = checkRolePermission('REJECT_DOC').allowed;

                      return (
                        <tr key={doc.id}>
                          <td className="font-mono font-bold text-blue-700">{doc.qrn}</td>
                          <td>{doc.type}</td>
                          <td>{doc.maker}</td>
                          <td>
                            <span className={`px-2.5 py-1 rounded text-xs md:text-sm font-bold ${doc.reviewerStatus === 'APPROVED' ? 'badge-green' : 'badge-amber'}`}>
                              {doc.reviewerStatus}
                            </span>
                          </td>
                          <td>
                            <span className={`px-2.5 py-1 rounded text-xs md:text-sm font-bold ${doc.gmStatus === 'APPROVED' ? 'badge-green' : 'badge-amber'}`}>
                              {doc.gmStatus}
                            </span>
                          </td>
                          <td>
                            <span className={`px-2.5 py-1 rounded text-xs md:text-sm font-bold ${doc.dcsStatus === 'APPROVED' ? 'badge-green' : 'badge-amber'}`}>
                              {doc.dcsStatus}
                            </span>
                          </td>
                          <td className="text-right font-bold text-slate-900">₱{doc.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                          <td className="text-center space-x-1.5">
                            <button
                              onClick={() => handleApproveDoc(doc.id, doc.qrn)}
                              disabled={!canApproveThisDoc}
                              title={canApproveThisDoc ? "Approve Document" : `Role [${viewAsRole}] is strictly prohibited from approving this document under COSO controls`}
                              className={`px-3.5 py-1.5 rounded text-xs md:text-sm font-bold shadow transition ${
                                canApproveThisDoc
                                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                                  : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300 opacity-60'
                              }`}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectDoc(doc.id, doc.qrn)}
                              disabled={!canRejectThisDoc}
                              title={canRejectThisDoc ? "Reject Document" : `Role [${viewAsRole}] is strictly prohibited from rejecting approval documents`}
                              className={`px-3.5 py-1.5 rounded text-xs md:text-sm font-bold shadow transition ${
                                canRejectThisDoc
                                  ? 'bg-red-600 hover:bg-red-500 text-white cursor-pointer'
                                  : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300 opacity-60'
                              }`}
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      );
                    })}
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

              {approvalsList.map((doc) => {
                const canApproveThisDoc = checkRolePermission('APPROVE_DOC', doc).allowed;
                const canRejectThisDoc = checkRolePermission('REJECT_DOC').allowed;

                return (
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
                        disabled={!canApproveThisDoc}
                        title={canApproveThisDoc ? "Approve Document" : `Role [${viewAsRole}] is strictly prohibited from approving this document`}
                        className={`w-full py-2 rounded text-xs font-extrabold shadow transition text-center ${
                          canApproveThisDoc
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300 opacity-60'
                        }`}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectDoc(doc.id, doc.qrn)}
                        disabled={!canRejectThisDoc}
                        title={canRejectThisDoc ? "Reject Document" : `Role [${viewAsRole}] is strictly prohibited from rejecting approval documents`}
                        className={`w-full py-2 rounded text-xs font-extrabold shadow transition text-center ${
                          canRejectThisDoc
                            ? 'bg-red-600 hover:bg-red-500 text-white'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300 opacity-60'
                        }`}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: INVENTORY */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <h2 className="text-base md:text-lg font-extrabold text-slate-950 uppercase tracking-wider flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  Multi-Location Inventory Management (QC & Pampanga)
                </h2>
                <p className="text-xs md:text-sm text-slate-600 font-medium">Live Stock Items: {inventoryList.length} SKUs maintained</p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Filter inventory SKU or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white border border-slate-300 text-slate-900 font-medium rounded-md px-3.5 py-2 text-xs md:text-sm focus:outline-none focus:border-blue-500 shadow-xs"
                />
                <button
                  onClick={() => {
                    if (!canExportInventory) {
                      showNotification(`⛔ COSO SoD Violation: Role [${viewAsRole}] is not authorized to export system inventory reports!`);
                      addAuditLog(`BLOCKED CSV Export under role [${viewAsRole}]`);
                      return;
                    }
                    exportToCSV('accustanda_inventory_report.csv', inventoryList);
                    showNotification('Downloaded Inventory CSV Report!');
                    addAuditLog('Exported Inventory CSV Report');
                  }}
                  disabled={!canExportInventory}
                  title={canExportInventory ? 'Export CSV Report' : `Role [${viewAsRole}] is not authorized to export raw inventory reports`}
                  className={`text-xs md:text-sm font-bold flex items-center gap-1.5 ${
                    canExportInventory
                      ? 'btn-danger-red cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300 px-3 py-2 rounded-md opacity-60'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={() => {
                    if (!canAddStock) {
                      showNotification(`⛔ COSO SoD Violation: Role [${viewAsRole}] is not authorized to alter physical inventory! Allowed: Warehouse, Admin.`);
                      addAuditLog(`BLOCKED Stock Add Modal under role [${viewAsRole}]`);
                      return;
                    }
                    setIsAddStockOpen(true);
                  }}
                  disabled={!canAddStock}
                  title={canAddStock ? 'Add New Stock Batch' : `Role [${viewAsRole}] is not authorized to manage warehouse inventory. Allowed: Warehouse, Admin.`}
                  className={`text-xs md:text-sm font-bold flex items-center gap-1.5 ${
                    canAddStock
                      ? 'btn-primary-blue cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300 px-3.5 py-2 rounded-md opacity-60'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Stock Batch</span>
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
                          <span className={`px-2.5 py-1 rounded text-xs md:text-sm font-bold ${item.location === 'Quezon City' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                            {item.location}
                          </span>
                        </td>
                        <td className="font-mono text-slate-600">{item.lotNumber}</td>
                        <td>
                          <span className={`px-2.5 py-1 rounded text-xs md:text-sm font-bold ${item.status === 'NEAR_EXPIRY' ? 'badge-amber' : 'badge-green'}`}>
                            {item.expiryDate} {item.status === 'NEAR_EXPIRY' && '(Near Expiry)'}
                          </span>
                        </td>
                        <td className="text-right font-bold text-slate-900">{item.onHand} {item.unit}</td>
                        <td className="text-right text-amber-700 font-bold">{item.reserved} {item.unit}</td>
                        <td className="text-right text-emerald-700 font-bold">{item.onHand - item.reserved} {item.unit}</td>
                        <td className="text-center">
                          <button
                            onClick={() => handleDeleteStock(item.id, item.sku)}
                            disabled={!canAddStock}
                            title={canAddStock ? "Remove Stock Entry" : `Role [${viewAsRole}] cannot remove stock items`}
                            className={`p-1.5 rounded transition ${
                              canAddStock ? 'text-red-600 hover:bg-red-50 cursor-pointer' : 'text-slate-300 bg-slate-100 cursor-not-allowed border border-slate-200 opacity-50'
                            }`}
                          >
                            <Trash2 className="w-4.5 h-4.5" />
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
                      disabled={!canAddStock}
                      title={canAddStock ? "Remove Stock Item" : `Role [${viewAsRole}] cannot remove stock items`}
                      className={`px-3 py-1 font-semibold rounded border transition text-xs flex items-center gap-1 ${
                        canAddStock ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 cursor-pointer' : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-50'
                      }`}
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
                <h2 className="text-base md:text-lg font-extrabold text-slate-950 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Sales Quotation Generator & 3-Day Stock Reservation Engine
                </h2>
                <p className="text-xs md:text-sm text-slate-600 font-medium">Flow: Client RFQ → Sales → Marketing (Reviewer) → GM → DCS</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (!canEditQuotation) {
                      showNotification(`⛔ COSO SoD Violation: Role [${viewAsRole}] cannot encode or alter Sales Quotations! Allowed: Sales, Marketing, GM, Admin.`);
                      addAuditLog(`BLOCKED Quotation Add Line under role [${viewAsRole}]`);
                      return;
                    }
                    setIsAddQuotationItemOpen(true);
                  }}
                  disabled={!canEditQuotation}
                  title={canEditQuotation ? 'Add Line Item' : `Role [${viewAsRole}] cannot modify Sales Quotations`}
                  className={`text-xs md:text-sm font-bold flex items-center gap-1.5 ${
                    canEditQuotation
                      ? 'btn-primary-blue cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300 px-3.5 py-2 rounded-md opacity-60'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Quotation Line</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="btn-danger-red text-xs md:text-sm font-bold"
                >
                  <Download className="w-4 h-4" />
                  <span>Print / Export Quotation</span>
                </button>
              </div>
            </div>

            {/* Mobile Scroll Hint Banner */}
            <div className="md:hidden bg-blue-50 border border-blue-200 text-blue-900 p-2.5 rounded-lg text-xs flex items-center justify-between font-medium">
              <span>📱 Mobile Document Preview — Swipe horizontally to view full A4 Document</span>
              <span className="font-bold">➔ Swipe</span>
            </div>

            <div className="bg-slate-300 p-2 sm:p-6 rounded border border-slate-400 overflow-x-auto shadow-sm flex justify-start md:justify-center">
              <QuotationPDF data={quotationData} onRemoveItem={handleRemoveQuotationItem} isEditable={canEditQuotation} />
            </div>
          </div>
        )}

        {/* TAB 4: STATEMENT OF ACCOUNT (SOA) */}
        {activeTab === 'soa' && (
          <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <h2 className="text-base md:text-lg font-extrabold text-slate-950 uppercase tracking-wider flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-blue-600" />
                  Statement of Account (SOA) Module
                </h2>
                <p className="text-xs md:text-sm text-slate-600 font-medium">DR # Tracking, Client Aging, and Running Balances</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (!canEditSOA) {
                      showNotification(`⛔ COSO SoD Violation: Role [${viewAsRole}] cannot modify Statement of Account (SOA) ledgers! Allowed: Bookkeeper, Admin.`);
                      addAuditLog(`BLOCKED SOA Row Add under role [${viewAsRole}]`);
                      return;
                    }
                    setIsAddSOARowOpen(true);
                  }}
                  disabled={!canEditSOA}
                  title={canEditSOA ? 'Add Invoice Row' : `Role [${viewAsRole}] cannot modify SOA ledgers. Allowed: Bookkeeper, Admin.`}
                  className={`text-xs md:text-sm font-bold flex items-center gap-1.5 ${
                    canEditSOA
                      ? 'btn-primary-blue cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300 px-3.5 py-2 rounded-md opacity-60'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Invoice Row</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="btn-danger-red text-xs md:text-sm font-bold"
                >
                  <Download className="w-4 h-4" />
                  <span>Print / Export SOA</span>
                </button>
              </div>
            </div>

            {/* Mobile Scroll Hint Banner */}
            <div className="md:hidden bg-blue-50 border border-blue-200 text-blue-900 p-2.5 rounded-lg text-xs flex items-center justify-between font-medium">
              <span>📱 Mobile Document Preview — Swipe horizontally to view full A4 Document</span>
              <span className="font-bold">➔ Swipe</span>
            </div>

            <div className="bg-slate-300 p-2 sm:p-6 rounded border border-slate-400 overflow-x-auto shadow-sm flex justify-start md:justify-center">
              <StatementOfAccountPDF data={soaData} onRemoveRow={handleDeleteSOARow} isEditable={canEditSOA} />
            </div>
          </div>
        )}

        {/* TAB 5: PURCHASING & 3-WAY MATCH */}
        {activeTab === 'purchasing' && (
          <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <h2 className="text-base md:text-lg font-extrabold text-slate-950 uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  Purchasing & Receiving Report (3-Way Match & Fraud Control)
                </h2>
                <p className="text-xs md:text-sm text-slate-600 font-medium">Live Purchase Orders: {poList.length} POs tracked across vendors</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (!canTestReceiving) {
                      showNotification(`⛔ COSO SoD Violation: Role [${viewAsRole}] cannot perform Goods Receiving Report (GRR) checks! Allowed: Warehouse, GM, Admin.`);
                      addAuditLog(`BLOCKED PO Receiving Test under role [${viewAsRole}]`);
                      return;
                    }
                    setIsPOReceivingModalOpen(true);
                  }}
                  disabled={!canTestReceiving}
                  title={canTestReceiving ? 'Test PO Over-Receiving Rule' : `Role [${viewAsRole}] cannot perform receiving checks`}
                  className={`text-xs md:text-sm font-bold px-3.5 py-2 rounded-md flex items-center gap-1.5 shadow transition ${
                    canTestReceiving
                      ? 'bg-amber-600 hover:bg-amber-500 text-white cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300 opacity-60'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Test PO Over-Receiving Rule</span>
                </button>
                <button
                  onClick={() => {
                    if (!canCreatePO) {
                      showNotification(`⛔ COSO SoD Violation: Role [${viewAsRole}] cannot generate Purchase Orders (PO)! Allowed: GM, Bookkeeper, Admin.`);
                      addAuditLog(`BLOCKED PO Creation under role [${viewAsRole}]`);
                      return;
                    }
                    setIsAddPOOpen(true);
                  }}
                  disabled={!canCreatePO}
                  title={canCreatePO ? 'Create Purchase Order' : `Role [${viewAsRole}] cannot generate Purchase Orders`}
                  className={`text-xs md:text-sm font-bold flex items-center gap-1.5 ${
                    canCreatePO
                      ? 'btn-primary-blue cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300 px-3.5 py-2 rounded-md opacity-60'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Purchase Order</span>
                </button>
              </div>
            </div>

            {/* Hard Block Information Callout */}
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded text-xs md:text-sm text-amber-950 flex items-start gap-3 shadow-xs">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="font-extrabold uppercase">3-Way Match Fraud Control Enforced:</p>
                <p className="font-medium">Receiving is strictly hard-blocked beyond approved Purchase Order quantities (`PO = Goods Receipt = Vendor Invoice`). Any excess quantity requires a formal, approved PO revision.</p>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="wayfinding-card p-0 overflow-hidden hidden sm:block">
              <div className="table-responsive-wrapper">
                <table className="wayfinding-grid">
                  <thead>
                    <tr>
                      <th>PO Ref Number</th>
                      <th>Vendor Name</th>
                      <th>Item Ordered</th>
                      <th className="text-right">PO Qty</th>
                      <th className="text-right">RR Received</th>
                      <th>Invoice Ref</th>
                      <th className="text-right">Total Amount</th>
                      <th className="text-center">3-Way Status</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {poList.map((po) => (
                      <tr key={po.id}>
                        <td className="font-mono font-bold text-blue-700">{po.poNumber}</td>
                        <td className="font-medium">{po.vendorName}</td>
                        <td className="text-slate-800">{po.itemDescription}</td>
                        <td className="text-right font-bold text-slate-900">{po.poQty}</td>
                        <td className="text-right font-bold text-emerald-700">{po.rrQtyReceived}</td>
                        <td className="font-mono text-slate-600">{po.invoiceRef}</td>
                        <td className="text-right font-bold text-slate-900">₱{po.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                        <td className="text-center">
                          <span className={`px-2.5 py-1 rounded text-xs md:text-sm font-bold ${po.status === 'VERIFIED_3WAY' ? 'badge-green' : 'badge-amber'}`}>
                            {po.status === 'VERIFIED_3WAY' ? '✓ 3-Way Verified' : '⏳ Pending Receiving'}
                          </span>
                        </td>
                        <td className="text-center">
                          <button
                            onClick={() => handleDeletePO(po.id)}
                            disabled={!canCreatePO}
                            title={canCreatePO ? "Delete Purchase Order" : `Role [${viewAsRole}] cannot delete Purchase Orders`}
                            className={`p-1.5 rounded transition ${
                              canCreatePO ? 'text-red-600 hover:bg-red-50 cursor-pointer' : 'text-slate-300 bg-slate-100 cursor-not-allowed border border-slate-200 opacity-50'
                            }`}
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile View: Stacked PO Cards */}
            <div className="space-y-3 sm:hidden">
              {poList.map((po) => (
                <div key={po.id} className="wayfinding-card p-4 space-y-3 border-l-4 border-l-blue-600">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono font-extrabold text-blue-700 text-sm block">{po.poNumber}</span>
                      <h4 className="font-bold text-slate-900 text-xs mt-0.5">{po.vendorName}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${po.status === 'VERIFIED_3WAY' ? 'badge-green' : 'badge-amber'}`}>
                        {po.status === 'VERIFIED_3WAY' ? '3-Way Verified' : 'Pending Receiving'}
                      </span>
                      <button
                        onClick={() => handleDeletePO(po.id)}
                        disabled={!canCreatePO}
                        title={canCreatePO ? "Delete PO" : `Role [${viewAsRole}] cannot delete Purchase Orders`}
                        className={`p-1 rounded ${canCreatePO ? 'text-red-600 hover:bg-red-50 cursor-pointer' : 'text-slate-300 bg-slate-100 cursor-not-allowed opacity-50'}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 font-medium bg-slate-50 p-2 rounded border border-slate-200">
                    Order: <strong className="text-slate-900">{po.itemDescription}</strong>
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block">PO vs Received Qty</span>
                      <span className="font-bold text-slate-900">{po.rrQtyReceived} / {po.poQty} Units</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block">Total Amount</span>
                      <span className="font-extrabold text-slate-900">₱{po.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: REQUEST FOR PAYMENT (RFP) */}
        {activeTab === 'rfp' && (
          <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <h2 className="text-base md:text-lg font-extrabold text-slate-950 uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Request for Payment (RFP) - Non-PO Expense Vouchers
                </h2>
                <p className="text-xs md:text-sm text-slate-600 font-medium">Live Vouchers: {rfpList.length} Non-PO expenses routed for approval</p>
              </div>
              <button
                onClick={() => {
                  if (!canCreateRFP) {
                    showNotification(`⛔ COSO SoD Violation: Role [${viewAsRole}] cannot manage Request for Payment (RFP) vouchers! Allowed: Bookkeeper, GM, Admin.`);
                    addAuditLog(`BLOCKED RFP Creation under role [${viewAsRole}]`);
                    return;
                  }
                  setIsAddRFPOpen(true);
                }}
                disabled={!canCreateRFP}
                title={canCreateRFP ? 'Create Payment Voucher (RFP)' : `Role [${viewAsRole}] cannot manage Request for Payment vouchers`}
                className={`text-xs md:text-sm font-bold flex items-center gap-1.5 ${
                  canCreateRFP
                    ? 'btn-primary-blue cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300 px-3.5 py-2 rounded-md opacity-60'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Create Payment Voucher (RFP)</span>
              </button>
            </div>

            {/* Desktop Table View */}
            <div className="wayfinding-card p-0 overflow-hidden hidden sm:block">
              <div className="table-responsive-wrapper">
                <table className="wayfinding-grid">
                  <thead>
                    <tr>
                      <th>RFP Ref Number</th>
                      <th>Payee Name</th>
                      <th>GL Account Code</th>
                      <th>Expense Description</th>
                      <th className="text-right">Amount (₱)</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rfpList.map((rfp) => (
                      <tr key={rfp.id}>
                        <td className="font-mono font-bold text-blue-700">{rfp.rfpNumber}</td>
                        <td className="font-medium text-slate-900">{rfp.payeeName}</td>
                        <td className="font-mono text-purple-700 font-semibold">{rfp.glAccount}</td>
                        <td className="text-slate-700">{rfp.description}</td>
                        <td className="text-right font-bold text-slate-900">₱{rfp.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                        <td className="text-center">
                          <span className={`px-2.5 py-1 rounded text-xs md:text-sm font-bold ${rfp.status === 'APPROVED_DCS' ? 'badge-green' : 'badge-amber'}`}>
                            {rfp.status === 'APPROVED_DCS' ? 'Approved by DCS' : 'Pending Approval'}
                          </span>
                        </td>
                        <td className="text-center">
                          <button
                            onClick={() => handleDeleteRFP(rfp.id)}
                            disabled={!canCreateRFP}
                            title={canCreateRFP ? "Delete Payment Voucher" : `Role [${viewAsRole}] cannot delete Payment Vouchers`}
                            className={`p-1.5 rounded transition ${
                              canCreateRFP ? 'text-red-600 hover:bg-red-50 cursor-pointer' : 'text-slate-300 bg-slate-100 cursor-not-allowed border border-slate-200 opacity-50'
                            }`}
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            {/* Mobile View: Stacked RFP Cards */}
            <div className="space-y-3 sm:hidden">
              {rfpList.map((rfp) => (
                <div key={rfp.id} className="wayfinding-card p-4 space-y-3 border-l-4 border-l-purple-600">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono font-extrabold text-blue-700 text-sm block">{rfp.rfpNumber}</span>
                      <h4 className="font-bold text-slate-900 text-xs mt-0.5">{rfp.payeeName}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-900">
                        ₱{rfp.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                      <button
                        onClick={() => handleDeleteRFP(rfp.id)}
                        disabled={!canCreateRFP}
                        title={canCreateRFP ? "Delete RFP" : `Role [${viewAsRole}] cannot delete Payment Vouchers`}
                        className={`p-1 rounded ${canCreateRFP ? 'text-red-600 hover:bg-red-50 cursor-pointer' : 'text-slate-300 bg-slate-100 cursor-not-allowed opacity-50'}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 bg-purple-50/60 p-2 rounded border border-purple-200">
                    <span className="font-mono font-bold text-purple-800 block text-[10px] uppercase">{rfp.glAccount}</span>
                    <span className="mt-0.5 block">{rfp.description}</span>
                  </p>

                  <div className="flex justify-between items-center text-xs">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${rfp.status === 'APPROVED_DCS' ? 'badge-green' : 'badge-amber'}`}>
                      {rfp.status === 'APPROVED_DCS' ? 'Approved by DCS' : 'Pending Approval'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
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

      {/* MODAL 4: Create Purchase Order (PO) Modal */}
      {isAddPOOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-300 mobile-modal-container">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold uppercase text-slate-900">Create Purchase Order (PO)</h3>
              <button onClick={() => setIsAddPOOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPO} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Supplier / Vendor Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sysmex Philippines Inc."
                  value={newVendorName}
                  onChange={(e) => setNewVendorName(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Item Description</label>
                <input
                  type="text"
                  placeholder="e.g. Automated Blood Chemistry Reagents 100s"
                  value={newPoItemDesc}
                  onChange={(e) => setNewPoItemDesc(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">PO Quantity</label>
                  <input
                    type="number"
                    value={newPoQty}
                    onChange={(e) => setNewPoQty(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Total Amount (₱)</label>
                  <input
                    type="number"
                    value={newPoAmount}
                    onChange={(e) => setNewPoAmount(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddPOOpen(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-800 font-semibold rounded hover:bg-slate-300"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary-blue">
                  Route PO for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: Add Item to Sales Quotation Modal */}
      {isAddQuotationItemOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-300 mobile-modal-container">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold uppercase text-slate-900">Add Line Item to Quotation</h3>
              <button onClick={() => setIsAddQuotationItemOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddQuotationItem} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Description</label>
                <input
                  type="text"
                  placeholder="e.g. Blood Chemistry Reagents Kit 100s"
                  value={newQuotationDesc}
                  onChange={(e) => setNewQuotationDesc(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Packaging Unit</label>
                  <input
                    type="text"
                    placeholder="e.g. 1 Kit / 50 Tests"
                    value={newQuotationPkg}
                    onChange={(e) => setNewQuotationPkg(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Unit Price (₱)</label>
                  <input
                    type="number"
                    value={newQuotationPrice}
                    onChange={(e) => setNewQuotationPrice(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddQuotationItemOpen(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-800 font-semibold rounded hover:bg-slate-300"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary-blue">
                  Add Item to Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isAddRFPOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-300 mobile-modal-container">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold uppercase text-slate-900">Create Non-PO Payment Voucher (RFP)</h3>
              <button onClick={() => setIsAddRFPOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRFP} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Payee / Service Provider Name</label>
                <input
                  type="text"
                  placeholder="e.g. LBC Express / Meralco"
                  value={newPayeeName}
                  onChange={(e) => setNewPayeeName(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Select GL Account Code</label>
                <select
                  value={newGlAccount}
                  onChange={(e) => setNewGlAccount(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                >
                  <option value="6100 - Freight & Delivery">6100 - Freight & Delivery</option>
                  <option value="6200 - Utilities Expense">6200 - Utilities Expense</option>
                  <option value="6300 - Professional & Calibration Fees">6300 - Professional & Calibration Fees</option>
                  <option value="6400 - Office & Warehouse Supplies">6400 - Office & Warehouse Supplies</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Expense Description</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Climate control power bill for Pampanga warehouse facility"
                  value={newRfpDesc}
                  onChange={(e) => setNewRfpDesc(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Payment Amount (₱)</label>
                <input
                  type="number"
                  value={newRfpAmount}
                  onChange={(e) => setNewRfpAmount(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddRFPOpen(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-800 font-semibold rounded hover:bg-slate-300"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary-blue">
                  Route RFP Voucher
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

      {/* Mobile Barcode & QR Scanner Modal */}
      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={(scannedCode) => {
          setIsScannerOpen(false);
          setActiveTab('inventory');
          setSearchQuery(scannedCode);
          showNotification(`🎯 Barcode Scanned: ${scannedCode} — Filtered in Inventory!`);
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 shadow-2xl px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex justify-around items-center text-[10px] font-semibold text-slate-600 no-print">
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
