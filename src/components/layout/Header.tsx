'use client';

import React from 'react';
import {
  Search,
  Smartphone,
  Eye,
  Menu,
  Wrench,
  ChevronDown,
  Download,
  Upload,
  Database,
  Barcode,
  ScanLine,
} from 'lucide-react';
import { AccustandardLogo } from '@/components/brand/AccustandardLogo';

interface HeaderProps {
  viewAsRole: string;
  onChangeRole: (role: string) => void;
  onOpenCommandPalette: () => void;
  onOpenScanner: () => void;
  onOpenPWAInstall: () => void;
  onOpenMobileDrawer: () => void;
  onOpenExport: () => void;
  onOpenStartupImport: () => void;
  onOpenQBOQueue: () => void;
  onOpenProductManager: () => void;
  qboQueueCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  viewAsRole,
  onChangeRole,
  onOpenCommandPalette,
  onOpenScanner,
  onOpenPWAInstall,
  onOpenMobileDrawer,
  onOpenExport,
  onOpenStartupImport,
  onOpenQBOQueue,
  onOpenProductManager,
  qboQueueCount,
}) => {
  const [isToolsOpen, setIsToolsOpen] = React.useState(false);

  return (
    <header role="banner" className="bg-white/90 backdrop-blur-xl border-b border-slate-200/80 text-slate-900 sticky top-0 z-30 shadow-xs w-full transition-all duration-200 pt-[env(safe-area-inset-top,0px)]">
      <div className="w-full px-2.5 sm:px-6 lg:px-8 py-2 sm:py-3 flex items-center justify-between gap-1.5 sm:gap-4">
        {/* Left: Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink min-w-0">
          <button
            onClick={onOpenMobileDrawer}
            className="lg:hidden p-1.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200 border border-slate-200 active:scale-95 cursor-pointer shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Open mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Mobile Logo Branding with max-w constraint to prevent notch collision */}
          <div className="flex items-center lg:hidden shrink min-w-0 max-w-[135px] xs:max-w-[160px] sm:max-w-none overflow-hidden">
            <AccustandardLogo size="sm" className="max-h-6 xs:max-h-7 sm:max-h-9" />
          </div>

          {/* Desktop Search Trigger / Command Palette */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={onOpenCommandPalette}
              className="flex items-center gap-3 bg-slate-50/80 hover:bg-white hover:border-blue-400 border border-slate-300/80 text-slate-700 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 shadow-xs hover:shadow-md w-80 justify-between cursor-pointer group"
            >
              <span className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-blue-700 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-bold text-slate-500 group-hover:text-slate-800 transition-colors">Search SKU, PO, RFP...</span>
              </span>
              <kbd className="bg-white text-slate-700 font-mono text-xs px-2 py-0.5 rounded-lg border border-slate-300 shadow-2xs font-black group-hover:border-blue-300">
                ⌘K
              </kbd>
            </button>
          </div>
        </div>

        {/* Right: Actions & Role Impersonation */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Role Impersonation Control */}
          <div className="bg-blue-50/90 border border-blue-200/90 hover:border-blue-400 rounded-2xl px-3 py-1.5 flex items-center gap-2 sm:gap-3 shadow-2xs transition-all duration-200">
            <Eye className="w-4 h-4 text-blue-700 shrink-0" />
            <div className="hidden sm:block text-left">
              <span className="text-[10px] text-blue-800 font-black uppercase tracking-wider block leading-none mb-0.5">
                Simulate Role
              </span>
              <select
                value={viewAsRole}
                onChange={(e) => onChangeRole(e.target.value)}
                className="bg-transparent text-blue-950 font-black text-sm focus:outline-none cursor-pointer pr-1"
              >
                <option value="Admin" className="bg-white text-slate-900 font-bold">Admin (Bridge)</option>
                <option value="Chairman (DCS)" className="bg-white text-slate-900 font-bold">Chairman (DCS)</option>
                <option value="General Manager" className="bg-white text-slate-900 font-bold">General Manager (Karen)</option>
                <option value="Bookkeeper" className="bg-white text-slate-900 font-bold">Bookkeeper (Aila)</option>
                <option value="Warehouse" className="bg-white text-slate-900 font-bold">Warehouse (Marie)</option>
                <option value="Marketing" className="bg-white text-slate-900 font-bold">Marketing (Reviewer)</option>
                <option value="Sales" className="bg-white text-slate-900 font-bold">Sales Officer</option>
              </select>
            </div>

            {/* Mobile Compact Role Select */}
            <select
              value={viewAsRole}
              onChange={(e) => onChangeRole(e.target.value)}
              className="sm:hidden bg-transparent text-blue-950 font-black text-xs focus:outline-none cursor-pointer py-0.5"
            >
              <option value="Admin" className="bg-white text-slate-900">Admin</option>
              <option value="Chairman (DCS)" className="bg-white text-slate-900">Chairman</option>
              <option value="General Manager" className="bg-white text-slate-900">GM</option>
              <option value="Bookkeeper" className="bg-white text-slate-900">Bookkeeper</option>
              <option value="Warehouse" className="bg-white text-slate-900">Warehouse</option>
              <option value="Marketing" className="bg-white text-slate-900">Marketing</option>
              <option value="Sales" className="bg-white text-slate-900">Sales</option>
            </select>
          </div>

          {/* Secondary operations stay together so the primary header stays focused. */}
          <div className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => setIsToolsOpen((open) => !open)}
              aria-expanded={isToolsOpen}
              aria-haspopup="menu"
              className="flex min-h-[44px] items-center gap-2 rounded-2xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-extrabold text-slate-800 shadow-xs transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50"
            >
              <Wrench className="h-4 w-4 text-blue-800" />
              <span>Operations &amp; tools</span>
              {qboQueueCount > 0 && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-900">{qboQueueCount}</span>}
              <ChevronDown className={`h-4 w-4 transition-transform ${isToolsOpen ? 'rotate-180' : ''}`} />
            </button>
            {isToolsOpen && (
              <div role="menu" className="absolute right-0 top-[calc(100%+0.5rem)] z-40 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                <p className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Operations &amp; tools</p>
                <button type="button" role="menuitem" onClick={() => { onOpenExport(); setIsToolsOpen(false); }} className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold text-slate-800 transition hover:bg-slate-100">
                  <Download className="h-4 w-4 text-blue-700" /> Export report
                </button>
                <button type="button" role="menuitem" onClick={() => { onOpenStartupImport(); setIsToolsOpen(false); }} className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold text-slate-800 transition hover:bg-slate-100">
                  <Upload className="h-4 w-4 text-blue-700" /> Startup import
                </button>
                <button type="button" role="menuitem" onClick={() => { onOpenQBOQueue(); setIsToolsOpen(false); }} className="flex min-h-[44px] w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold text-slate-800 transition hover:bg-slate-100">
                  <span className="flex items-center gap-3"><Database className="h-4 w-4 text-emerald-700" /> QBO sync queue</span>
                  {qboQueueCount > 0 && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-900">{qboQueueCount}</span>}
                </button>
                <button type="button" role="menuitem" onClick={() => { onOpenProductManager(); setIsToolsOpen(false); }} className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold text-slate-800 transition hover:bg-slate-100">
                  <Barcode className="h-4 w-4 text-indigo-700" /> Barcode manager
                </button>
                <button type="button" role="menuitem" onClick={() => { onOpenScanner(); setIsToolsOpen(false); }} className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold text-slate-800 transition hover:bg-slate-100">
                  <ScanLine className="h-4 w-4 text-rose-700" /> Barcode scanner
                </button>
              </div>
            )}
          </div>

          <button
            onClick={onOpenPWAInstall}
            className="hidden sm:block p-2.5 bg-slate-100/80 hover:bg-slate-200 hover:border-slate-400 text-slate-700 hover:text-slate-900 rounded-2xl transition-all duration-200 border border-slate-300 active:scale-95 cursor-pointer"
            title="Install as PWA Instructions"
          >
            <Smartphone className="w-5 h-5 text-blue-800" />
          </button>
        </div>
      </div>
    </header>
  );
};
