'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { ExecutiveOverview } from '@/components/features/overview/ExecutiveOverview';
import { InventoryControl } from '@/components/features/inventory/InventoryControl';
import { QuotationGenerator } from '@/components/features/quotations/QuotationGenerator';
import { StatementOfAccount } from '@/components/features/soa/StatementOfAccount';
import { PurchasingReceiving } from '@/components/features/purchasing/PurchasingReceiving';
import { RequestForPayment } from '@/components/features/rfp/RequestForPayment';
import { SystemAuditTrail } from '@/components/features/admin/SystemAuditTrail';
import { CommandPaletteModal } from '@/components/navigation/CommandPaletteModal';
import { MobileNavDrawer } from '@/components/navigation/MobileNavDrawer';
import { BottomNav } from '@/components/navigation/BottomNav';
import { PWAInstallModal } from '@/components/modals/PWAInstallModal';
import { ExportModal } from '@/components/modals/ExportModal';
import { AddStockModal } from '@/components/modals/AddStockModal';
import { CreateQuotationModal } from '@/components/modals/CreateQuotationModal';
import { CreatePOModal } from '@/components/modals/CreatePOModal';
import { ReceivingReportModal } from '@/components/modals/ReceivingReportModal';
import { CreateRFPModal } from '@/components/modals/CreateRFPModal';
import { DocumentPrintModal } from '@/components/modals/DocumentPrintModal';
import { BarcodeScannerModal } from '@/components/scanner/BarcodeScannerModal';
import { BarcodeProductManagerModal } from '@/components/modals/BarcodeProductManagerModal';
import { QBOSyncQueueModal } from '@/components/modals/QBOSyncQueueModal';

import { ClientFormatROICalculatorModal } from '@/components/features/roi/ClientFormatROICalculatorModal';
import { RFQDocumentPreviewModal } from '@/components/features/rfq/RFQDocumentPreviewModal';
import { ClientAcceptanceModal } from '@/components/features/quotations/ClientAcceptanceModal';
import { VendorInvoiceModal } from '@/components/features/purchasing/VendorInvoiceModal';
import { ThreeWayMatchModal } from '@/components/features/purchasing/ThreeWayMatchModal';
import { CollectionAllocationModal } from '@/components/features/finance/CollectionAllocationModal';
import { StartupImportModal } from '@/components/features/admin/StartupImportModal';
import { SystemAlertModal } from '@/components/modals/SystemAlertModal';
import {
  getApprovals,
  getAuditLogs,
  getInventory,
  getReadiness,
  getReplenishment,
  getRFQs,
  getPurchaseOrders,
  getQBOQueue,
  getRFPs,
  getSOA,
  allocateCollection,
  createRFQ,
  createPurchaseOrder,
  createRFP,
  receiveGoods,
  releaseRFP,
  syncQBOItem,
  updateApproval,
} from '@/lib/api';

import {
  useDemoStore,
  DEFAULT_INVENTORY,
  DEFAULT_REPLENISHMENT_PLANNER,
  DEFAULT_RFQS,
  DEFAULT_QUOTATIONS,
  DEFAULT_APPROVALS,
  DEFAULT_SOA_ROWS,
  DEFAULT_COLLECTIONS,
  DEFAULT_PO_LIST,
  DEFAULT_RFP_LIST,
  DEFAULT_QBO_QUEUE,
  DEFAULT_AUDIT_LOGS,
} from '@/lib/useDemoStore';

import { Layers, Package, FileText, FileCheck, ShoppingCart, DollarSign, ShieldAlert, Menu } from 'lucide-react';

const ROLE_ALLOWED_TABS: Record<string, string[]> = {
  'Admin': ['overview', 'inventory', 'quotations', 'soa', 'purchasing', 'rfp', 'admin'],
  'Chairman (DCS)': ['overview', 'inventory', 'quotations', 'soa', 'purchasing', 'rfp', 'admin'],
  'General Manager': ['overview', 'inventory', 'quotations', 'soa', 'purchasing', 'rfp', 'admin'],
  'Bookkeeper': ['overview', 'soa', 'purchasing', 'rfp'],
  'Warehouse': ['inventory', 'purchasing'],
  'Marketing': ['overview', 'quotations'],
  'Sales': ['quotations', 'inventory'],
};

