'use client';

import React from 'react';
import {
  Barcode,
  ChevronDown,
  Database,
  Download,
  Menu,
  MoreHorizontal,
  Plus,
  ScanLine,
  Search,
  Smartphone,
  Upload,
  UserCircle2,
} from 'lucide-react';
import { AccustandardLogo } from '@/components/brand/AccustandardLogo';

interface HeaderProps {
  activeTab: string;
  viewAsRole: string;
  onSelectTab: (tabKey: string) => void;
  onChangeRole: (role: string) => void;
  onOpenCommandPalette: () => void;
  onOpenCreateNew: () => void;
  onOpenScanner: () => void;
  onOpenPWAInstall: () => void;
  onOpenMobileDrawer: () => void;
  onOpenExport: () => void;
  onOpenStartupImport: () => void;
  onOpenQBOQueue: () => void;
  onOpenProductManager: () => void;
  qboQueueCount: number;
  allowedTabs?: string[];
}

const ROLE_ALLOWED_TABS: Record<string, string[]> = {
  Admin: ['overview', 'inventory', 'quotations', 'soa', 'purchasing', 'rfp', 'admin'],
  'Chairman (DCS)': ['overview', 'inventory', 'quotations', 'soa', 'purchasing', 'rfp', 'admin'],
  'General Manager': ['overview', 'inventory', 'quotations', 'soa', 'purchasing', 'rfp', 'admin'],
  Bookkeeper: ['overview', 'soa', 'purchasing', 'rfp'],
  Warehouse: ['overview', 'inventory', 'purchasing'],
  Marketing: ['overview', 'quotations'],
  Sales: ['overview', 'quotations', 'inventory'],
};

