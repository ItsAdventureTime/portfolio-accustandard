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
  Lock,
} from 'lucide-react';

import { AccustandardLogo } from '@/components/brand/AccustandardLogo';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tabKey: string) => void;
  approvalsCount: number;
  inventoryCount: number;
  soaCount: number;
  auditCount: number;
  formattedTimer: string;
  onResetDemo: () => void;
  viewAsRole?: string;
}

const ROLE_ALLOWED_TABS: Record<string, string[]> = {
  Admin: ['overview', 'inventory', 'quotations', 'soa', 'purchasing', 'rfp', 'admin'],
  'Chairman (DCS)': ['overview', 'inventory', 'quotations', 'soa', 'purchasing', 'rfp', 'admin'],
  'General Manager': ['overview', 'inventory', 'quotations', 'soa', 'purchasing', 'rfp', 'admin'],
  Bookkeeper: ['overview', 'soa', 'purchasing', 'rfp'],
  Warehouse: ['inventory', 'purchasing'],
  Marketing: ['overview', 'quotations'],
  Sales: ['quotations', 'inventory'],
};

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  approvalsCount,
  inventoryCount,
  soaCount,
  auditCount,
  formattedTimer,
  onResetDemo,
  viewAsRole = 'Admin',
}) => {
  const allowed = ROLE_ALLOWED_TABS[viewAsRole] || ROLE_ALLOWED_TABS['Admin'];

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
    <aside className="w-80 bg-slate-50/90 backdrop-blur-md border-r border-slate-200/80 text-slate-800 flex flex-col justify-between hidden md:flex shrink-0 shadow-xs transition-all duration-200">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-200 bg-white/90">
        <AccustandardLogo size="md" />

        {/* Multi-Warehouse Status Bar */}
        <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-700 font-semibold">
          <span className="flex items-center gap-1.5 font-bold">
            <MapPin className="w-4 h-4 text-emerald-600" />
            QC &amp; Pampanga
          </span>
          <span className="bg-emerald-100/90 border border-emerald-300 text-emerald-950 text-xs font-black px-3 py-1 rounded-full flex items-center gap-2 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Online
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <div className="px-3 pb-2 text-xs font-black uppercase text-slate-500 tracking-wider flex justify-between items-center">
          <span>Enterprise Operations</span>
          <span className="text-[10px] text-blue-950 font-black bg-blue-100 border border-blue-200 px-2.5 py-0.5 rounded-full">{viewAsRole}</span>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;
          const isPermitted = allowed.includes(item.key);

          return (
            <button
              key={item.key}
              onClick={() => onSelectTab(item.key)}
              title={isPermitted ? undefined : `Role [${viewAsRole}] cannot access this module`}
              className={`w-full text-left p-3.5 rounded-2xl transition-all duration-200 ease-out flex items-center justify-between group cursor-pointer ${
                isActive
                  ? 'bg-blue-900 text-white font-black shadow-md border-l-4 border-blue-400 translate-x-1'
                  : isPermitted
                  ? 'hover:bg-slate-200/90 hover:translate-x-1 text-slate-800 hover:text-slate-950 font-bold'
                  : 'opacity-50 text-slate-400 hover:bg-slate-100 font-medium cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-xl transition-all duration-200 ${
                    isActive ? 'bg-blue-800 text-white shadow-xs' : isPermitted ? 'bg-slate-200/80 text-slate-700 group-hover:bg-blue-100 group-hover:text-blue-900' : 'bg-slate-200/50 text-slate-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-black flex items-center gap-1.5 leading-snug">
                    <span>{item.label}</span>
                    {!isPermitted && <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                  </span>
                  <span
                    className={`text-xs block leading-tight font-medium ${
                      isActive ? 'text-blue-200' : isPermitted ? 'text-slate-500 group-hover:text-slate-700' : 'text-slate-400'
                    }`}
                  >
                    {item.subtitle}
                  </span>
                </div>
              </div>

              {item.badge !== null && isPermitted && (
                <span
                  className={`text-xs font-black px-2.5 py-0.5 rounded-full transition-transform duration-200 group-hover:scale-105 ${
                    isActive ? 'bg-white text-blue-950 shadow-xs' : item.badgeColor
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
      <div className="p-4 border-t border-slate-200 bg-white/90 space-y-3">
        <div className="flex justify-between items-center text-xs text-slate-600 font-semibold">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-blue-700" />
            Auto-Reset: <span className="font-mono font-black text-blue-950 text-sm">{formattedTimer}</span>
          </span>
          <button
            onClick={onResetDemo}
            className="text-slate-600 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-xl transition-all duration-200 flex items-center gap-1 font-extrabold text-xs active:scale-95 cursor-pointer"
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
          <span className="font-mono text-slate-700">v4.2</span>
        </div>
      </div>
    </aside>
  );
};
