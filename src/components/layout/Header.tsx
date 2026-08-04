'use client';

import React from 'react';
import {
  Search,
  Camera,
  Smartphone,
  Eye,
  Menu,
  Bell,
  ShieldAlert,
} from 'lucide-react';

interface HeaderProps {
  viewAsRole: string;
  onChangeRole: (role: string) => void;
  onOpenCommandPalette: () => void;
  onOpenScanner: () => void;
  onOpenPWAInstall: () => void;
  onOpenMobileDrawer: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewAsRole,
  onChangeRole,
  onOpenCommandPalette,
  onOpenScanner,
  onOpenPWAInstall,
  onOpenMobileDrawer,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileDrawer}
            className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
            aria-label="Open mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Mobile Logo Branding */}
          <div className="flex items-center gap-2 md:hidden">
            <img
              src="/photo_2026-08-01_23-55-07.jpg"
              alt="ACCUSTANDA RxD Logo"
              className="h-7 w-auto object-contain bg-white px-1 py-0.5 rounded"
            />
          </div>

          {/* Desktop Search Trigger / Command Palette */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={onOpenCommandPalette}
              className="flex items-center gap-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 px-3.5 py-1.5 rounded-xl text-xs transition shadow-xs w-72 justify-between"
            >
              <span className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-medium text-slate-400">Search SKU, PO, RFP...</span>
              </span>
              <kbd className="bg-slate-900 text-slate-400 font-mono text-[10px] px-1.5 py-0.5 rounded border border-slate-700">
                ⌘K
              </kbd>
            </button>
          </div>
        </div>

        {/* Right: Actions & Role Impersonation */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Role Impersonation Control */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl px-2.5 py-1 flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="hidden sm:block text-left">
              <span className="text-[9px] text-amber-300 font-bold uppercase tracking-wider block leading-none">
                Simulate Role
              </span>
              <select
                value={viewAsRole}
                onChange={(e) => onChangeRole(e.target.value)}
                className="bg-transparent text-white font-extrabold text-xs focus:outline-none cursor-pointer pr-1"
              >
                <option value="Admin" className="bg-slate-900 text-white">Admin (Bridge)</option>
                <option value="Chairman (DCS)" className="bg-slate-900 text-white">Chairman (DCS)</option>
                <option value="General Manager" className="bg-slate-900 text-white">General Manager (Karen)</option>
                <option value="Bookkeeper" className="bg-slate-900 text-white">Bookkeeper (Aila)</option>
                <option value="Warehouse" className="bg-slate-900 text-white">Warehouse (Marie)</option>
                <option value="Marketing" className="bg-slate-900 text-white">Marketing (Reviewer)</option>
                <option value="Sales" className="bg-slate-900 text-white">Sales Officer</option>
              </select>
            </div>
            {/* Mobile Compact Select */}
            <select
              value={viewAsRole}
              onChange={(e) => onChangeRole(e.target.value)}
              className="sm:hidden bg-transparent text-white font-extrabold text-xs focus:outline-none cursor-pointer"
            >
              <option value="Admin" className="bg-slate-900 text-white">Admin</option>
              <option value="Chairman (DCS)" className="bg-slate-900 text-white">Chairman</option>
              <option value="General Manager" className="bg-slate-900 text-white">GM</option>
              <option value="Bookkeeper" className="bg-slate-900 text-white">Bookkeeper</option>
              <option value="Warehouse" className="bg-slate-900 text-white">Warehouse</option>
              <option value="Marketing" className="bg-slate-900 text-white">Marketing</option>
              <option value="Sales" className="bg-slate-900 text-white">Sales</option>
            </select>
          </div>

          {/* Barcode Scanner Action Trigger */}
          <button
            onClick={onOpenScanner}
            className="p-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md active:scale-95 shrink-0"
            title="Scan Barcode / QR Code"
          >
            <Camera className="w-4 h-4" />
            <span className="hidden lg:inline">Scan Barcode</span>
          </button>

          {/* PWA Guide Trigger */}
          <button
            onClick={onOpenPWAInstall}
            className="p-2 bg-blue-900/80 hover:bg-blue-800 text-blue-200 border border-blue-700/60 rounded-xl transition flex items-center justify-center active:scale-95 shrink-0"
            title="PWA App Install Guide"
          >
            <Smartphone className="w-4 h-4 text-blue-300" />
          </button>
        </div>
      </div>
    </header>
  );
};
