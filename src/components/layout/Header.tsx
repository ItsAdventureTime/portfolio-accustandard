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
    <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/80 text-slate-900 sticky top-0 z-30 shadow-xs w-full transition-all duration-200 pt-[env(safe-area-inset-top,0px)]">
      <div className="w-full px-2.5 sm:px-6 lg:px-8 py-2 sm:py-3 flex items-center justify-between gap-1.5 sm:gap-4">
        {/* Left: Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink min-w-0">
          <button
            onClick={onOpenMobileDrawer}
            className="md:hidden p-1.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200 border border-slate-200 active:scale-95 cursor-pointer shrink-0 min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="Open mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Mobile Logo Branding with max-w constraint to prevent notch collision */}
          <div className="flex items-center md:hidden shrink min-w-0 max-w-[135px] xs:max-w-[160px] sm:max-w-none overflow-hidden">
            <AccustandardLogo size="sm" className="max-h-6 xs:max-h-7 sm:max-h-9" />
          </div>

          {/* Desktop Search Trigger / Command Palette */}
          <div className="hidden md:flex items-center gap-3">
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

          {/* Desktop Barcode Scanner & PWA Buttons */}
          <button
            onClick={onOpenScanner}
            className="hidden sm:flex items-center gap-2 bg-red-600 hover:bg-red-700 hover:shadow-md text-white px-4 py-2.5 rounded-2xl text-sm font-extrabold transition-all duration-200 shadow-sm active:scale-95 cursor-pointer"
            title="Open Live Barcode Camera Scanner"
          >
            <Camera className="w-4 h-4" />
            <span>Scan Barcode</span>
          </button>

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
