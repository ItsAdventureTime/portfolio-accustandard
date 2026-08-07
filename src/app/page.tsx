'use client';

import React, { useState, useEffect } from 'react';
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

import {
  useDemoStore,
  DEFAULT_INVENTORY,
  DEFAULT_REPLENISHMENT_PLANNER,
  DEFAULT_RFQS,
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
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Core Data Arrays
  const [inventoryList, setInventoryList] = useState(DEFAULT_INVENTORY);
  const [replenishmentList, setReplenishmentList] = useState(DEFAULT_REPLENISHMENT_PLANNER);
  const [rfqList, setRfqList] = useState(DEFAULT_RFQS);
  const [approvalsList, setApprovalsList] = useState(DEFAULT_APPROVALS);
  const [soaData, setSoaData] = useState({ rows: DEFAULT_SOA_ROWS });
  const [collectionsList, setCollectionsList] = useState(DEFAULT_COLLECTIONS);
  const [poList, setPoList] = useState(DEFAULT_PO_LIST);
  const [rfpList, setRfpList] = useState(DEFAULT_RFP_LIST);
  const [qboQueue, setQboQueue] = useState(DEFAULT_QBO_QUEUE);
  const [auditLogs, setAuditLogs] = useState(DEFAULT_AUDIT_LOGS);

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

  // Toast Notification Helper
  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
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

  // Handle Quotation Submit
  const handleSubmitQuotation = (newQuote: any) => {
    setApprovalsList((prev) => [
      {
        id: `app-sq-${Date.now()}`,
        qrn: newQuote.qrn,
        type: 'Sales Quotation',
        maker: newQuote.signatoryName || 'Sales Agent',
        reviewerStatus: 'PENDING',
        gmStatus: 'PENDING',
        dcsStatus: 'PENDING',
        totalAmount: 18450.0,
      },
      ...prev,
    ]);
    showNotification(`Created and routed Sales Quotation ${newQuote.qrn} for approval!`);
    addAuditLog(`Created Sales Quotation ${newQuote.qrn}`);
  };

  // Handle Purchase Order Submit
  const handleSubmitPO = (newPO: any) => {
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
      },
      ...prev,
    ]);
    showNotification(`Created and routed Purchase Order ${newPO.poNumber} for approval!`);
    addAuditLog(`Created Purchase Order ${newPO.poNumber}`);
  };

  // Handle Approval Action
  const handleApproveItem = (id: string, stage: string) => {
    if (stage === 'reviewer' && !['Admin', 'Marketing', 'General Manager', 'Chairman (DCS)'].includes(viewAsRole)) {
      showNotification(`Permission Denied: Role [${viewAsRole}] cannot execute Reviewer Approval.`);
      return;
    }
    if (stage === 'gm' && !['Admin', 'General Manager', 'Chairman (DCS)'].includes(viewAsRole)) {
      showNotification(`Permission Denied: Role [${viewAsRole}] cannot execute GM Approval.`);
      return;
    }
    if (stage === 'dcs' && !['Admin', 'Chairman (DCS)'].includes(viewAsRole)) {
      showNotification(`Permission Denied: Role [${viewAsRole}] cannot execute DCS Chairman Approval.`);
      return;
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
    showNotification(`Approved transaction stage: ${stage.toUpperCase()}`);
    addAuditLog(`Approved transaction stage [${stage.toUpperCase()}] for item #${id}`);
  };

  const handleTriggerQboSync = (qboId: string) => {
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
    showNotification(`Successfully posted item ${qboId} to QuickBooks Online ledger!`);
    addAuditLog(`Synced operational item ${qboId} to QuickBooks Online`);
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

  // Reset Demo Data
  const handleResetData = () => {
    resetDemoData();
    setInventoryList(DEFAULT_INVENTORY);
    setReplenishmentList(DEFAULT_REPLENISHMENT_PLANNER);
    setRfqList(DEFAULT_RFQS);
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

      {/* Center Screen Notification Toast */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in zoom-in duration-200">
          <div className="bg-slate-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 backdrop-blur-md flex items-center gap-3 text-xs font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden w-full">
        {/* Desktop Navigation Sidebar */}
        <Sidebar
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
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-24 md:pb-8 w-full">
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
                    dcsStatus: 'PENDING',
                    totalAmount: 18450.0,
                  },
                  ...prev,
                ]);
                showNotification(`Submitted Sales Quote ${qrn} for COSO Approval!`);
                addAuditLog(`Routed Sales Quote ${qrn} for approval`);
              }}
              onShowNotification={showNotification}
              onAddAuditLog={addAuditLog}
            />
          )}

          {activeTab === 'soa' && (
            <StatementOfAccount
              soaRows={soaData.rows}
              collectionsList={collectionsList}
              onOpenPrintModal={handleOpenPrintModal}
              onOpenExportModal={handleOpenExportModal}
              onShowNotification={showNotification}
              onAddAuditLog={addAuditLog}
            />
          )}

          {activeTab === 'purchasing' && (
            <PurchasingReceiving
              poList={poList}
              onOpenAddPO={() => setIsCreatePOOpen(true)}
              onOpenReceivingModal={() => setIsPOReceivingModalOpen(true)}
            />
          )}

          {activeTab === 'rfp' && (
            <RequestForPayment
              rfpList={rfpList}
              onOpenAddRFP={() => setIsAddRFPOpen(true)}
            />
          )}

          {activeTab === 'admin' && (
            <SystemAuditTrail
              auditLogs={auditLogs}
              onShowNotification={showNotification}
              onAddAuditLog={addAuditLog}
            />
          )}
        </main>
      </div>

      {/* Role-Dynamic Mobile Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 text-slate-800 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex justify-around items-center text-[10px] font-bold no-print">
        {allowedTabs.includes('overview') && (
          <button
            onClick={() => handleSelectTab('overview')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition ${
              activeTab === 'overview'
                ? 'text-blue-900 font-black bg-blue-50 border border-blue-200/80 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-5 h-5 mb-0.5 text-blue-800" />
            <span>Overview</span>
          </button>
        )}

        {allowedTabs.includes('inventory') && (
          <button
            onClick={() => handleSelectTab('inventory')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition ${
              activeTab === 'inventory'
                ? 'text-emerald-900 font-black bg-emerald-50 border border-emerald-200/80 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Package className="w-5 h-5 mb-0.5 text-emerald-700" />
            <span>Inventory</span>
          </button>
        )}

        {allowedTabs.includes('quotations') && (
          <button
            onClick={() => handleSelectTab('quotations')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition ${
              activeTab === 'quotations'
                ? 'text-amber-900 font-black bg-amber-50 border border-amber-200/80 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-5 h-5 mb-0.5 text-amber-700" />
            <span>Quotes</span>
          </button>
        )}

        {allowedTabs.includes('soa') && (
          <button
            onClick={() => handleSelectTab('soa')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition ${
              activeTab === 'soa'
                ? 'text-blue-900 font-black bg-blue-50 border border-blue-200/80 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileCheck className="w-5 h-5 mb-0.5 text-blue-800" />
            <span>SOA</span>
          </button>
        )}

        {allowedTabs.includes('purchasing') && (
          <button
            onClick={() => handleSelectTab('purchasing')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition ${
              activeTab === 'purchasing'
                ? 'text-purple-900 font-black bg-purple-50 border border-purple-200/80 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShoppingCart className="w-5 h-5 mb-0.5 text-purple-800" />
            <span>Purchasing</span>
          </button>
        )}

        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          className="flex flex-col items-center py-1 px-3 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
        >
          <Menu className="w-5 h-5 mb-0.5 text-slate-700" />
          <span>Menu</span>
        </button>
      </div>

      {/* System Modals & Slideovers */}
      <QBOSyncQueueModal
        isOpen={isQboQueueOpen}
        onClose={() => setIsQboQueueOpen(false)}
        qboQueue={qboQueue}
        onTriggerSync={handleTriggerQboSync}
      />

      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onOpenProductManager={() => setIsProductManagerOpen(true)}
        onScan={(scannedCode) => {
          setIsScannerOpen(false);
          handleSelectTab('inventory');
          setSearchQuery(scannedCode);
          showNotification(`Scanned Barcode: ${scannedCode} — Filtered in Inventory.`);
          addAuditLog(`Scanned Barcode SKU: ${scannedCode}`);
        }}
      />

      <BarcodeProductManagerModal
        isOpen={isProductManagerOpen}
        onClose={() => setIsProductManagerOpen(false)}
        products={inventoryList as any}
        onAddProduct={(newProd) => {
          setInventoryList((prev) => [newProd as any, ...prev]);
          showNotification(`Added product SKU: ${newProd.sku}`);
          addAuditLog(`Registered product SKU: ${newProd.sku}`);
        }}
        onUpdateProduct={(updatedProd) => {
          setInventoryList((prev) => prev.map((p) => (p.id === updatedProd.id ? (updatedProd as any) : p)));
          showNotification(`Updated product SKU: ${updatedProd.sku}`);
          addAuditLog(`Revised product SKU: ${updatedProd.sku}`);
        }}
        onDeleteProduct={(prodId) => {
          setInventoryList((prev) => prev.filter((p) => p.id !== prodId));
          showNotification('Deleted product SKU from registry.');
          addAuditLog('Removed product SKU from registry');
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
        onExportSuccess={(format) => {
          showNotification(`Exported ${exportModalTitle} as ${format}!`);
          addAuditLog(`Exported ${exportModalTitle} as ${format}`);
        }}
      />

      <AddStockModal
        isOpen={isAddStockOpen}
        onClose={() => setIsAddStockOpen(false)}
        onAddStockBatch={(newStock) => {
          setInventoryList((prev) => [newStock, ...prev]);
          showNotification(`Added stock batch for SKU: ${newStock.sku}`);
          addAuditLog(`Logged stock batch for SKU: ${newStock.sku}`);
        }}
      />

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
      />

      <ReceivingReportModal
        isOpen={isPOReceivingModalOpen}
        onClose={() => setIsPOReceivingModalOpen(false)}
        poList={poList}
        onReceivePO={(poId, receivedQty) => {
          setPoList((prev) =>
            prev.map((po) => {
              if (po.id === poId) {
                const updatedQty = po.rrQtyReceived + receivedQty;
                return {
                  ...po,
                  rrQtyReceived: updatedQty,
                  status: updatedQty >= po.poQty ? 'VERIFIED_3WAY' : 'PENDING_RECEIVING',
                };
              }
              return po;
            })
          );
          showNotification(`Confirmed Goods Receipt (RR) for PO!`);
          addAuditLog(`Entered Goods Receipt (RR) count for PO`);
        }}
      />

      <CreateRFPModal
        isOpen={isAddRFPOpen}
        onClose={() => setIsAddRFPOpen(false)}
        onSubmitRFP={(newRFP) => {
          setRfpList((prev) => [newRFP, ...prev]);
          setApprovalsList((prev) => [
            {
              id: `app-rfp-${Date.now()}`,
              qrn: newRFP.rfpNo,
              type: 'Request for Payment',
              maker: newRFP.requestedBy,
              reviewerStatus: 'APPROVED',
              gmStatus: 'APPROVED',
              dcsStatus: 'PENDING',
              totalAmount: newRFP.amount,
            },
            ...prev,
          ]);
          showNotification(`Routed RFP Voucher ${newRFP.rfpNo} for Approval!`);
          addAuditLog(`Created RFP Voucher ${newRFP.rfpNo}`);
        }}
      />

      <DocumentPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        title={printModalTitle}
        elementId={printModalElementId}
      >
        {printModalContent}
      </DocumentPrintModal>
    </div>
  );
}
