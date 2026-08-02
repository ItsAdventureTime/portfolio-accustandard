'use client';

import React from 'react';
import { X, Layers, Package, FileText, FileCheck, Building2, CreditCard, UserCheck, Eye, Search, Camera, Server, ChevronRight } from 'lucide-react';

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
    { key: 'quotations', title: 'Quotation Generator', subtitle: '3-Day Reservation Engine', icon: <FileText className="w-5 h-5 text-amber-600" />, badge: 1, color: 'bg-amber-100 text-amber-800' },
    { key: 'soa', title: 'Statement of Account (SOA)', subtitle: 'Client Aging & DR Tracking', icon: <FileCheck className="w-5 h-5 text-purple-600" />, badge: soaCount, color: 'bg-purple-100 text-purple-800' },
    { key: 'purchasing', title: 'Purchasing & Receiving', subtitle: '3-Way Match & PO Control', icon: <Building2 className="w-5 h-5 text-blue-600" /> },
    { key: 'rfp', title: 'Request for Payment (RFP)', subtitle: 'Non-PO Expense Approvals', icon: <CreditCard className="w-5 h-5 text-rose-600" /> },
    { key: 'admin', title: 'System Audit Stream', subtitle: 'Immutable System Controls', icon: <UserCheck className="w-5 h-5 text-slate-700" />, badge: auditCount, color: 'bg-slate-200 text-slate-800' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end">
      <div className="bg-white w-full max-w-xs h-full shadow-2xl flex flex-col justify-between text-slate-900 overflow-y-auto animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div>
            <span className="text-xs font-black uppercase text-blue-900 tracking-wider">Navigation Menu</span>
            <p className="text-[11px] text-slate-500">Accustanda Enterprise ERP</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Quick Search & Scanner Bar */}
        <div className="p-4 bg-slate-100 border-b border-slate-200 space-y-2">
          <button
            onClick={() => {
              onClose();
              onOpenCommandPalette();
            }}
            className="w-full flex items-center justify-between bg-white border border-slate-300 text-slate-700 px-3 py-2.5 rounded-lg text-xs font-semibold shadow-xs"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-600" />
              <span>Quick Search & Jump</span>
            </div>
            <kbd className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded border border-slate-300">⌘K</kbd>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenScanner();
            }}
            className="w-full btn-danger-red text-xs py-2.5 flex items-center justify-center gap-2"
          >
            <Camera className="w-4 h-4" />
            <span>Mobile Barcode Scanner</span>
          </button>
        </div>

        {/* Role Impersonation Selector */}
        <div className="p-4 border-b border-slate-200 bg-amber-50/50">
          <label className="text-[11px] font-bold uppercase text-amber-800 flex items-center gap-1.5 mb-1.5">
            <Eye className="w-3.5 h-3.5 text-amber-600" />
            <span>Simulate User Role:</span>
          </label>
          <select
            value={viewAsRole}
            onChange={(e) => onChangeRole(e.target.value)}
            className="w-full bg-white text-slate-900 font-semibold rounded-lg px-3 py-2 border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        {/* Navigation List */}
        <div className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                onSelectTab(item.key);
                onClose();
              }}
              className={`w-full p-3 rounded-lg flex items-center justify-between transition text-left ${
                activeTab === item.key
                  ? 'bg-blue-50 text-blue-900 font-bold border-l-4 border-blue-600 shadow-xs'
                  : 'hover:bg-slate-100 text-slate-700 font-medium'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-md border border-slate-200 shrink-0">
                  {item.icon}
                </div>
                <div>
                  <span className="text-xs block font-bold leading-tight">{item.title}</span>
                  <span className="text-[10px] text-slate-500 font-medium">{item.subtitle}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {item.badge !== undefined && (
                  <span className={`px-2 py-0.5 text-[10px] rounded-full font-extrabold ${item.color}`}>
                    {item.badge}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 flex justify-between items-center">
          <span>QBO API Live Sync</span>
          <span className="text-emerald-700 font-bold">● ONLINE</span>
        </div>
      </div>
    </div>
  );
};
