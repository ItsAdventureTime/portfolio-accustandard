'use client';

import React from 'react';
import { Layers, Package, Camera, Menu, FileText, FileCheck } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onSelectTab: (tabKey: string) => void;
  onOpenScanner: () => void;
  onOpenMobileDrawer: () => void;
  allowedTabs?: string[];
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenScanner,
  onOpenMobileDrawer,
  allowedTabs = ['overview', 'inventory', 'quotations', 'soa', 'purchasing', 'rfp', 'admin'],
}) => {
  return (
    <nav aria-label="Mobile primary navigation" className="bottom-nav fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 pt-2 text-slate-700 no-print lg:hidden">
      {/* 1. Overview */}
      {allowedTabs.includes('overview') && (
        <button
          type="button"
          onClick={() => onSelectTab('overview')}
          aria-current={activeTab === 'overview' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition cursor-pointer min-h-[44px] ${
            activeTab === 'overview'
              ? 'text-blue-950 font-black bg-blue-50 border border-blue-200/90 shadow-2xs'
              : 'text-slate-500 hover:text-slate-900 font-semibold'
          }`}
        >
          <Layers className={`w-5 h-5 ${activeTab === 'overview' ? 'text-blue-900 scale-110' : 'text-slate-500'}`} />
          <span className="text-[10px] mt-0.5 uppercase tracking-wider">Overview</span>
        </button>
      )}

      {/* 2. Stock / Inventory */}
      {allowedTabs.includes('inventory') && (
        <button
          type="button"
          onClick={() => onSelectTab('inventory')}
          aria-current={activeTab === 'inventory' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition cursor-pointer min-h-[44px] ${
            activeTab === 'inventory'
              ? 'text-blue-950 font-black bg-blue-50 border border-blue-200/90 shadow-2xs'
              : 'text-slate-500 hover:text-slate-900 font-semibold'
          }`}
        >
          <Package className={`w-5 h-5 ${activeTab === 'inventory' ? 'text-blue-900 scale-110' : 'text-slate-500'}`} />
          <span className="text-[10px] mt-0.5 uppercase tracking-wider">Stock</span>
        </button>
      )}

      {/* 3. Primary Elevated Center Action: Barcode Camera Scanner */}
      <button
        type="button"
        onClick={onOpenScanner}
        aria-label="Open camera barcode scanner"
        className="-mt-6 flex min-h-[56px] min-w-[56px] shrink-0 flex-col items-center justify-center rounded-full border-4 border-white bg-blue-900 p-3.5 text-white shadow-xl hover:bg-blue-800"
        title="Camera barcode scanner"
      >
        <Camera className="w-6 h-6 text-amber-400" />
      </button>

      {/* 4. Quotes / SOA based on permission */}
      {allowedTabs.includes('quotations') ? (
        <button
          type="button"
          onClick={() => onSelectTab('quotations')}
          aria-current={activeTab === 'quotations' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition cursor-pointer min-h-[44px] ${
            activeTab === 'quotations'
              ? 'text-blue-950 font-black bg-blue-50 border border-blue-200/90 shadow-2xs'
              : 'text-slate-500 hover:text-slate-900 font-semibold'
          }`}
        >
          <FileText className={`w-5 h-5 ${activeTab === 'quotations' ? 'text-blue-900 scale-110' : 'text-slate-500'}`} />
          <span className="text-[10px] mt-0.5 uppercase tracking-wider">Quotes</span>
        </button>
      ) : allowedTabs.includes('soa') ? (
        <button
          type="button"
          onClick={() => onSelectTab('soa')}
          aria-current={activeTab === 'soa' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition cursor-pointer min-h-[44px] ${
            activeTab === 'soa'
              ? 'text-blue-950 font-black bg-blue-50 border border-blue-200/90 shadow-2xs'
              : 'text-slate-500 hover:text-slate-900 font-semibold'
          }`}
        >
          <FileCheck className={`w-5 h-5 ${activeTab === 'soa' ? 'text-blue-900 scale-110' : 'text-slate-500'}`} />
          <span className="text-[10px] mt-0.5 uppercase tracking-wider">SOA</span>
        </button>
      ) : null}

      {/* 5. More Modules Drawer */}
      <button
        type="button"
        onClick={onOpenMobileDrawer}
        aria-label="Open more modules"
        className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-500 hover:text-slate-900 font-semibold transition cursor-pointer min-h-[44px]"
      >
        <Menu className="w-5 h-5 text-slate-600" />
        <span className="text-[10px] mt-0.5 uppercase tracking-wider">More</span>
      </button>
    </nav>
  );
};
