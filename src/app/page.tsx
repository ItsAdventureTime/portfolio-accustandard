'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
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
import { NotificationCenter, useNotificationQueue } from '@/components/common/NotificationCenter';
import { AnimeReveal } from '@/components/common/AnimeReveal';
import { AttentionBox } from '@/components/common/AttentionBox';
import {
  canApproveApprovalStage,
  DEFAULT_ROLE,
  getAllowedTabs,
  type Role,
  type ApprovalStage,
  selectRoleScopedDashboardData,
} from '@/lib/permissions';
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
  setDemoRole,
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

export default function Home() {
  const { resetDemoData } = useDemoStore();
  const [viewAsRole, setViewAsRole] = useState<Role>(DEFAULT_ROLE);
  const [activeTab, setActiveTab] = useState('overview');
  const { notifications, notify: showNotification, dismiss: dismissNotification } = useNotificationQueue();

  // Core Data Arrays
  const [inventoryList, setInventoryList] = useState(DEFAULT_INVENTORY);
  const [replenishmentList, setReplenishmentList] = useState(DEFAULT_REPLENISHMENT_PLANNER);
  const [rfqList, setRfqList] = useState(DEFAULT_RFQS);
  const [quotationsList, setQuotationsList] = useState(DEFAULT_QUOTATIONS);
  const [approvalsList, setApprovalsList] = useState(DEFAULT_APPROVALS);
  const [soaData, setSoaData] = useState({ rows: [] as any[] });
  const [collectionsList, setCollectionsList] = useState(DEFAULT_COLLECTIONS);
  const [poList, setPoList] = useState(DEFAULT_PO_LIST);
  const [rfpList, setRfpList] = useState(DEFAULT_RFP_LIST);
  const [qboQueue, setQboQueue] = useState(DEFAULT_QBO_QUEUE);
  const [auditLogs, setAuditLogs] = useState(DEFAULT_AUDIT_LOGS);
  const [apiOnline, setApiOnline] = useState(false);
  const [isHydrating, setIsHydrating] = useState(false);
  const [dataState, setDataState] = useState<'loading' | 'live' | 'offline'>('loading');

  const roleScopedData = useMemo(() => selectRoleScopedDashboardData({
    role: viewAsRole,
    approvals: approvalsList,
    inventory: inventoryList,
    rfqs: rfqList,
    quotations: quotationsList,
    purchaseOrders: poList,
    soaRows: soaData.rows,
    qboQueue,
  }), [approvalsList, inventoryList, poList, qboQueue, quotationsList, rfqList, soaData.rows, viewAsRole]);

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
    setIsHydrating(true);
    setDataState('loading');
    try {
      const apiRequests = Promise.all([
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
      let hydrationTimeout: ReturnType<typeof setTimeout> | undefined;
      const hydration = await Promise.race([
        apiRequests,
        new Promise<null>((resolve) => {
          hydrationTimeout = setTimeout(() => resolve(null), 4000);
        }),
      ]);
      if (hydrationTimeout) clearTimeout(hydrationTimeout);
      if (!hydration) {
        setApiOnline(false);
        setDataState('offline');
        setSoaData({ rows: DEFAULT_SOA_ROWS });
        return;
      }

      const [readiness, ...responses] = hydration;
      const [inventory, replenishment, rfqs, approvals, soa, purchaseOrders, rfps, qboQueueData, logs] = responses;
      setApiOnline(readiness?.status === 'ready');
      setDataState(readiness?.status === 'ready' ? 'live' : 'offline');
      if (readiness?.status !== 'ready') setSoaData({ rows: DEFAULT_SOA_ROWS });
      if (Array.isArray(inventory)) setInventoryList(inventory);
      if (Array.isArray(replenishment)) setReplenishmentList(replenishment);
      if (Array.isArray(rfqs)) setRfqList(rfqs);
      if (Array.isArray(approvals)) setApprovalsList(approvals);
      if (Array.isArray(soa)) setSoaData({ rows: soa });
      if (Array.isArray(purchaseOrders)) setPoList(purchaseOrders);
      if (Array.isArray(rfps)) setRfpList(rfps);
      if (Array.isArray(qboQueueData)) setQboQueue(qboQueueData);
      if (Array.isArray(logs)) setAuditLogs(logs);
    } catch {
      setApiOnline(false);
      setDataState('offline');
      setSoaData({ rows: DEFAULT_SOA_ROWS });
    } finally {
      setIsHydrating(false);
    }
  }, []);

  useEffect(() => {
    void hydrateFromApi();
  }, [hydrateFromApi]);

  // Audit Log Helper
  const addAuditLog = (action: string, actorRole: Role = viewAsRole) => {
    const newLog = {
      id: `log-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user: actorRole,
      action,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Tab Selection with Strict RBAC Check
  const handleSelectTab = (tab: string) => {
    const allowed = getAllowedTabs(viewAsRole);
    if (!allowed.includes(tab)) {
      showNotification({ severity: 'warning', title: 'Access restricted', message: `Role [${viewAsRole}] cannot access the ${tab.toUpperCase()} module.` });
      return;
    }
    setActiveTab(tab);
  };

  // Handle Role Change & Auto-Navigate to Allowed Tab
  const handleChangeRole = (role: Role) => {
    setDemoRole(role);
    setViewAsRole(role);
    const allowed = getAllowedTabs(role);
    if (!allowed.includes(activeTab)) {
      setActiveTab(allowed[0]);
    }
    showNotification({ severity: 'info', title: 'Demo role changed', message: `Switched role simulation view to ${role}.` });
    addAuditLog(`Role switched to [${role}]`, role);
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
        showNotification({ severity: 'error', title: 'RFQ was not committed', message: error instanceof Error ? error.message : 'API error' });
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

    showNotification({
      severity: apiOnline ? 'success' : 'info',
      title: apiOnline ? 'RFQ committed' : 'Preview only',
      message: apiOnline
        ? `RFQ ${savedRfq.rfqNo} committed. Quote approval and stock reservation remain UI preview-only.`
        : `Sales Quote ${newQuote.qrn} was not persisted.`,
    });
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
        showNotification({ severity: 'success', title: 'Collection committed', message: `Collection ${checkNo} committed to the Go API. SOA refreshed.` });
        addAuditLog(`Committed Multi-SOA Check #${checkNo} through the Go API`);
        return true;
      } catch (error) {
        showNotification({ severity: 'error', title: 'Collection was not committed', message: error instanceof Error ? error.message : 'API error' });
        return false;
      }
    }

    const totalAllocated = allocations.reduce((sum, allocation) => sum + allocation.amount, 0);
    const unappliedCredit = Math.max(0, checkAmount - totalAllocated);

    showNotification({ severity: 'info', title: 'Preview only', message: `Multi-SOA Check #${checkNo} was not persisted or queued for sync.` });
    addAuditLog(`Demo-only preview of Multi-SOA Check #${checkNo} (Unapplied Credit: ₱${unappliedCredit.toLocaleString()})`);
    return true;
  };

  // Handle Goods Receipt Receiving (Dynamic Inventory, PO & WMA Cost Update)
  const handleReceivePO = async (poId: string, receivedQty: number, details?: { batchNumber?: string; serialNumber?: string }): Promise<boolean> => {
    const targetPo = poList.find((po) => po.id === poId);
    if (!targetPo || receivedQty <= 0) {
      showNotification({ severity: 'error', title: 'Receiving blocked', message: 'Select a valid PO and enter a positive quantity.' });
      return false;
    }
    if (targetPo.rrQtyReceived + receivedQty > targetPo.poQty) {
      showNotification({ severity: 'error', title: 'Receiving blocked', message: `Receipt exceeds ${targetPo.poNumber} approved quantity.` });
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
        showNotification({ severity: 'success', title: 'Goods receipt committed', message: `Goods receipt for ${targetPo.poNumber} committed to the Go API.` });
        addAuditLog(`Committed ${receivedQty} units for PO ${targetPo.poNumber} through the Go API`);
        return true;
      } catch (error) {
        showNotification({ severity: 'error', title: 'Goods receipt was not committed', message: error instanceof Error ? error.message : 'API error' });
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

    showNotification({ severity: 'info', title: 'Preview only', message: `Goods receipt for PO ${targetPo.poNumber} was not persisted.` });
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
        showNotification({ severity: 'success', title: 'RFP release committed', message: `RFP ${saved.rfpNo || id} release committed to the Go API.` });
        addAuditLog(`Committed RFP release ${saved.rfpNo || id} through the Go API`);
        return true;
      } catch (error) {
        showNotification({ severity: 'error', title: 'RFP release was not committed', message: error instanceof Error ? error.message : 'API error' });
        return false;
      }
    }

    showNotification({ severity: 'info', title: 'Preview only', message: `RFP #${id} release was not persisted or marked paid.` });
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
    showNotification({ severity: 'info', title: 'Preview only', message: `Stock batch ${newStock.lotNumber} (${newStock.sku}) was not persisted.` });
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
        showNotification({ severity: 'success', title: 'Purchase order committed', message: `Purchase order ${saved.poNumber} committed to the Go API.` });
        addAuditLog(`Committed Purchase Order ${saved.poNumber} through the Go API`);
        return true;
      } catch (error) {
        showNotification({ severity: 'error', title: 'Purchase order was not committed', message: error instanceof Error ? error.message : 'API error' });
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
    showNotification({ severity: 'info', title: 'Preview only', message: `Purchase order ${newPO.poNumber} was not persisted.` });
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
        showNotification({ severity: 'success', title: 'RFP committed', message: `RFP ${saved.rfpNo} committed to the Go API.` });
        addAuditLog(`Committed RFP ${saved.rfpNo} through the Go API`);
        return true;
      } catch (error) {
        showNotification({ severity: 'error', title: 'RFP was not committed', message: error instanceof Error ? error.message : 'API error' });
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
    showNotification({ severity: 'info', title: 'Preview only', message: `RFP voucher ${newRFP.rfpNo} was not persisted.` });
    addAuditLog(`Demo-only preview of Payment Voucher ${newRFP.rfpNo}`);
    return true;
  };

  // Handle Approval Action
  const handleApproveItem = async (id: string, stage: ApprovalStage): Promise<boolean> => {
    const target = approvalsList.find((item) => item.id === id);
    if (!target) return false;
    if (stage === 'dcs' && target.type === 'Sales Quotation') {
      showNotification({ severity: 'info', title: 'Approval routing', message: 'Sales Quotes do not have a DCS approval stage.' });
      return false;
    }
    if (!canApproveApprovalStage(viewAsRole, stage, target)) {
      showNotification({ severity: 'info', title: 'Access restricted', message: `Role [${viewAsRole}] cannot execute ${stage.toUpperCase()} approval.` });
      return false;
    }

    if (apiOnline) {
      try {
        const saved = await updateApproval(id, 'approve');
        if (!saved) throw new Error('The API did not commit the approval.');
        setApprovalsList((prev) => prev.map((item) => (
          item.id === saved.id || item.qrn === saved.qrn ? saved : item
        )));
        const refreshedRfps = await getRFPs();
        if (Array.isArray(refreshedRfps)) setRfpList(refreshedRfps);
        showNotification({ severity: 'success', title: 'Approval committed', message: `Approval stage ${stage.toUpperCase()} committed to the Go API.` });
        addAuditLog(`Committed ${stage.toUpperCase()} approval for ${id} through the Go API`);
        return true;
      } catch (error) {
        showNotification({ severity: 'error', title: 'Approval was not committed', message: error instanceof Error ? error.message : 'API error' });
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
    showNotification({ severity: 'info', title: 'Preview only', message: `Approval stage ${stage.toUpperCase()} was not persisted.` });
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
        showNotification({ severity: 'success', title: 'Queue item committed', message: `Queue item ${saved.docNumber || qboId} committed to the Go API.` });
        addAuditLog(`Committed QBO queue action for ${saved.docNumber || qboId} through the Go API`);
        return true;
      } catch (error) {
        showNotification({ severity: 'error', title: 'Queue sync was not committed', message: error instanceof Error ? error.message : 'API error' });
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
    showNotification({ severity: 'info', title: 'Preview only', message: `Queue item ${qboId} was not posted to QuickBooks.` });
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
      showNotification({ severity: 'success', title: 'Data reloaded', message: 'Reloaded authoritative data from the Go API.' });
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
    showNotification({ severity: 'success', title: 'Demo data restored', message: 'Demo data restored to default settings.' });
    addAuditLog('Restored system demo state to default seed data');
  };

  const handleOpenOperationsExport = () => {
    handleOpenExportModal(
      'Operations summary',
      'accustandard_operations_summary',
      [{
        role: viewAsRole,
        generatedAt: new Date().toISOString(),
        pendingApprovals: roleScopedData.pendingApprovals.length,
        criticalStockItems: roleScopedData.criticalStock.length,
        activeRFQs: roleScopedData.activeRfqs.length,
        purchaseOrders: poList.length,
        qboQueueItems: roleScopedData.queuedQboItems.length,
      }],
    );
  };

  return (
    <div className="workspace-shell flex min-h-[100dvh] w-full flex-col font-sans text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Application Header Bar */}
      <Header
        activeTab={activeTab}
        viewAsRole={viewAsRole}
        onSelectTab={handleSelectTab}
        onChangeRole={handleChangeRole}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenCreateNew={() => setIsCommandPaletteOpen(true)}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenPWAInstall={() => setIsPwaInstallModalOpen(true)}
        onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
        onOpenExport={handleOpenOperationsExport}
        onOpenStartupImport={() => setIsStartupImportOpen(true)}
        onOpenQBOQueue={() => setIsQboQueueOpen(true)}
        onOpenProductManager={() => setIsProductManagerOpen(true)}
        qboQueueCount={roleScopedData.queuedQboItems.length}
      />

      <NotificationCenter notifications={notifications} onDismiss={dismissNotification} />

      {/* Feature Module Workspace Container */}
      <main id="main-content" aria-label="Enterprise Operations Workspace" aria-busy={isHydrating} className="workspace-main flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-7 pb-32 sm:px-6 lg:px-8 lg:pb-10 xl:px-10">
          <AnimeReveal className="mb-6">
            <AttentionBox
              tone={isHydrating ? 'info' : apiOnline ? 'success' : 'warning'}
              role="status"
              aria-live="polite"
              className="workspace-status flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5"
            >
              <div className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 rounded-full ${isHydrating ? 'animate-pulse bg-amber-500' : apiOnline ? 'bg-emerald-500' : 'bg-[var(--brand-red)]'}`} aria-hidden="true" />
                <p className="text-sm font-medium text-slate-800">
                  {isHydrating
                    ? 'Connecting to the operations API…'
                    : apiOnline
                      ? 'Live operations data connected.'
                      : 'Offline demo mode. Changes stay local and are not persisted.'}
                </p>
              </div>
              <span className="text-xs font-medium text-slate-500">{apiOnline ? 'Server-backed workspace' : 'Local preview data'}</span>
            </AttentionBox>
          </AnimeReveal>
          {activeTab === 'overview' && (
            <ExecutiveOverview
              approvalsList={roleScopedData.pendingApprovals}
              reviewablePOItems={roleScopedData.reviewablePurchaseOrders}
              roleScopedData={roleScopedData}
              viewAsRole={viewAsRole}
              onApproveItem={handleApproveItem}
              onSelectTab={handleSelectTab}
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
              onOpenCreatePO={() => setIsCreatePOOpen(true)}
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
                showNotification({ severity: 'info', title: 'Preview only', message: `Sales Quote ${qrn} approval was not persisted.` });
                addAuditLog(`Demo-only preview of Sales Quote ${qrn} approval routing`);
              }}
              onShowNotification={showNotification}
              onAddAuditLog={addAuditLog}
              onOpenClientRoiModal={(rfq) => {
                if (!rfq) {
                  showNotification({ severity: 'info', title: 'ROI preview unavailable', message: 'Select an RFQ record first.' });
                  return;
                }
                setSelectedRfqData(rfq);
                setIsClientRoiOpen(true);
              }}
              onOpenRfqPreviewModal={(rfq) => {
                if (!rfq) {
                  showNotification({ severity: 'info', title: 'RFQ preview unavailable', message: 'Select an RFQ record first.' });
                  return;
                }
                setSelectedRfqData(rfq);
                setIsRfqPreviewOpen(true);
              }}
              onOpenClientAcceptanceModal={(quote) => {
                if (!quote) {
                  showNotification({ severity: 'info', title: 'Client acceptance unavailable', message: 'Select a quotation record first.' });
                  return;
                }
                setSelectedPoData(null);
                setSelectedRfqData(quote);
                setIsClientAcceptanceOpen(true);
              }}
            />
          )}

          {activeTab === 'soa' && (
            <StatementOfAccount
              soaRows={soaData.rows}
              dataState={dataState}
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
                 if (!po) {
                    showNotification({ severity: 'info', title: 'Vendor invoice unavailable', message: 'Select a purchase order first.' });
                   return;
                 }
                setSelectedPoData(po);
                setIsVendorInvoiceOpen(true);
              }}
               onOpenThreeWayMatchModal={(po) => {
                 if (!po) {
                    showNotification({ severity: 'info', title: '3-Way Match unavailable', message: 'Select a purchase order first.' });
                   return;
                 }
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
              dataState={dataState}
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
          showNotification({ severity: 'info', title: 'Barcode scanned', message: `SKU ${sku} is ready in Inventory.` });
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
          showNotification({ severity: 'info', title: 'Preview only', message: `Product SKU ${newProd.sku} was not persisted.` });
          addAuditLog(`Demo-only preview of product SKU registration: ${newProd.sku}`);
        }}
        onUpdateProduct={(updatedProd) => {
          setInventoryList((prev) => prev.map((p) => (p.id === updatedProd.id ? (updatedProd as any) : p)));
          showNotification({ severity: 'info', title: 'Preview only', message: `Product SKU ${updatedProd.sku} changes were not persisted.` });
          addAuditLog(`Demo-only preview of product SKU revision: ${updatedProd.sku}`);
        }}
        onDeleteProduct={(prodId) => {
          setInventoryList((prev) => prev.filter((p) => p.id !== prodId));
          showNotification({ severity: 'info', title: 'Preview only', message: 'Product SKU removal was not persisted.' });
          addAuditLog('Demo-only preview of product SKU removal');
        }}
      />

      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpen={() => setIsCommandPaletteOpen(true)}
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
        onOpenExport={handleOpenOperationsExport}
        onOpenStartupImport={() => setIsStartupImportOpen(true)}
        onOpenQBOQueue={() => setIsQboQueueOpen(true)}
        onOpenProductManager={() => setIsProductManagerOpen(true)}
        onOpenCreateNew={() => setIsCommandPaletteOpen(true)}
        roleScopedData={roleScopedData}
      />

      <BottomNav
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
        viewAsRole={viewAsRole}
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
          showNotification({ severity: 'success', title: 'ROI preview saved', message: `Client-Format ROI Calculator linked. Payback period: ${roi.roiYears.toFixed(2)} years.` });
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
        quotationData={selectedRfqData}
        onConfirmAcceptance={(evidence) => {
          setQuotationsList((prev) =>
            prev.map((q) => (q.qrn === evidence.quotationId || q.id === evidence.quotationId ? { ...q, status: 'CLIENT_APPROVED' } : q))
          );
          showNotification({ severity: 'info', title: 'Preview only', message: 'Client acceptance evidence was not persisted or used to unlock fulfillment.' });
          addAuditLog(`Demo-only preview of client acceptance evidence (${evidence.clientPONumber})`);
        }}
      />

      <VendorInvoiceModal
        isOpen={isVendorInvoiceOpen}
        onClose={() => setIsVendorInvoiceOpen(false)}
        poData={selectedPoData}
        onSaveInvoice={(inv) => {
          showNotification({ severity: 'info', title: 'Preview only', message: `Vendor invoice ${inv.invoiceNo} was not persisted.` });
          addAuditLog(`Demo-only preview of Vendor Invoice ${inv.invoiceNo} for PO ${inv.poNo}`);
        }}
      />

      <ThreeWayMatchModal
        isOpen={isThreeWayMatchOpen}
        onClose={() => setIsThreeWayMatchOpen(false)}
        poData={selectedPoData}
        onConfirmVerification={(match) => {
          showNotification({ severity: 'info', title: 'Preview only', message: '3-Way Match evidence was not persisted or used to unlock payment.' });
          addAuditLog(`Demo-only preview of 3-Way Match verification for PO ${match.poNo}`);
        }}
      />

      <CollectionAllocationModal
        isOpen={isCollectionAllocationOpen}
        onClose={() => setIsCollectionAllocationOpen(false)}
        collectionData={collectionsList[0]}
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
      />
    </div>
  );
}
