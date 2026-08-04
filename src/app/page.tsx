'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Layers,
  Package,
  FileText,
  FileCheck,
  Building2,
  CreditCard,
  UserCheck,
  Menu,
} from 'lucide-react';

import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

import { ExecutiveOverview } from '@/components/features/overview/ExecutiveOverview';
import { InventoryControl } from '@/components/features/inventory/InventoryControl';
import { QuotationGenerator } from '@/components/features/quotations/QuotationGenerator';
import { StatementOfAccount } from '@/components/features/soa/StatementOfAccount';
import { PurchasingReceiving } from '@/components/features/purchasing/PurchasingReceiving';
import { RequestForPayment } from '@/components/features/rfp/RequestForPayment';
import { SystemAuditTrail } from '@/components/features/admin/SystemAuditTrail';

import { BarcodeScannerModal } from '@/components/scanner/BarcodeScannerModal';
import { CommandPaletteModal } from '@/components/navigation/CommandPaletteModal';
import { MobileNavDrawer } from '@/components/navigation/MobileNavDrawer';
import { SystemAlertModal } from '@/components/modals/SystemAlertModal';
import { ExportModal } from '@/components/modals/ExportModal';
import { DocumentPrintModal } from '@/components/modals/DocumentPrintModal';
import { PWAInstallModal } from '@/components/modals/PWAInstallModal';
import { BarcodeProductManagerModal } from '@/components/modals/BarcodeProductManagerModal';
import { AddStockModal } from '@/components/modals/AddStockModal';
import { ReceivingReportModal } from '@/components/modals/ReceivingReportModal';
import { CreateRFPModal } from '@/components/modals/CreateRFPModal';
import { CreateQuotationModal } from '@/components/modals/CreateQuotationModal';
import { CreatePOModal } from '@/components/modals/CreatePOModal';

import {
  useDemoStore,
  DEFAULT_INVENTORY,
  DEFAULT_APPROVALS,
  DEFAULT_SOA_ROWS,
  DEFAULT_PO_LIST,
  DEFAULT_RFP_LIST,
  DEFAULT_AUDIT_LOGS,
} from '@/lib/useDemoStore';

