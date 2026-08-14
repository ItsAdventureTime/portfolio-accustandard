'use client';

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  X,
  Layers,
  Package,
  FileText,
  FileCheck,
  Building2,
  CreditCard,
  UserCheck,
  Search,
  Camera,
  Smartphone,
  Download,
  Upload,
  Database,
  QrCode,
  ChevronDown,
  Eye,
  Plus,
} from 'lucide-react';

import { AccustandardLogo } from '@/components/brand/AccustandardLogo';
import {
  canUseOperation,
  getAllowedTabs,
  normalizeRole,
  ROLE_OPTIONS,
  type Role,
  type RoleScopedDashboardData,
} from '@/lib/permissions';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onSelectTab: (tabKey: string) => void;
  viewAsRole: Role;
  onChangeRole: (role: Role) => void;
  onOpenScanner: () => void;
  onOpenCommandPalette: () => void;
  onOpenPWAInstall: () => void;
  onOpenExport: () => void;
  onOpenStartupImport: () => void;
  onOpenQBOQueue: () => void;
  onOpenProductManager: () => void;
  onOpenCreateNew: () => void;
  roleScopedData: RoleScopedDashboardData;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  viewAsRole,
  onChangeRole,
  onOpenScanner,
  onOpenCommandPalette,
  onOpenPWAInstall,
  onOpenExport,
  onOpenStartupImport,
  onOpenQBOQueue,
  onOpenProductManager,
  onOpenCreateNew,
  roleScopedData,
}) => {
  const allowed = getAllowedTabs(viewAsRole);
  const canOpenAdmin = canUseOperation(viewAsRole, 'admin');
  const {
    pendingApprovals,
    pendingPOApprovals,
    pendingRfpApprovals,
    activeRfqs,
    waitingQuotes,
    incomingPOs,
    criticalStock,
    openReceivables,
    queuedQboItems,
  } = roleScopedData;

  const operationItems: Array<{ id: string; label: string; icon: React.ElementType; visible: boolean; onSelect: () => void; count?: number }> = [
    { id: 'create-new', label: 'Create new', icon: Plus, visible: canUseOperation(viewAsRole, 'create'), onSelect: onOpenCreateNew },
    { id: 'export', label: 'Export report', icon: Download, visible: canUseOperation(viewAsRole, 'export'), onSelect: onOpenExport },
    { id: 'startup-import', label: 'Startup import', icon: Upload, visible: canUseOperation(viewAsRole, 'import') && canOpenAdmin, onSelect: onOpenStartupImport },
    { id: 'qbo-queue', label: 'QBO sync queue', icon: Database, visible: canUseOperation(viewAsRole, 'qbo'), onSelect: onOpenQBOQueue, count: queuedQboItems.length },
    { id: 'barcode-manager', label: 'Barcode manager', icon: QrCode, visible: canUseOperation(viewAsRole, 'barcode'), onSelect: onOpenProductManager },
    { id: 'barcode-scanner', label: 'Barcode scanner', icon: Camera, visible: canUseOperation(viewAsRole, 'scanner'), onSelect: onOpenScanner },
    { id: 'install-app', label: 'Install app', icon: Smartphone, visible: canUseOperation(viewAsRole, 'pwa'), onSelect: onOpenPWAInstall },
  ].filter((item) => item.visible);

  const navItems = [
    { key: 'overview', label: 'Executive Overview', subtitle: 'COSO approvals pipeline', icon: Layers, badge: pendingApprovals.length },
    { key: 'inventory', label: 'Inventory Control', subtitle: 'Critical stock exceptions', icon: Package, badge: criticalStock.length },
    { key: 'quotations', label: 'Quotation Generator', subtitle: 'RFQs and customer approvals', icon: FileText, badge: activeRfqs.length + waitingQuotes.length },
    { key: 'soa', label: 'Statement of Account', subtitle: 'Open receivables', icon: FileCheck, badge: openReceivables.length },
    { key: 'purchasing', label: 'Purchasing & Receiving', subtitle: 'PO reviews and open receipts', icon: Building2, badge: pendingPOApprovals.length + incomingPOs.length },
    { key: 'rfp', label: 'Request for Payment', subtitle: 'Non-PO vouchers', icon: CreditCard, badge: pendingRfpApprovals.length },
    { key: 'admin', label: 'User Setup & Audit Logs', subtitle: 'COSO supervision', icon: UserCheck, badge: null },
  ].filter((item) => allowed.includes(item.key) && (item.key !== 'admin' || canOpenAdmin));

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fade-enter fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-sm" />
        <Dialog.Content className="sheet-enter mobile-modal-container fixed inset-x-0 bottom-0 z-50 mx-auto flex w-full max-w-xl flex-col overflow-hidden rounded-t-[2rem] border-t border-slate-300 bg-white text-slate-900 shadow-2xl focus:outline-none">
          <Dialog.Title className="sr-only">Mobile navigation menu</Dialog.Title>
          <Dialog.Description className="sr-only">Choose a workspace module or launch a mobile operation.</Dialog.Description>
        {/* Drag Handle Indicator */}
        <div className="flex justify-center border-b border-slate-100 bg-slate-50 pb-2 pt-3">
          <div className="h-1.5 w-12 rounded-full bg-slate-300" />
        </div>

        {/* Sheet Title Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
          <AccustandardLogo size="sm" />
          <Dialog.Close asChild>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation drawer"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </Dialog.Close>
        </div>

        {/* Role Impersonation Banner inside Drawer */}
        <div className="flex items-center justify-between gap-3 border-b border-blue-200 bg-blue-50 p-4 text-sm">
          <div className="flex items-center gap-2 font-medium text-blue-950">
            <Eye className="w-4 h-4 text-blue-700 shrink-0" />
            <span>Demo role simulation:</span>
          </div>
          <select
            aria-label="Demo role simulation"
            value={viewAsRole}
            onChange={(e) => onChangeRole(normalizeRole(e.target.value))}
            className="cursor-pointer rounded-lg border border-blue-300 bg-white px-2.5 py-1 text-sm font-medium text-blue-950 focus:outline-none"
          >
            {ROLE_OPTIONS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>

        {/* Search and filtered operations */}
        <div className="border-b border-slate-200 bg-slate-50 p-3 text-xs">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenCommandPalette();
            }}
            className="action-quiet w-full justify-center text-sm"
          >
            <Search className="h-4 w-4 text-blue-700" />
            <span>Search (⌘K)</span>
          </button>

          {operationItems.length > 0 && (
            <details className="action-disclosure mt-3 w-full">
              <summary className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-blue-700" />
                  Operations &amp; tools
                </span>
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </summary>
              <div className="grid gap-2 border-t border-slate-200 p-3 sm:grid-cols-2">
                {operationItems.map(({ id, label, icon: Icon, onSelect, count }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      onClose();
                      onSelect();
                    }}
                    className="action-quiet w-full justify-start text-left text-sm"
                  >
                    <Icon className="h-4 w-4 text-blue-700" />
                    <span>{label}</span>
                    {id === 'qbo-queue' && count ? <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-900">{count}</span> : null}
                  </button>
                ))}
              </div>
            </details>
          )}
        </div>

        {/* Scrollable Navigation Options */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                type="button"
                 onClick={() => { onSelectTab(item.key); onClose(); }}
                 aria-current={isActive ? 'page' : undefined}
                 className={`w-full text-left p-3.5 rounded-xl transition flex items-center justify-between ${
                   isActive
                     ? 'bg-blue-900 text-white font-semibold shadow-md'
                     : 'border border-slate-200 text-slate-800 hover:bg-slate-100'
                 }`}
              >
                <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-700'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="flex items-center gap-1.5 text-sm font-semibold leading-snug">
                      <span>{item.label}</span>
                    </span>
                     <span className={`text-xs block font-medium ${isActive ? 'text-blue-200' : 'text-slate-500'}`}>
                      {item.subtitle}
                    </span>
                  </div>
                </div>
                {item.badge !== null && (
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${isActive ? 'bg-white text-blue-950' : 'bg-blue-100 text-blue-900'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