const roleOptions = [
  ['Admin', 'Admin'],
  ['Chairman (DCS)', 'Chairman (DCS)'],
  ['General Manager', 'General Manager'],
  ['Bookkeeper', 'Bookkeeper'],
  ['Warehouse', 'Warehouse'],
  ['Marketing', 'Marketing'],
  ['Sales', 'Sales Officer'],
];

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  viewAsRole,
  onSelectTab,
  onChangeRole,
  onOpenCommandPalette,
  onOpenCreateNew,
  onOpenScanner,
  onOpenPWAInstall,
  onOpenMobileDrawer,
  onOpenExport,
  onOpenStartupImport,
  onOpenQBOQueue,
  onOpenProductManager,
  qboQueueCount,
  allowedTabs,
}) => {
  const [isToolsOpen, setIsToolsOpen] = React.useState(false);
  const allowed = allowedTabs || ROLE_ALLOWED_TABS[viewAsRole] || ROLE_ALLOWED_TABS.Admin;
  const ordersTarget = allowed.includes('quotations') ? 'quotations' : 'purchasing';
  const financeTarget = allowed.includes('soa') ? 'soa' : 'rfp';
  const navigation = [
    { label: 'Dashboard', key: 'overview', target: 'overview', visible: allowed.includes('overview') },
    { label: 'Inventory', key: 'inventory', target: 'inventory', visible: allowed.includes('inventory') },
    { label: 'Orders', key: 'orders', target: ordersTarget, visible: allowed.includes('quotations') || allowed.includes('purchasing') },
    { label: 'Finance', key: 'finance', target: financeTarget, visible: allowed.includes('soa') || allowed.includes('rfp') },
    { label: 'Reports', key: 'reports', target: 'admin', visible: allowed.includes('admin') },
  ].filter((item) => item.visible);

  const isActive = (key: string, target: string) => {
    if (key === 'orders') return ['quotations', 'purchasing'].includes(activeTab);
    if (key === 'finance') return ['soa', 'rfp'].includes(activeTab);
    return activeTab === target;
  };

  return (
    <header
      role="banner"
      className="wayfinding-header sticky top-0 z-30 w-full pt-[env(safe-area-inset-top,0px)] text-slate-950"
    >
      <div className="mx-auto flex min-h-[72px] w-full max-w-[1440px] items-center gap-4 px-4 py-3 sm:gap-5 sm:px-6 lg:px-8">
        <div className="flex min-w-0 shrink-0 items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenMobileDrawer}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 lg:hidden"
            aria-label="Open mobile menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <AccustandardLogo size="sm" className="max-w-[154px] sm:max-w-[190px]" />
        </div>

        <nav aria-label="Primary navigation" className="hidden min-w-0 flex-1 items-center gap-7 lg:flex">
          {navigation.map((item) => {
            const active = isActive(item.key, item.target);
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onSelectTab(item.target)}
                className={`relative flex min-h-[44px] items-center px-1 text-[15px] font-medium after:absolute after:bottom-[-13px] after:left-0 after:right-0 after:h-0.5 after:rounded-full ${active ? 'text-slate-950 after:bg-blue-700' : 'text-slate-600 after:bg-transparent hover:text-slate-950'}`}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="ml-auto flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="header-search hidden h-10 w-[290px] items-center justify-between rounded-lg px-3.5 text-left text-sm shadow-inner xl:flex"
            aria-label="Quick search"
          >
            <span className="flex items-center gap-2"><Search className="h-4 w-4" /> Quick search</span>
            <kbd className="rounded bg-slate-700 px-1.5 py-0.5 text-[10px] font-bold text-slate-300">⌘K</kbd>
          </button>

          <div className="role-switcher flex min-h-[44px] items-center gap-1 rounded-lg px-3">
            <select
              aria-label="View as role"
              value={viewAsRole}
              onChange={(event) => onChangeRole(event.target.value)}
              className="max-w-[132px] bg-transparent text-sm font-medium outline-none sm:max-w-[170px]"
            >
              {roleOptions.map(([value, label]) => (
                <option key={value} value={value} className="bg-white text-slate-900">{label}</option>
              ))}
            </select>
            <ChevronDown aria-hidden="true" className="h-4 w-4 text-slate-300" />
          </div>

          <span role="img" className="hidden h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-slate-700 sm:inline-flex" aria-label="Current user">
            <UserCircle2 className="h-8 w-8" />
          </span>

          <button
            type="button"
            onClick={onOpenQBOQueue}
            className="relative inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100"
            aria-label={`Open QBO sync queue${qboQueueCount ? ` (${qboQueueCount} pending)` : ''}`}
          >
            <Database className="h-5 w-5" />
            {qboQueueCount > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />}
          </button>

          <div className="relative hidden lg:block">
            <button
              type="button"
              onClick={() => setIsToolsOpen((open) => !open)}
              aria-expanded={isToolsOpen}
              aria-haspopup="menu"
              aria-controls="operations-menu"
              aria-label="Open operations and tools"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
            {isToolsOpen && (
              <div id="operations-menu" role="menu" className="wayfinding-card absolute right-0 top-[calc(100%+0.5rem)] z-40 w-64 p-2 shadow-xl">
                <p className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Operations &amp; tools</p>
                <button type="button" role="menuitem" onClick={() => { onOpenCreateNew(); setIsToolsOpen(false); }} className="flex min-h-[44px] w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-800 hover:bg-slate-50"><Plus className="h-4 w-4 text-blue-700" /> Create new</button>
                <button type="button" role="menuitem" onClick={() => { onOpenExport(); setIsToolsOpen(false); }} className="flex min-h-[44px] w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-800 hover:bg-slate-50"><Download className="h-4 w-4 text-blue-700" /> Export report</button>
                <button type="button" role="menuitem" onClick={() => { onOpenStartupImport(); setIsToolsOpen(false); }} className="flex min-h-[44px] w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-800 hover:bg-slate-50"><Upload className="h-4 w-4 text-blue-700" /> Startup import</button>
                <button type="button" role="menuitem" onClick={() => { onOpenQBOQueue(); setIsToolsOpen(false); }} className="flex min-h-[44px] w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-800 hover:bg-slate-50"><span className="flex items-center gap-3"><Database className="h-4 w-4 text-emerald-700" /> QBO sync queue</span>{qboQueueCount > 0 && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-900">{qboQueueCount}</span>}</button>
                <button type="button" role="menuitem" onClick={() => { onOpenProductManager(); setIsToolsOpen(false); }} className="flex min-h-[44px] w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-800 hover:bg-slate-50"><Barcode className="h-4 w-4 text-indigo-700" /> Barcode manager</button>
                <button type="button" role="menuitem" onClick={() => { onOpenScanner(); setIsToolsOpen(false); }} className="flex min-h-[44px] w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-800 hover:bg-slate-50"><ScanLine className="h-4 w-4 text-rose-700" /> Barcode scanner</button>
                <button type="button" role="menuitem" onClick={() => { onOpenPWAInstall(); setIsToolsOpen(false); }} className="flex min-h-[44px] w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-800 hover:bg-slate-50"><Smartphone className="h-4 w-4 text-blue-700" /> Install app</button>
              </div>
            )}
          </div>

          <button type="button" onClick={onOpenCommandPalette} className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 xl:hidden" aria-label="Quick search"><Search className="h-5 w-5" /></button>
          <button type="button" onClick={onOpenPWAInstall} className="hidden min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 sm:inline-flex lg:hidden" aria-label="Install app"><Smartphone className="h-5 w-5" /></button>
        </div>
      </div>
    </header>
  );
};
