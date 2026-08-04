'use client';

import React from 'react';
import {
  Search,
  Camera,
  Smartphone,
  Eye,
  Menu,
} from 'lucide-react';
import { AccustandardLogo } from '@/components/brand/AccustandardLogo';

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
    <header className="bg-white border-b border-slate-200 text-slate-900 sticky top-0 z-30 shadow-xs w-full">
      <div className="w-full px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button
            onClick={onOpenMobileDrawer}
            className="md:hidden p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition border border-slate-200 active:scale-95"
            aria-label="Open mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Mobile Logo Branding */}
          <div className="flex items-center md:hidden shrink-0">
            <AccustandardLogo size="sm" />
          </div>

          {/* Desktop Search Trigger / Command Palette */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenCommandPalette}
              className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold transition shadow-xs w-80 justify-between cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-700" />
                <span className="font-bold text-slate-500">Search SKU, PO, RFP...</span>
              </span>
              <kbd className="bg-white text-slate-600 font-mono text-xs px-2 py-0.5 rounded border border-slate-300 shadow-2xs font-extrabold">
                ⌘K
              </kbd>
            </button>
          </div>
        </div>

        {/* Right: Actions & Role Impersonation */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Role Impersonation Control */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-2.5 sm:px-3 py-1 sm:py-1.5 flex items-center gap-1.5 sm:gap-2.5 shadow-2xs">
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

          {/* Desktop Barcode Scanner & PWA Buttons */}
          <button
            onClick={onOpenScanner}
            className="hidden sm:flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3.5 py-2 rounded-xl text-sm font-extrabold transition shadow-sm active:scale-95"
            title="Open Live Barcode Camera Scanner"
          >
            <Camera className="w-4 h-4" />
            <span>Scan Barcode</span>
          </button>

          <button
            onClick={onOpenPWAInstall}
            className="hidden sm:block p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-xl transition border border-slate-300 active:scale-95"
            title="Install as PWA Instructions"
          >
            <Smartphone className="w-5 h-5 text-blue-800" />
          </button>
        </div>
      </div>
    </header>
  );
};
