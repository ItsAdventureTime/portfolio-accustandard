'use client';

import React from 'react';
import {
  Layers,
  Package,
  FileText,
  FileCheck,
  Building2,
  CreditCard,
  UserCheck,
  RotateCcw,
  Clock,
  MapPin,
  ShieldCheck,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tabKey: string) => void;
  approvalsCount: number;
  inventoryCount: number;
  soaCount: number;
  auditCount: number;
  formattedTimer: string;
  onResetDemo: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  approvalsCount,
  inventoryCount,
  soaCount,
  auditCount,
  formattedTimer,
  onResetDemo,
}) => {
  const navItems = [
    {
      key: 'overview',
      label: 'Executive Overview',
      subtitle: 'Control & Approvals Pipeline',
      icon: Layers,
      badge: approvalsCount,
      badgeColor: 'bg-blue-600 text-white',
    },
    {
      key: 'inventory',
      label: 'Inventory Control',
      subtitle: 'QC & Pampanga Warehouses',
      icon: Package,
      badge: inventoryCount,
      badgeColor: 'bg-emerald-600 text-white',
    },
    {
      key: 'quotations',
      label: 'Quotation Generator',
      subtitle: 'Stock Reservation & Pricing',
      icon: FileText,
      badge: 1,
      badgeColor: 'bg-amber-600 text-white',
    },
    {
      key: 'soa',
      label: 'Statement of Account',
      subtitle: 'Client Aging & Ledger',
      icon: FileCheck,
      badge: soaCount,
      badgeColor: 'bg-indigo-600 text-white',
    },
    {
      key: 'purchasing',
      label: 'Purchasing & Receiving',
      subtitle: '3-Way Match Verification',
      icon: Building2,
      badge: null,
      badgeColor: '',
    },
    {
      key: 'rfp',
      label: 'Request for Payment',
      subtitle: 'Non-PO Expense Vouchers',
      icon: CreditCard,
      badge: null,
      badgeColor: '',
    },
    {
      key: 'admin',
      label: 'User Setup & Audit Log',
      subtitle: 'COSO Control Supervision',
      icon: UserCheck,
      badge: auditCount,
      badgeColor: 'bg-slate-700 text-slate-100',
    },
  ];

  return (
    <aside className="w-80 bg-slate-50 border-r border-slate-200 text-slate-800 flex flex-col justify-between hidden md:flex shrink-0 shadow-sm">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3">
          <img
            src="/photo_2026-08-01_23-55-07.jpg"
            alt="Accustandard Logo"
            className="h-12 w-auto object-contain bg-white p-1 rounded-xl border border-slate-200 shadow-sm"
          />
          <div>
            <span className="font-black text-base text-blue-950 uppercase tracking-tight block">
              Accustandard
            </span>
            <p className="text-xs font-bold text-slate-600 tracking-tight">
              Medical &amp; Diagnostic Supplies Corp.
            </p>
          </div>
        </div>

        {/* Multi-Warehouse Status Bar */}
        <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-700">
          <span className="flex items-center gap-1.5 font-bold">
            <MapPin className="w-4 h-4 text-emerald-600" />
            QC &amp; Pampanga
          </span>
          <span className="bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Online
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
        <div className="px-3 pb-2 text-xs font-black uppercase text-slate-500 tracking-wider">
          Enterprise Operations
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onSelectTab(item.key)}
              className={`w-full text-left p-3 rounded-xl transition flex items-center justify-between group ${
                isActive
                  ? 'bg-blue-900 text-white font-extrabold shadow-md'
                  : 'hover:bg-slate-200/80 text-slate-700 hover:text-slate-900 font-semibold'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg transition ${
                    isActive ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-700 group-hover:bg-slate-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-extrabold block leading-snug">{item.label}</span>
                  <span
                    className={`text-xs block leading-none font-medium ${
                      isActive ? 'text-blue-200' : 'text-slate-500'
                    }`}
                  >
                    {item.subtitle}
                  </span>
                </div>
              </div>

              {item.badge !== null && (
                <span
                  className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white text-blue-950' : item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info & Reset Action */}
      <div className="p-4 border-t border-slate-200 bg-white space-y-3">
        <div className="flex justify-between items-center text-xs text-slate-600 font-semibold">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-blue-700" />
            Auto-Reset: <span className="font-mono font-extrabold text-blue-950">{formattedTimer}</span>
          </span>
          <button
            onClick={onResetDemo}
            className="text-slate-600 hover:text-red-600 p-1 rounded transition flex items-center gap-1 font-bold text-xs"
            title="Reset demo data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-bold">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
            COSO Internal Control System
          </span>
          <span>v4.2</span>
        </div>
      </div>
    </aside>
  );
};
