'use client';

import React from 'react';
import { X, Layers, Package, FileText, FileCheck, Building2, CreditCard, UserCheck, Eye, Search, Camera, Server, ChevronRight, RefreshCcw } from 'lucide-react';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onSelectTab: (tabKey: any) => void;
  viewAsRole: string;
  onChangeRole: (role: string) => void;
  onOpenScanner: () => void;
  onOpenCommandPalette: () => void;
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
  approvalsCount,
  inventoryCount,
  soaCount,
  auditCount,
}) => {
  if (!isOpen) return null;

  const navItems = [
    { key: 'overview', title: 'Executive Overview', subtitle: 'Approvals & COSO Pipeline', icon: <Layers className="w-5 h-5 text-blue-600" />, badge: approvalsCount, color: 'bg-blue-100 text-blue-800' },
    { key: 'inventory', title: 'Inventory Control', subtitle: 'QC & Pampanga Warehouses', icon: <Package className="w-5 h-5 text-emerald-600" />, badge: inventoryCount, color: 'bg-emerald-100 text-emerald-800' },
    { key: 'quotations', title: 'Quotation Generator', subtitle: '3-Day Stock Reservation Engine', icon: <FileText className="w-5 h-5 text-amber-600" />, badge: 1, color: 'bg-amber-100 text-amber-800' },
    { key: 'soa', title: 'Statement of Account (SOA)', subtitle: 'Client Aging & DR Tracking', icon: <FileCheck className="w-5 h-5 text-purple-600" />, badge: soaCount, color: 'bg-purple-100 text-purple-800' },
    { key: 'purchasing', title: 'Purchasing & Receiving', subtitle: '3-Way Match & PO Control', icon: <Building2 className="w-5 h-5 text-blue-600" /> },
    { key: 'rfp', title: 'Request for Payment (RFP)', subtitle: 'Non-PO Expense Vouchers', icon: <CreditCard className="w-5 h-5 text-rose-600" /> },
    { key: 'admin', title: 'System Audit Stream', subtitle: 'Immutable System Controls', icon: <UserCheck className="w-5 h-5 text-slate-700" />, badge: auditCount, color: 'bg-slate-200 text-slate-800' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex flex-col justify-end transition-opacity duration-200">
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
          <div className="flex items-center gap-2">
            <div className="bg-blue-900 text-white px-2 py-0.5 rounded font-black text-xs tracking-tight">
              ACCUSTANDA
            </div>
            <div>
              <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider">Navigation Menu</h3>
              <p className="text-[10px] text-slate-500 font-semibold">Select Section or Change Role</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Sheet Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Role Impersonation Card */}
          <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200/80 shadow-xs space-y-2">
            <label className="text-xs font-bold uppercase text-amber-900 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-amber-600" />
                Simulate User Role:
              </span>
              <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-black">
                {viewAsRole}
              </span>
            </label>
            <select
              value={viewAsRole}
              onChange={(e) => onChangeRole(e.target.value)}
              className="w-full bg-white text-slate-900 font-bold rounded-lg px-3 py-2 border border-amber-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
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

          {/* Quick Action Tools Bar */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenCommandPalette();
              }}
              className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 p-2.5 rounded-xl text-xs font-bold transition shadow-xs"
            >
              <Search className="w-4 h-4 text-blue-600" />
              <span>Search & Jump</span>
              <kbd className="bg-white text-slate-600 text-[10px] px-1 py-0.5 rounded border border-slate-300">⌘K</kbd>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenScanner();
              }}
              className="btn-danger-red text-xs py-2.5 flex items-center justify-center gap-2 rounded-xl"
            >
              <Camera className="w-4 h-4" />
              <span>Barcode Scanner</span>
            </button>
          </div>

          {/* Module Navigation List */}
          <div className="space-y-1 pt-1">
            <span className="text-[10px] font-black uppercase text-slate-600 tracking-wider px-1 block mb-1">
              ERP System Modules
            </span>
            {navItems.map((item) => {
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    onSelectTab(item.key);
                    onClose();
                  }}
                  className={`w-full p-3 rounded-xl flex items-center justify-between transition text-left ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-md'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold border border-slate-200/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg shrink-0 ${isActive ? 'bg-white/20 text-white' : 'bg-white border border-slate-200'}`}>
                      {item.icon}
                    </div>
                    <div>
                      <span className={`text-xs block font-extrabold leading-tight ${isActive ? 'text-white' : 'text-slate-900'}`}>
                        {item.title}
                      </span>
                      <span className={`text-[10px] font-medium ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                        {item.subtitle}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge !== undefined && (
                      <span className={`px-2 py-0.5 text-[10px] rounded-full font-extrabold ${isActive ? 'bg-white text-blue-900' : item.color}`}>
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50 text-xs text-slate-600 flex justify-between items-center font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold">QBO API Live Sync</span>
          </div>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-black uppercase">
            ONLINE
          </span>
        </div>
      </div>
    </div>
  );
};

