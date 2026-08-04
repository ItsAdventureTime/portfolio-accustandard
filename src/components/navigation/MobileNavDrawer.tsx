'use client';

import React from 'react';
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
  Eye,
} from 'lucide-react';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onSelectTab: (tabKey: string) => void;
  viewAsRole: string;
  onChangeRole: (role: string) => void;
  onOpenScanner: () => void;
  onOpenCommandPalette: () => void;
  onOpenPWAInstall: () => void;
  approvalsCount: number;
  inventoryCount: number;
  soaCount: number;
  auditCount: number;
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
  approvalsCount,
  inventoryCount,
  soaCount,
  auditCount,
}) => {
  if (!isOpen) return null;

  const navItems = [
    { key: 'overview', label: 'Executive Overview', subtitle: 'COSO Approvals Pipeline', icon: Layers, badge: approvalsCount },
    { key: 'inventory', label: 'Inventory Control', subtitle: 'QC & Pampanga SKUs', icon: Package, badge: inventoryCount },
    { key: 'quotations', label: 'Quotation Generator', subtitle: 'Stock Reservation & Pricing', icon: FileText, badge: 1 },
    { key: 'soa', label: 'Statement of Account', subtitle: 'Client Ledger & AR Aging', icon: FileCheck, badge: soaCount },
    { key: 'purchasing', label: 'Purchasing & Receiving', subtitle: '3-Way Fraud Match', icon: Building2, badge: null },
    { key: 'rfp', label: 'Request for Payment', subtitle: 'Non-PO Vouchers', icon: CreditCard, badge: null },
    { key: 'admin', label: 'User Setup & Audit Logs', subtitle: 'COSO Supervision', icon: UserCheck, badge: auditCount },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex flex-col justify-end transition-opacity duration-200">
      {/* Clickable Backdrop overlay to dismiss sheet */}
      <div className="flex-1 w-full" onClick={onClose} />

      {/* App-Native Bottom Sheet Drawer */}
      <div className="bg-white w-full max-w-lg mx-auto rounded-t-2xl shadow-2xl flex flex-col max-h-[85vh] text-slate-900 border-t border-slate-300 animate-in slide-in-from-bottom duration-300 ease-out overflow-hidden">
        {/* Drag Handle Indicator */}
        <div className="pt-3 pb-1 flex justify-center bg-slate-50 border-b border-slate-100">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
        </div>

        {/* Sheet Title Bar */}
        <div className="px-5 py-3 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2.5">
            <img
              src="/photo_2026-08-01_23-55-07.jpg"
              alt="Accustandard Logo"
              className="h-8 w-auto object-contain bg-white px-1 py-0.5 rounded border border-slate-200"
            />
            <div>
              <h3 className="text-sm font-black uppercase text-slate-900 tracking-wider">Accustandard Navigation</h3>
              <p className="text-xs text-slate-500 font-semibold">Select Section or Change Role</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Impersonation Banner inside Drawer */}
        <div className="p-4 bg-blue-50 border-b border-blue-200 flex items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2 text-blue-950 font-bold">
            <Eye className="w-4 h-4 text-blue-700 shrink-0" />
            <span>Active View Role:</span>
          </div>
          <select
            value={viewAsRole}
            onChange={(e) => onChangeRole(e.target.value)}
            className="bg-white border border-blue-300 text-blue-950 font-extrabold text-sm rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
          >
            <option value="Admin">Admin (Bridge)</option>
            <option value="Chairman (DCS)">Chairman (DCS)</option>
            <option value="General Manager">General Manager</option>
            <option value="Bookkeeper">Bookkeeper</option>
            <option value="Warehouse">Warehouse (Marie)</option>
            <option value="Marketing">Marketing (Reviewer)</option>
            <option value="Sales">Sales Officer</option>
          </select>
        </div>

        {/* Action Buttons Bar */}
        <div className="p-3 bg-slate-100 border-b border-slate-200 grid grid-cols-3 gap-2 text-xs">
          <button
            onClick={() => {
              onClose();
              onOpenScanner();
            }}
            className="p-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl flex flex-col items-center justify-center gap-1 shadow-sm"
          >
            <Camera className="w-4 h-4" />
            <span>Scan Barcode</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenCommandPalette();
            }}
            className="p-2.5 bg-slate-800 hover:bg-slate-900 text-white font-extrabold rounded-xl flex flex-col items-center justify-center gap-1 shadow-sm"
          >
            <Search className="w-4 h-4 text-blue-400" />
            <span>Search (⌘K)</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenPWAInstall();
            }}
            className="p-2.5 bg-blue-900 hover:bg-blue-800 text-white font-extrabold rounded-xl flex flex-col items-center justify-center gap-1 shadow-sm"
          >
            <Smartphone className="w-4 h-4 text-amber-400" />
            <span>PWA Mode Guide</span>
          </button>
        </div>

        {/* Scrollable Navigation Options */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onSelectTab(item.key)}
                className={`w-full text-left p-3.5 rounded-xl transition flex items-center justify-between ${
                  isActive
                    ? 'bg-blue-900 text-white font-extrabold shadow-md'
                    : 'hover:bg-slate-100 text-slate-800 font-bold border border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-700'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-extrabold block">{item.label}</span>
                    <span className={`text-xs block font-medium ${isActive ? 'text-blue-200' : 'text-slate-500'}`}>
                      {item.subtitle}
                    </span>
                  </div>
                </div>
                {item.badge !== null && (
                  <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${isActive ? 'bg-white text-blue-950' : 'bg-blue-100 text-blue-900'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