export default function Home() {
  const { resetDemoData, formatTimer } = useDemoStore();
  const [viewAsRole, setViewAsRole] = useState('Admin');
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Core Data Arrays
  const [inventoryList, setInventoryList] = useState(DEFAULT_INVENTORY);
  const [replenishmentList, setReplenishmentList] = useState(DEFAULT_REPLENISHMENT_PLANNER);
  const [rfqList, setRfqList] = useState(DEFAULT_RFQS);
  const [quotationsList, setQuotationsList] = useState(DEFAULT_QUOTATIONS);
  const [approvalsList, setApprovalsList] = useState(DEFAULT_APPROVALS);
  const [soaData, setSoaData] = useState({ rows: DEFAULT_SOA_ROWS });
  const [collectionsList, setCollectionsList] = useState(DEFAULT_COLLECTIONS);
  const [poList, setPoList] = useState(DEFAULT_PO_LIST);
  const [rfpList, setRfpList] = useState(DEFAULT_RFP_LIST);
  const [qboQueue, setQboQueue] = useState(DEFAULT_QBO_QUEUE);
  const [auditLogs, setAuditLogs] = useState(DEFAULT_AUDIT_LOGS);
  const [apiOnline, setApiOnline] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Drawers state
  const [isQboQueueOpen, setIsQboQueueOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isProductManagerOpen, setIsProductManagerOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isPwaInstallModalOpen, setIsPwaInstallModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportModalTitle, setExportModalTitle] = useState('');
  const [exportModalFilename, setExportModalFilename] = useState('accustandard_report');
  const [exportModalData, setExportModalData] = useState<object[]>([]);
  const [exportElementId, setExportElementId] = useState<string | undefined>(undefined);

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printModalTitle, setPrintModalTitle] = useState('');
  const [printModalElementId, setPrintModalElementId] = useState('');
  const [printModalContent, setPrintModalContent] = useState<React.ReactNode>(null);

  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [isCreateQuotationOpen, setIsCreateQuotationOpen] = useState(false);
  const [isCreatePOOpen, setIsCreatePOOpen] = useState(false);
  const [isPOReceivingModalOpen, setIsPOReceivingModalOpen] = useState(false);
  const [isAddRFPOpen, setIsAddRFPOpen] = useState(false);

  // New Handoff Workflow Modals State
  const [isClientRoiOpen, setIsClientRoiOpen] = useState(false);
  const [isRfqPreviewOpen, setIsRfqPreviewOpen] = useState(false);
  const [isClientAcceptanceOpen, setIsClientAcceptanceOpen] = useState(false);
  const [isVendorInvoiceOpen, setIsVendorInvoiceOpen] = useState(false);
  const [isThreeWayMatchOpen, setIsThreeWayMatchOpen] = useState(false);
  const [isCollectionAllocationOpen, setIsCollectionAllocationOpen] = useState(false);
  const [isStartupImportOpen, setIsStartupImportOpen] = useState(false);
  const [selectedRfqData, setSelectedRfqData] = useState<any>(null);
  const [selectedPoData, setSelectedPoData] = useState<any>(null);

  // Backend-first hydration. Seed data remains an in-memory offline fallback.
  const hydrateFromApi = useCallback(async () => {
    const [readiness, ...responses] = await Promise.all([
      getReadiness(),
      getInventory(),
      getReplenishment(),
      getRFQs(),
      getApprovals(),
      getSOA(),
      getPurchaseOrders(),
      getRFPs(),
      getQBOQueue(),
      getAuditLogs(),
    ]);
    const [inventory, replenishment, rfqs, approvals, soa, purchaseOrders, rfps, qboQueueData, logs] = responses;
    setApiOnline(readiness?.status === 'ready');
    if (Array.isArray(inventory)) setInventoryList(inventory);
    if (Array.isArray(replenishment)) setReplenishmentList(replenishment);
    if (Array.isArray(rfqs)) setRfqList(rfqs);
    if (Array.isArray(approvals)) setApprovalsList(approvals);
    if (Array.isArray(soa)) setSoaData({ rows: soa });
    if (Array.isArray(purchaseOrders)) setPoList(purchaseOrders);
    if (Array.isArray(rfps)) setRfpList(rfps);
    if (Array.isArray(qboQueueData)) setQboQueue(qboQueueData);
    if (Array.isArray(logs)) setAuditLogs(logs);
  }, []);

  useEffect(() => {
    void hydrateFromApi();
  }, [hydrateFromApi]);

  // Noticeable Confirmation Notification Helper (Popup Window Modal)
  const showNotification = (msg: string) => {
    setToastMessage(msg);
  };

  // Audit Log Helper
  const addAuditLog = (action: string) => {
    const newLog = {
      id: `log-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user: viewAsRole,
      action,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Tab Selection with Strict RBAC Check
  const handleSelectTab = (tab: string) => {
    const allowed = ROLE_ALLOWED_TABS[viewAsRole] || [];
    if (!allowed.includes(tab)) {
      showNotification(`Access Restricted: Role [${viewAsRole}] cannot access the ${tab.toUpperCase()} module.`);
      return;
    }
    setActiveTab(tab);
  };

  // Handle Role Change & Auto-Navigate to Allowed Tab
  const handleChangeRole = (role: string) => {
    setViewAsRole(role);
    const allowed = ROLE_ALLOWED_TABS[role] || ['overview'];
    if (!allowed.includes(activeTab)) {
      setActiveTab(allowed[0]);
    }
    showNotification(`Switched role simulation view to: ${role}`);
    addAuditLog(`Role switched to [${role}]`);
  };

  // Handle Quotation Submit (Dynamic Update & Soft Stock Reservation)
  const handleSubmitQuotation = async (newQuote: any): Promise<boolean> => {
    const newRfq = {
      id: `rfq-${Date.now()}`,
      rfqNo: `RFQ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      customerName: newQuote.facilityName || newQuote.clientFacility || 'Allied Care Experts Medical Center',
      address: newQuote.address || newQuote.clientAddress || 'Baliuag, Bulacan',
      addressee: newQuote.clientName || 'Dr. Amalia Santos',
      addresseePosition: 'Medical Director',
      contactPerson: `${newQuote.clientName || 'Procurement Officer'} (${newQuote.qrn})`,
      requestedBy: 'Sales Officer (Logged In)',
      censusPerDay: 180,
      dailyCensus: 180,
      lisConnectivity: true,
      expectedContractMonths: 36,
      marketingRoiStatus: 'ROI_COMPLETED',
      proposedSellingPrice: Number(newQuote.totalAmount || newQuote.unitPrice || 0),
      landedCostPerUnit: Number(newQuote.unitPrice || 0),
      expectedMarginPct: Number(newQuote.marginPct || 30.8),
    };

    let savedRfq = newRfq;
    if (apiOnline) {
      try {
        const created = await createRFQ(newRfq);
        if (!created) throw new Error('The API did not commit the RFQ.');
        savedRfq = created;
      } catch (error) {
        showNotification(`RFQ was not committed: ${error instanceof Error ? error.message : 'API error'}`);
        return false;
      }
    }

    setQuotationsList((prev: any[]) => [newQuote, ...prev]);
    setRfqList((prev: any[]) => [savedRfq, ...prev]);
    setSelectedRfqData(savedRfq);

    // Soft-reserve stock for the selected item
    setInventoryList((prev) =>
      prev.map((item) => {
        if (item.sku === newQuote.sku) {
          const newReserved = item.reserved + (newQuote.quantity || 1);
          const newAvail = Math.max(0, item.onHand - newReserved);
          return { ...item, reserved: newReserved, available: newAvail };
        }
        return item;
      })
    );

    setApprovalsList((prev) => [
      {
        id: `app-sq-${Date.now()}`,
        qrn: newQuote.qrn,
        type: 'Sales Quotation',
        maker: newQuote.clientName || 'Sales Agent',
        reviewerStatus: 'PENDING',
        gmStatus: 'PENDING',
        dcsStatus: 'NOT_REQUIRED',
        totalAmount: newQuote.totalAmount || newQuote.unitPrice || 31500.0,
        ownerRole: 'Marketing',
        currentStage: 'PENDING_MARKETING_REVIEW',
      },
      ...prev,
    ]);

    showNotification(
      apiOnline
        ? `RFQ ${savedRfq.rfqNo} committed. Quote approval and stock reservation remain UI preview-only.`
        : `Offline demo preview only: Sales Quote ${newQuote.qrn} was not persisted.`
    );
    addAuditLog(
      apiOnline
        ? `Committed RFQ ${savedRfq.rfqNo}; Sales Quote ${newQuote.qrn} remains demo-only`
        : `Demo-only preview of Sales Quote ${newQuote.qrn}`
    );
    setActiveTab('quotations');
    return true;
  };

  // Handle Multi-SOA Collection Check Allocation (Dynamic Update of SOA Ledger)
  const handleAllocateCollection = async (
    checkNo: string,
    bank: string,
    checkAmount: number,
    allocations: { invoiceNo: string; amount: number }[]
  ): Promise<boolean> => {
    if (apiOnline) {
      try {
        const result = await allocateCollection({
          checkNo,
          bank,
          amount: checkAmount,
          allocations,
        });
        if (!result) throw new Error('The API did not commit the collection allocation.');
        const refreshedSoa = await getSOA();
        if (Array.isArray(refreshedSoa)) setSoaData({ rows: refreshedSoa });
        showNotification(`Collection ${checkNo} committed to the Go API. SOA refreshed.`);
        addAuditLog(`Committed Multi-SOA Check #${checkNo} through the Go API`);
        return true;
      } catch (error) {
        showNotification(`Collection was not committed: ${error instanceof Error ? error.message : 'API error'}`);
        return false;
      }
    }

    let totalAllocated = 0;
    const updatedRows = soaData.rows.map((row) => {
      const match = allocations.find(
        (a) => a.invoiceNo === row.salesInvoiceNo
      );
      if (match && match.amount > 0) {
        totalAllocated += match.amount;
        const newAmountPaid = (Number(row.amountPaid) || 0) + match.amount;
        const newInvoiceBalance = Math.max(0, (Number(row.invoiceAmount) || 0) - newAmountPaid);
        return {
          ...row,
          amountPaid: newAmountPaid,
          invoiceBalance: newInvoiceBalance,
        };
      }
      return row;
    });

    // Recalculate running balances across all rows
    let cumBalance = 0;
    const recomputedRows = updatedRows.map((row) => {
      cumBalance += Number(row.invoiceBalance) || 0;
      return {
        ...row,
        runningBalance: cumBalance,
      };
    });

    const unappliedCredit = Math.max(0, checkAmount - totalAllocated);

    setSoaData({ rows: recomputedRows });
    setCollectionsList((prev: any[]) => [
      {
        id: `col-${Date.now()}`,
        checkNo,
        bank,
        date: new Date().toISOString().split('T')[0],
        amount: checkAmount,
        customer: 'GATCHALIAN MEDICAL LABORATORY',
        allocatedInvoices: allocations.map((a) => ({ invoiceNo: a.invoiceNo, allocatedAmount: a.amount })),
        unappliedCredit,
        status: 'POSTED_TO_QBO',
      },
      ...prev,
    ]);

    setQboQueue((prev) => [
      {
        id: `qbo-col-${Date.now()}`,
        docType: 'Customer Payment Collection',
        docNumber: checkNo,
        entityName: 'GATCHALIAN MEDICAL LABORATORY',
        amount: checkAmount,
        qboRefId: 'Awaiting Sync',
        syncStatus: 'QUEUED',
        lastAttempt: new Date().toLocaleString(),
        errorMessage: '',
      },
      ...prev,
    ]);

    showNotification(`Offline demo preview only: Multi-SOA Check #${checkNo} was not persisted.`);
    addAuditLog(`Demo-only preview of Multi-SOA Check #${checkNo} (Unapplied Credit: ₱${unappliedCredit.toLocaleString()})`);
    return true;
  };

  // Handle goods receipt receiving, inventory, PO, and WMA updates.
  const handleReceivePO = async (poId: string, receivedQty: number, details?: { batchNumber?: string; serialNumber?: string }): Promise<boolean> => {
    const targetPo = poList.find((po) => po.id === poId);
    if (!targetPo || receivedQty <= 0) {
      showNotification('Receiving blocked: select a valid PO and enter a positive quantity.');
      return false;
    }
    if (targetPo.rrQtyReceived + receivedQty > targetPo.poQty) {
      showNotification(`HARD BLOCK: receipt exceeds ${targetPo.poNumber} approved quantity.`);
      addAuditLog(`Blocked over-receipt attempt for PO ${targetPo.poNumber}`);
      return false;
    }

    if (apiOnline) {
      try {
        const saved = await receiveGoods({
          poNumber: targetPo.poNumber,
          qtyReceived: receivedQty,
          batchNumber: details?.batchNumber,
          serialNumber: details?.serialNumber,
          locationCode: (targetPo as any).locationCode || 'PAM',
        });
        if (!saved) throw new Error('The API did not commit the goods receipt.');
        setPoList((prev) => prev.map((po) => (
          po.id === saved.id || po.poNumber === saved.poNumber ? saved : po
        )));
        const refreshedInventory = await getInventory();
        if (Array.isArray(refreshedInventory)) setInventoryList(refreshedInventory);
        showNotification(`Goods Receipt for ${targetPo.poNumber} committed to the Go API.`);
        addAuditLog(`Committed ${receivedQty} units for PO ${targetPo.poNumber} through the Go API`);
        return true;
      } catch (error) {
        showNotification(`Goods Receipt was not committed: ${error instanceof Error ? error.message : 'API error'}`);
        return false;
      }
    }

    setPoList((prev) =>
      prev.map((po) => {
        if (po.id === poId) {
          const newRR = po.rrQtyReceived + receivedQty;
          const newStatus = newRR >= po.poQty ? 'AWAITING_VENDOR_INVOICE' : 'PARTIALLY_RECEIVED';
          return { ...po, rrQtyReceived: newRR, status: newStatus };
        }
        return po;
      })
    );

    if (targetPo) {
      setInventoryList((prev) => {
        const existingIndex = prev.findIndex((item) => item.sku === targetPo.sku);
        if (existingIndex >= 0) {
          return prev.map((item, idx) => {
            if (idx === existingIndex) {
              const oldQty = item.onHand;
              const oldWma = item.wmaCost || 500;
              const incomingUnitCost = targetPo.totalAmount / targetPo.poQty;
              const newWma = Number(((oldQty * oldWma + receivedQty * incomingUnitCost) / (oldQty + receivedQty)).toFixed(2));

              const newOnHand = oldQty + receivedQty;
              const newAvail = newOnHand - item.reserved;
              return { ...item, onHand: newOnHand, available: newAvail, wmaCost: newWma };
            }
            return item;
          });
        } else {
          const incomingUnitCost = targetPo.totalAmount / targetPo.poQty;
          return [
            ...prev,
            {
              id: `inv-${Date.now()}`,
              sku: targetPo.sku || 'ACC-REC-01',
              description: targetPo.itemDescription || 'Received Goods Batch',
              location: 'Pampanga',
              lotNumber: details?.batchNumber || `LOT-2026-${Math.floor(100 + Math.random() * 900)}`,
              expiryDate: '2028-06-30',
              onHand: receivedQty,
              reserved: 0,
              available: receivedQty,
              unit: 'Boxes',
              wmaCost: Number(incomingUnitCost.toFixed(2)),
              status: 'NORMAL',
            },
          ];
        }
      });
    }

    showNotification(`Offline demo preview only: Goods Receipt for PO ${targetPo.poNumber} was not persisted.`);
    addAuditLog(`Demo-only preview of ${receivedQty} units for PO ${targetPo.poNumber}`);
    return true;
  };

  // Handle RFP Release
  const handleReleaseRFP = async (id: string, bank: string, refNo: string): Promise<boolean> => {
    if (apiOnline) {
      try {
        const saved = await releaseRFP(id, { bank, refNo });
        if (!saved) throw new Error('The API did not commit the RFP release.');
        setRfpList((prev) => prev.map((rfp) => (
          rfp.id === saved.id || rfp.rfpNo === saved.rfpNo ? saved : rfp
        )));
        showNotification(`RFP ${saved.rfpNo || id} release committed to the Go API.`);
        addAuditLog(`Committed RFP release ${saved.rfpNo || id} through the Go API`);
        return true;
      } catch (error) {
        showNotification(`RFP release was not committed: ${error instanceof Error ? error.message : 'API error'}`);
        return false;
      }
    }

    setRfpList((prev) =>
      prev.map((rfp) => {
        if (rfp.id === id) {
          return {
            ...rfp,
            status: 'DISBURSED_PAID',
            releasedBank: bank,
            releasedRefNo: refNo,
          };
        }
        return rfp;
      })
    );
    showNotification(`Offline demo preview only: RFP #${id} release was not persisted.`);
    addAuditLog(`Demo-only preview of RFP #${id} disbursement from ${bank}`);
    return true;
  };

  // Handle Add Stock Batch
  const handleAddStock = (newStock: any) => {
    setInventoryList((prev) => [
      {
        id: `inv-${Date.now()}`,
        sku: newStock.sku,
        description: newStock.description,
        location: newStock.location,
        lotNumber: newStock.lotNumber,
        expiryDate: newStock.expiryDate,
        onHand: newStock.qty,
        reserved: 0,
        available: newStock.qty,
        unit: newStock.unit || 'Boxes',
        wmaCost: 500.0,
        status: 'NORMAL',
      },
      ...prev,
    ]);
    showNotification(`Preview only: stock batch ${newStock.lotNumber} (${newStock.sku}) was not persisted.`);
    addAuditLog(`Demo-only preview of stock batch ${newStock.lotNumber} (${newStock.sku})`);
  };

  // Handle Purchase Order Submit
  const handleSubmitPO = async (newPO: any): Promise<boolean> => {
    if (apiOnline) {
      try {
        const saved = await createPurchaseOrder(newPO);
        if (!saved) throw new Error('The API did not commit the purchase order.');
        setPoList((prev) => [saved, ...prev]);
        const refreshedApprovals = await getApprovals();
        if (Array.isArray(refreshedApprovals)) setApprovalsList(refreshedApprovals);
        showNotification(`Purchase Order ${saved.poNumber} committed to the Go API.`);
        addAuditLog(`Committed Purchase Order ${saved.poNumber} through the Go API`);
        return true;
      } catch (error) {
        showNotification(`Purchase Order was not committed: ${error instanceof Error ? error.message : 'API error'}`);
        return false;
      }
    }

    setPoList((prev) => [newPO, ...prev]);
    setApprovalsList((prev) => [
      {
        id: `app-po-${Date.now()}`,
        qrn: newPO.poNumber,
        type: 'Purchase Order',
        maker: 'Purchasing Officer',
        reviewerStatus: 'APPROVED',
        gmStatus: 'PENDING',
        dcsStatus: 'PENDING',
        totalAmount: newPO.totalAmount,
        ownerRole: 'Bookkeeper',
        currentStage: 'PENDING_ACCOUNTING_REVIEW',
      },
      ...prev,
    ]);
    showNotification(`Offline demo preview only: Purchase Order ${newPO.poNumber} was not persisted.`);
    addAuditLog(`Demo-only preview of Purchase Order ${newPO.poNumber}`);
    return true;
  };

  // Handle RFP Submit
  const handleSubmitRFP = async (newRFP: any): Promise<boolean> => {
    if (apiOnline) {
      try {
        const saved = await createRFP(newRFP);
        if (!saved) throw new Error('The API did not commit the RFP.');
        setRfpList((prev) => [saved, ...prev]);
        const refreshedApprovals = await getApprovals();
        if (Array.isArray(refreshedApprovals)) setApprovalsList(refreshedApprovals);
        showNotification(`RFP ${saved.rfpNo} committed to the Go API.`);
        addAuditLog(`Committed RFP ${saved.rfpNo} through the Go API`);
        return true;
      } catch (error) {
        showNotification(`RFP was not committed: ${error instanceof Error ? error.message : 'API error'}`);
        return false;
      }
    }

    setRfpList((prev) => [newRFP, ...prev]);
    setApprovalsList((prev) => [
      {
        id: `app-rfp-${Date.now()}`,
        qrn: newRFP.rfpNo,
        type: 'Request for Payment',
        maker: newRFP.requestedBy || 'Bookkeeper',
        reviewerStatus: 'APPROVED',
        gmStatus: 'PENDING',
        dcsStatus: 'PENDING',
        totalAmount: newRFP.amount,
        ownerRole: 'General Manager',
        currentStage: 'PENDING_GM_APPROVAL',
      },
      ...prev,
    ]);
    showNotification(`Offline demo preview only: RFP Voucher ${newRFP.rfpNo} was not persisted.`);
    addAuditLog(`Demo-only preview of Payment Voucher ${newRFP.rfpNo}`);
    return true;
  };

  // Handle Approval Action
  const handleApproveItem = async (id: string, stage: string): Promise<boolean> => {
    const target = approvalsList.find((item) => item.id === id);
    if (!target) return false;
    if (stage === 'dcs' && target.type === 'Sales Quotation') {
      showNotification('Sales Quotes do not have a DCS approval stage.');
      return false;
    }
    const isPOAccountingReview = stage === 'reviewer' && target.type === 'Purchase Order';
    if (stage === 'reviewer' && !['Admin', 'Marketing'].includes(viewAsRole) && !(isPOAccountingReview && viewAsRole === 'Bookkeeper')) {
      showNotification(`Permission Denied: Role [${viewAsRole}] cannot execute Reviewer Approval.`);
      return false;
    }
    if (stage === 'gm' && !['Admin', 'General Manager'].includes(viewAsRole)) {
      showNotification(`Permission Denied: Role [${viewAsRole}] cannot execute GM Approval.`);
      return false;
    }
    if (stage === 'dcs' && !['Admin', 'Chairman (DCS)'].includes(viewAsRole)) {
      showNotification(`Permission Denied: Role [${viewAsRole}] cannot execute DCS Chairman Approval.`);
      return false;
    }

    if (apiOnline) {
      try {
        const role = stage === 'reviewer'
          ? (isPOAccountingReview ? 'Accounting' : 'Marketing')
          : stage === 'gm'
            ? 'General Manager'
            : 'Chairman (DCS)';
        const saved = await updateApproval(id, 'approve', viewAsRole === 'Admin' ? 'Admin' : role);
        if (!saved) throw new Error('The API did not commit the approval.');
        setApprovalsList((prev) => prev.map((item) => (
          item.id === saved.id || item.qrn === saved.qrn ? saved : item
        )));
        const refreshedRfps = await getRFPs();
        if (Array.isArray(refreshedRfps)) setRfpList(refreshedRfps);
        showNotification(`Approval stage ${stage.toUpperCase()} committed to the Go API.`);
        addAuditLog(`Committed ${stage.toUpperCase()} approval for ${id} through the Go API`);
        return true;
      } catch (error) {
        showNotification(`Approval was not committed: ${error instanceof Error ? error.message : 'API error'}`);
        return false;
      }
    }

    setApprovalsList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (stage === 'reviewer') return { ...item, reviewerStatus: 'APPROVED' };
          if (stage === 'gm') return { ...item, gmStatus: 'APPROVED' };
          if (stage === 'dcs') return { ...item, dcsStatus: 'APPROVED' };
        }
        return item;
      })
    );
    showNotification(`Offline demo preview only: approval stage ${stage.toUpperCase()} was not persisted.`);
    addAuditLog(`Demo-only preview of ${stage.toUpperCase()} approval for item #${id}`);
    return true;
  };

  const handleTriggerQboSync = async (qboId: string): Promise<boolean> => {
    if (apiOnline) {
      try {
        const saved = await syncQBOItem(qboId);
        if (!saved) throw new Error('The API did not commit the queue sync.');
        setQboQueue((prev) => prev.map((item) => (
          item.id === saved.id || item.docNumber === saved.docNumber ? saved : item
        )));
        showNotification(`Queue item ${saved.docNumber || qboId} committed to the Go API.`);
        addAuditLog(`Committed QBO queue action for ${saved.docNumber || qboId} through the Go API`);
        return true;
      } catch (error) {
        showNotification(`Queue sync was not committed: ${error instanceof Error ? error.message : 'API error'}`);
        return false;
      }
    }

    setQboQueue((prev) =>
      prev.map((item) => {
        if (item.id === qboId) {
          return {
            ...item,
            syncStatus: 'SYNCED',
            qboRefId: `QBO-POST-${Math.floor(10000 + Math.random() * 90000)}`,
            lastAttempt: new Date().toLocaleString(),
          };
        }
        return item;
      })
    );
    showNotification(`Offline demo preview only: queue item ${qboId} was not posted to QuickBooks.`);
    addAuditLog(`Demo-only preview of QBO queue action for ${qboId}`);
    return true;
  };

  // Open Export Modal Helper
  const handleOpenExportModal = (title: string, filename: string, data: object[], elementId?: string) => {
    setExportModalTitle(title);
    setExportModalFilename(filename);
    setExportModalData(data);
    setExportElementId(elementId);
    setIsExportModalOpen(true);
  };

  // Open Print Modal Helper
  const handleOpenPrintModal = (title: string, elementId: string, content: React.ReactNode) => {
    setPrintModalTitle(title);
    setPrintModalElementId(elementId);
    setPrintModalContent(content);
    setIsPrintModalOpen(true);
  };

  // Reset UI fallback data and request a fresh backend hydration on reload.
  const handleResetData = () => {
    resetDemoData();
    if (apiOnline) {
      void hydrateFromApi();
      showNotification('Reloaded authoritative data from the Go API.');
      return;
    }
    setInventoryList(DEFAULT_INVENTORY);
    setReplenishmentList(DEFAULT_REPLENISHMENT_PLANNER);
    setRfqList(DEFAULT_RFQS);
    setQuotationsList(DEFAULT_QUOTATIONS);
    setApprovalsList(DEFAULT_APPROVALS);
    setSoaData({ rows: DEFAULT_SOA_ROWS });
    setCollectionsList(DEFAULT_COLLECTIONS);
    setPoList(DEFAULT_PO_LIST);
    setRfpList(DEFAULT_RFP_LIST);
    setQboQueue(DEFAULT_QBO_QUEUE);
    setAuditLogs(DEFAULT_AUDIT_LOGS);
    showNotification('Demo data restored to default settings.');
    addAuditLog('Restored system demo state to default seed data');
  };

  const allowedTabs = ROLE_ALLOWED_TABS[viewAsRole] || [];

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex flex-col antialiased selection:bg-blue-600 selection:text-white w-full">
      {/* Top Application Header Bar */}
      <Header
        viewAsRole={viewAsRole}
        onChangeRole={handleChangeRole}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenPWAInstall={() => setIsPwaInstallModalOpen(true)}
        onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
      />

      {/* Confirmation notification modal */}
      <SystemAlertModal message={toastMessage} onClose={() => setToastMessage(null)} viewAsRole={viewAsRole} />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden w-full">
        {/* Desktop Navigation Sidebar */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((collapsed) => !collapsed)}
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          approvalsCount={approvalsList.length}
          inventoryCount={inventoryList.length}
          soaCount={soaData.rows.length}
          auditCount={auditLogs.length}
          formattedTimer={formatTimer()}
          onResetDemo={handleResetData}
          viewAsRole={viewAsRole}
        />

        {/* Feature Module Workspace Container */}
        <main aria-label="Operations workspace" className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 pb-32 lg:pb-8 w-full">
          <div
            role="status"
            className={`rounded-2xl border px-4 py-3 text-xs font-bold ${
              apiOnline
                ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                : 'border-amber-200 bg-amber-50 text-amber-950'
            }`}
          >
            {apiOnline
              ? 'Go API connected. Server-backed mutations show committed results; unsupported workflows remain preview-only.'
              : 'Offline demo preview. Mutations are local only and are not persisted.'}
          </div>
          {activeTab === 'overview' && (
            <ExecutiveOverview
              approvalsList={approvalsList}
              inventoryList={inventoryList}
              soaRows={soaData.rows}
              poList={poList}
              rfpList={rfpList}
              qboQueue={qboQueue}
              viewAsRole={viewAsRole}
              onApproveItem={handleApproveItem}
              onSelectTab={handleSelectTab}
              onOpenScanner={() => setIsScannerOpen(true)}
              onOpenQBOQueue={() => setIsQboQueueOpen(true)}
              onOpenCreateQuotationModal={() => setIsCreateQuotationOpen(true)}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryControl
              inventoryList={inventoryList}
              replenishmentPlannerList={replenishmentList}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onOpenAddStock={() => setIsAddStockOpen(true)}
              onOpenProductManager={() => setIsProductManagerOpen(true)}
              onOpenScanner={() => setIsScannerOpen(true)}
            />
          )}

          {activeTab === 'quotations' && (
            <QuotationGenerator
              rfqList={rfqList}
              quotationsList={quotationsList}
              onUpdateQuotationsList={setQuotationsList}
              onOpenPrintModal={handleOpenPrintModal}
              onOpenExportModal={handleOpenExportModal}
              onOpenCreateModal={() => setIsCreateQuotationOpen(true)}
              onSubmitForApproval={(qrn) => {
                setApprovalsList((prev) => [
                  {
                    id: `app-sq-${Date.now()}`,
                    qrn: qrn,
                    type: 'Sales Quotation',
                    maker: 'Sales Officer (Logged In)',
                    reviewerStatus: 'PENDING',
                    gmStatus: 'PENDING',
                    dcsStatus: 'NOT_REQUIRED',
                    totalAmount: 31500.0,
                    ownerRole: 'Marketing',
                    currentStage: 'PENDING_MARKETING_REVIEW',
                  },
                  ...prev,
                ]);
                showNotification(`Preview only: Sales Quote ${qrn} approval was not persisted.`);
                addAuditLog(`Demo-only preview of Sales Quote ${qrn} approval routing`);
              }}
              onShowNotification={showNotification}
              onAddAuditLog={addAuditLog}
              onOpenClientRoiModal={(rfq) => {
                setSelectedRfqData(rfq || rfqList[0]);
                setIsClientRoiOpen(true);
              }}
              onOpenRfqPreviewModal={(rfq) => {
                setSelectedRfqData(rfq || rfqList[0]);
                setIsRfqPreviewOpen(true);
              }}
              onOpenClientAcceptanceModal={() => {
                setIsClientAcceptanceOpen(true);
              }}
            />
          )}

          {activeTab === 'soa' && (
            <StatementOfAccount
              soaRows={soaData.rows}
              onUpdateSoaRows={(newRows) => setSoaData({ rows: newRows })}
              collectionsList={collectionsList}
              onOpenPrintModal={handleOpenPrintModal}
              onOpenExportModal={handleOpenExportModal}
              onShowNotification={showNotification}
              onAddAuditLog={addAuditLog}
              onAllocateCollection={handleAllocateCollection}
            />
          )}

          {activeTab === 'purchasing' && (
            <PurchasingReceiving
              poList={poList}
              onOpenAddPO={() => setIsCreatePOOpen(true)}
              onOpenReceivingModal={() => setIsPOReceivingModalOpen(true)}
              onOpenVendorInvoiceModal={(po) => {
                setSelectedPoData(po);
                setIsVendorInvoiceOpen(true);
              }}
              onOpenThreeWayMatchModal={(po) => {
                setSelectedPoData(po);
                setIsThreeWayMatchOpen(true);
              }}
            />
          )}

          {activeTab === 'rfp' && (
            <RequestForPayment
              rfpList={rfpList}
              onOpenAddRFP={() => setIsAddRFPOpen(true)}
              onReleaseRFP={handleReleaseRFP}
            />
          )}

          {activeTab === 'admin' && (
            <SystemAuditTrail
              auditLogs={auditLogs}
              viewAsRole={viewAsRole}
              onShowNotification={showNotification}
              onAddAuditLog={addAuditLog}
              onOpenStartupImportModal={() => setIsStartupImportOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <CreateQuotationModal
        isOpen={isCreateQuotationOpen}
        onClose={() => setIsCreateQuotationOpen(false)}
        inventoryList={inventoryList}
        onSubmitQuotation={handleSubmitQuotation}
      />

      <CreatePOModal
        isOpen={isCreatePOOpen}
        onClose={() => setIsCreatePOOpen(false)}
        inventoryList={inventoryList}
        onSubmitPO={handleSubmitPO}
        existingPOs={poList}
      />

      <ReceivingReportModal
        isOpen={isPOReceivingModalOpen}
        onClose={() => setIsPOReceivingModalOpen(false)}
        poList={poList}
        onReceivePO={handleReceivePO}
      />

      <CreateRFPModal
        isOpen={isAddRFPOpen}
        onClose={() => setIsAddRFPOpen(false)}
        onSubmitRFP={handleSubmitRFP}
      />

      <AddStockModal
        isOpen={isAddStockOpen}
        onClose={() => setIsAddStockOpen(false)}
        onAddStockBatch={handleAddStock}
      />

      <QBOSyncQueueModal
        isOpen={isQboQueueOpen}
        onClose={() => setIsQboQueueOpen(false)}
        qboQueue={qboQueue}
        onTriggerSync={handleTriggerQboSync}
      />

      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={(sku) => {
          showNotification(`Scanned Barcode SKU: ${sku}`);
          addAuditLog(`Scanned Barcode SKU ${sku}`);
          setSearchQuery(sku);
          setActiveTab('inventory');
        }}
        onOpenProductManager={() => setIsProductManagerOpen(true)}
      />

      <BarcodeProductManagerModal
        isOpen={isProductManagerOpen}
        onClose={() => setIsProductManagerOpen(false)}
        products={inventoryList as any}
        onAddProduct={(newProd) => {
          setInventoryList((prev) => [newProd as any, ...prev]);
          showNotification(`Preview only: product SKU ${newProd.sku} was not persisted.`);
          addAuditLog(`Demo-only preview of product SKU registration: ${newProd.sku}`);
        }}
        onUpdateProduct={(updatedProd) => {
          setInventoryList((prev) => prev.map((p) => (p.id === updatedProd.id ? (updatedProd as any) : p)));
          showNotification(`Preview only: product SKU ${updatedProd.sku} changes were not persisted.`);
          addAuditLog(`Demo-only preview of product SKU revision: ${updatedProd.sku}`);
        }}
        onDeleteProduct={(prodId) => {
          setInventoryList((prev) => prev.filter((p) => p.id !== prodId));
          showNotification('Preview only: product SKU removal was not persisted.');
          addAuditLog('Demo-only preview of product SKU removal');
        }}
      />

      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={handleSelectTab}
      />

      <MobileNavDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        viewAsRole={viewAsRole}
        onChangeRole={handleChangeRole}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenPWAInstall={() => setIsPwaInstallModalOpen(true)}
        approvalsCount={approvalsList.length}
        inventoryCount={inventoryList.length}
        soaCount={soaData.rows.length}
        auditCount={auditLogs.length}
      />

      <BottomNav
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
        allowedTabs={allowedTabs}
      />

      <PWAInstallModal
        isOpen={isPwaInstallModalOpen}
        onClose={() => setIsPwaInstallModalOpen(false)}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title={exportModalTitle}
        filename={exportModalFilename}
        data={exportModalData}
        printableElementId={exportElementId}
      />

      <DocumentPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        title={printModalTitle}
        elementId={printModalElementId}
      >
        {printModalContent}
      </DocumentPrintModal>

      {/* Confirmed Developer Handoff Workflow Modals */}
      <ClientFormatROICalculatorModal
        isOpen={isClientRoiOpen}
        onClose={() => setIsClientRoiOpen(false)}
        rfqData={selectedRfqData}
        onSaveROI={(roi) => {
          showNotification(`Client-Format ROI Calculator linked! Payback Period: ${roi.roiYears.toFixed(2)} Years`);
          addAuditLog(`Saved Client-Format ROI calculation matching REVISED ROI_ACE PATEROS.xlsx (${roi.roiYears.toFixed(2)} yrs)`);
        }}
      />

      <RFQDocumentPreviewModal
        isOpen={isRfqPreviewOpen}
        onClose={() => setIsRfqPreviewOpen(false)}
        rfqData={selectedRfqData}
      />

      <ClientAcceptanceModal
        isOpen={isClientAcceptanceOpen}
        onClose={() => setIsClientAcceptanceOpen(false)}
        quotationData={{ qrn: 'QRN20240415037' }}
        onConfirmAcceptance={(evidence) => {
          setQuotationsList((prev) =>
            prev.map((q) => (q.qrn === evidence.quotationId || q.id === evidence.quotationId ? { ...q, status: 'CLIENT_APPROVED' } : q))
          );
          showNotification('Preview only: client acceptance evidence was not persisted or used to unlock fulfillment.');
          addAuditLog(`Demo-only preview of client acceptance evidence (${evidence.clientPONumber})`);
        }}
      />

      <VendorInvoiceModal
        isOpen={isVendorInvoiceOpen}
        onClose={() => setIsVendorInvoiceOpen(false)}
        poData={selectedPoData || { qrn: 'PO-2026-0891', totalAmount: 142000.0 }}
        onSaveInvoice={(inv) => {
          showNotification(`Preview only: Vendor Invoice ${inv.invoiceNo} was not persisted.`);
          addAuditLog(`Demo-only preview of Vendor Invoice ${inv.invoiceNo} for PO ${inv.poNo}`);
        }}
      />

      <ThreeWayMatchModal
        isOpen={isThreeWayMatchOpen}
        onClose={() => setIsThreeWayMatchOpen(false)}
        poData={selectedPoData || { qrn: 'PO-2026-0891', totalAmount: 142000.0 }}
        onConfirmVerification={(match) => {
          showNotification('Preview only: 3-Way Match evidence was not persisted or used to unlock payment.');
          addAuditLog(`Demo-only preview of 3-Way Match verification for PO ${match.poNo}`);
        }}
      />

      <CollectionAllocationModal
        isOpen={isCollectionAllocationOpen}
        onClose={() => setIsCollectionAllocationOpen(false)}
        collectionData={collectionsList[0] || { amount: 25000.0 }}
        onConfirmAllocation={(alloc) => handleAllocateCollection(
          alloc.checkNo,
          'BDO Unibank',
          Number(alloc.paymentAmount),
          alloc.allocations.map((item: any) => ({
            invoiceNo: item.salesInvoiceNo,
            amount: Number(item.allocatedAmount),
          }))
        )}
      />

      <StartupImportModal
        isOpen={isStartupImportOpen}
        onClose={() => setIsStartupImportOpen(false)}
        onImportComplete={(summary) => {
          showNotification(`Preview only: startup data batch ${summary.batchId} was not persisted or reconciled.`);
          addAuditLog(`Demo-only preview of startup data import batch ${summary.batchId} (${summary.validRecords} records)`);
        }}
      />
    </div>
  );
}