export default function Home() {
  const { formatTimer, resetDemoData } = useDemoStore();

  // Primary Navigation State
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [viewAsRole, setViewAsRole] = useState<string>('Admin');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Core Data Lists
  const [inventoryList, setInventoryList] = useState(DEFAULT_INVENTORY);
  const [approvalsList, setApprovalsList] = useState(DEFAULT_APPROVALS);
  const [soaData, setSoaData] = useState({ rows: DEFAULT_SOA_ROWS });
  const [poList, setPoList] = useState(DEFAULT_PO_LIST);
  const [rfpList, setRfpList] = useState(DEFAULT_RFP_LIST);
  const [auditLogs, setAuditLogs] = useState(DEFAULT_AUDIT_LOGS);

  // Modals & Slideovers
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isPwaInstallModalOpen, setIsPwaInstallModalOpen] = useState(false);
  const [isProductManagerOpen, setIsProductManagerOpen] = useState(false);

  // CRUD Simulator Modals
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [isAddPOOpen, setIsAddPOOpen] = useState(false);
  const [isPOReceivingModalOpen, setIsPOReceivingModalOpen] = useState(false);
  const [isAddRFPOpen, setIsAddRFPOpen] = useState(false);
  const [isCreateQuotationOpen, setIsCreateQuotationOpen] = useState(false);
  const [isCreatePOOpen, setIsCreatePOOpen] = useState(false);

  // Export & Print Modal States
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportModalTitle, setExportModalTitle] = useState('Report');
  const [exportModalFilename, setExportModalFilename] = useState('accustandard_report');
  const [exportModalData, setExportModalData] = useState<object[]>([]);
  const [exportElementId, setExportElementId] = useState<string | undefined>(undefined);

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printModalTitle, setPrintModalTitle] = useState('Document');
  const [printModalElementId, setPrintModalElementId] = useState('printable-doc');
  const [printModalContent, setPrintModalContent] = useState<React.ReactNode>(null);

  // System Notification Toast Helper
  const showNotification = useCallback((message: string) => {
    setToastMessage(message);
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const addAuditLog = useCallback((actionDescription: string) => {
    const timeString = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    setAuditLogs((prev) => [
      {
        id: `audit-${Date.now()}`,
        time: timeString,
        user: `${viewAsRole} (Active Session)`,
        action: actionDescription,
      },
      ...prev,
    ]);
  }, [viewAsRole]);

  // Submit Quotation for COSO Approval
  const handleSubmitQuotation = (newQuote: any) => {
    setApprovalsList((prev) => [newQuote, ...prev]);
    showNotification(`Submitted Sales Quote ${newQuote.qrn} for Approval!`);
    addAuditLog(`Created and routed Sales Quotation ${newQuote.qrn} for approval`);
  };

  // Submit PO for Approval
  const handleSubmitPO = (newPO: any) => {
    setPoList((prev) => [newPO, ...prev]);
    setApprovalsList((prev) => [
      {
        id: `app-po-${Date.now()}`,
        qrn: newPO.poNumber,
        type: 'Purchase Order',
        maker: 'Purchasing / Bookkeeper',
        reviewerStatus: 'APPROVED',
        gmStatus: 'PENDING',
        dcsStatus: 'AWAITING',
        totalAmount: newPO.totalAmount,
      },
      ...prev,
    ]);
    showNotification(`Routed Purchase Order ${newPO.poNumber} for Approval!`);
    addAuditLog(`Created Purchase Order ${newPO.poNumber}`);
  };

  // Role-Based Access Control (RBAC) Module Permissions
  const ROLE_ALLOWED_TABS: Record<string, string[]> = {
    Admin: ['overview', 'inventory', 'quotations', 'soa', 'purchasing', 'rfp', 'admin'],
    'Chairman (DCS)': ['overview', 'inventory', 'quotations', 'soa', 'purchasing', 'rfp', 'admin'],
    'General Manager': ['overview', 'inventory', 'quotations', 'soa', 'purchasing', 'rfp', 'admin'],
    Bookkeeper: ['overview', 'soa', 'purchasing', 'rfp'],
    Warehouse: ['inventory', 'purchasing'],
    Marketing: ['overview', 'quotations'],
    Sales: ['quotations', 'inventory'],
  };

  const handleSelectTab = (tabKey: string) => {
    const allowed = ROLE_ALLOWED_TABS[viewAsRole] || ROLE_ALLOWED_TABS['Admin'];
    if (!allowed.includes(tabKey)) {
      showNotification(`Role Restricted: [${viewAsRole}] does not have permission to view section "${tabKey.toUpperCase()}".`);
      return;
    }
    setActiveTab(tabKey);
  };

  const handleChangeRole = (role: string) => {
    setViewAsRole(role);
    const allowed = ROLE_ALLOWED_TABS[role] || ROLE_ALLOWED_TABS['Admin'];
    if (!allowed.includes(activeTab)) {
      setActiveTab(allowed[0]);
      showNotification(`Switched role to: ${role} — Navigated to allowed module: ${allowed[0].toUpperCase()}`);
    } else {
      showNotification(`Switched role simulation to: ${role}`);
    }
    addAuditLog(`Switched user role simulation to: ${role}`);
  };

  // Approval Pipeline Action Handler
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
    setApprovalsList(DEFAULT_APPROVALS);
    setSoaData({ rows: DEFAULT_SOA_ROWS });
    setPoList(DEFAULT_PO_LIST);
    setRfpList(DEFAULT_RFP_LIST);
    setAuditLogs(DEFAULT_AUDIT_LOGS);
    showNotification('Demo data restored to default settings.');
    addAuditLog('Restored system demo state to default seed data');
  };

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

      {/* Main Workspace Layout (Full-Width Responsive Grid) */}
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
              viewAsRole={viewAsRole}
              onApproveItem={handleApproveItem}
              onSelectTab={setActiveTab}
              onOpenScanner={() => setIsScannerOpen(true)}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryControl
              inventoryList={inventoryList}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onOpenAddStock={() => setIsAddStockOpen(true)}
              onOpenProductManager={() => setIsProductManagerOpen(true)}
              onOpenScanner={() => setIsScannerOpen(true)}
            />
          )}

          {activeTab === 'quotations' && (
            <QuotationGenerator
              onOpenPrintModal={handleOpenPrintModal}
              onOpenExportModal={handleOpenExportModal}
              onOpenCreateModal={() => setIsCreateQuotationOpen(true)}
              onSubmitForApproval={(qrn) => {
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
            <SystemAuditTrail auditLogs={auditLogs} />
          )}
        </main>
      </div>

      {/* Mobile App Navigation Bar (Persistent Thumb Zone for <768px) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 text-white backdrop-blur-md border-t border-slate-800 shadow-2xl px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex justify-around items-center text-[10px] font-semibold no-print">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg transition ${
            activeTab === 'overview' ? 'text-blue-400 font-extrabold bg-blue-950/80' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-5 h-5 mb-0.5" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg transition ${
            activeTab === 'inventory' ? 'text-emerald-400 font-extrabold bg-emerald-950/80' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Package className="w-5 h-5 mb-0.5" />
          <span>Inventory</span>
        </button>

        <button
          onClick={() => setActiveTab('quotations')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg transition ${
            activeTab === 'quotations' || activeTab === 'soa' ? 'text-amber-400 font-extrabold bg-amber-950/80' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-5 h-5 mb-0.5" />
          <span>Sales</span>
        </button>

        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          className="flex flex-col items-center py-1 px-3 rounded-lg text-slate-400 hover:text-white"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span>Menu</span>
        </button>
      </div>

      {/* System Modals & Slideovers */}
      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onOpenProductManager={() => setIsProductManagerOpen(true)}
        onScan={(scannedCode) => {
          setIsScannerOpen(false);
          setActiveTab('inventory');
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
        onSelectTab={(tabKey) => {
          setActiveTab(tabKey);
          showNotification(`Navigated to section: ${tabKey}`);
        }}
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
