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
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
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
      subtitle: 'QC & Pampanga Multi-Warehouse',
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
      label: 'Statement of Account (SOA)',
      subtitle: 'Client Aging & Receivables',
      icon: FileCheck,
      badge: soaCount,
      badgeColor: 'bg-purple-600 text-white',
    },
    {
      key: 'purchasing',
      label: 'Purchasing & Receiving',
      subtitle: '3-Way Match Verification',
      icon: Building2,
    },
    {
      key: 'rfp',
      label: 'Request for Payment (RFP)',
      subtitle: 'Non-PO Expense Vouchers',
      icon: CreditCard,
    },
    {
      key: 'admin',
      label: 'System Audit Trail',
      subtitle: 'Immutable Activity Logs',
      icon: UserCheck,
      badge: auditCount,
      badgeColor: 'bg-slate-700 text-slate-200',
    },
  ];

  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 text-slate-100 flex flex-col justify-between hidden md:flex shrink-0 shadow-xl">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 via-blue-900 to-slate-900 border border-blue-500/40 flex items-center justify-center text-white font-black shadow-md shrink-0">
            <span className="text-lg tracking-tighter">RxD</span>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-black text-sm text-white tracking-wider uppercase">ACCUSTANDARD</span>
              <span className="font-black text-xs text-red-500 font-serif">RxD</span>
            </div>
            <p className="text-[10px] font-semibold text-slate-400 tracking-tight">
              Medical & Diagnostic Supplies Corp.
            </p>
          </div>
        </div>

        {/* Multi-Warehouse Status Bar */}
        <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            QC &amp; Pampanga
          </span>
          <span className="bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Online
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        <span className="px-3 pt-2 pb-1 text-[10px] font-black uppercase text-slate-400 tracking-widest block">
          Enterprise Modules
        </span>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;

          return (
            <button
              key={item.key}
              onClick={() => onSelectTab(item.key)}
              className={`w-full text-left p-2.5 rounded-xl transition-all duration-150 flex items-center justify-between group ${
                isActive
                  ? 'bg-blue-600/90 text-white font-bold shadow-md shadow-blue-900/30 border border-blue-400/30'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`p-2 rounded-lg transition ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-blue-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold block truncate">{item.label}</span>
                  <span
                    className={`text-[10px] block truncate ${
                      isActive ? 'text-blue-100' : 'text-slate-400 group-hover:text-slate-300'
                    }`}
                  >
                    {item.subtitle}
                  </span>
                </div>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`px-2 py-0.5 rounded-full font-extrabold text-[10px] shrink-0 ml-1 shadow-xs ${
                    item.badgeColor || 'bg-slate-700 text-slate-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer System Control & Demo Reset */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 space-y-2.5">
        <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] font-mono font-bold text-slate-300">{formattedTimer}</span>
          </div>
          <button
            onClick={onResetDemo}
            className="text-[10px] font-extrabold bg-slate-700 hover:bg-slate-600 text-slate-200 px-2 py-1 rounded-lg transition"
          >
            Reset Demo
          </button>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 font-medium">
          <span className="flex items-center gap-1 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            COSO Control Framework
          </span>
          <span className="font-mono text-slate-400">v4.2</span>
        </div>
      </div>
    </aside>
  );
};
