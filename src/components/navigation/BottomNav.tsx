'use client';

import React from 'react';
import { Layers, Package, Camera, Menu, FileText, FileCheck } from 'lucide-react';
import { canUseOperation, getAllowedTabs, type Role } from '@/lib/permissions';

interface BottomNavProps {
  activeTab: string;
  onSelectTab: (tabKey: string) => void;
  onOpenScanner: () => void;
  onOpenMobileDrawer: () => void;
  viewAsRole: Role;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenScanner,
  onOpenMobileDrawer,
  viewAsRole,
}) => {
  const allowedTabs = getAllowedTabs(viewAsRole);

  return (
    <nav aria-label="Mobile primary navigation" className="bottom-nav fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around gap-1 px-2 pt-2 text-slate-700 no-print lg:hidden">
      {/* 1. Overview */}
      {allowedTabs.includes('overview') && (
        <button
          type="button"
          onClick={() => onSelectTab('overview')}
          aria-current={activeTab === 'overview' ? 'page' : undefined}
          data-active={activeTab === 'overview'}
          className={`mobile-nav-item flex flex-col items-center justify-center py-1 px-2 transition cursor-pointer min-h-[44px] ${
            activeTab === 'overview'
              ? 'font-medium'
              : 'font-normal'
          }`}
        >
          <Layers className={`w-5 h-5 ${activeTab === 'overview' ? 'text-blue-900 scale-110' : 'text-slate-500'}`} />
          <span className="mt-0.5 text-[10px] tracking-tight">Overview</span>
        </button>
      )}

      {/* 2. Stock / Inventory */}
      {allowedTabs.includes('inventory') && (
        <button
          type="button"
          onClick={() => onSelectTab('inventory')}
          aria-current={activeTab === 'inventory' ? 'page' : undefined}
          data-active={activeTab === 'inventory'}
          className={`mobile-nav-item flex flex-col items-center justify-center py-1 px-2 transition cursor-pointer min-h-[44px] ${
            activeTab === 'inventory'
              ? 'font-medium'
              : 'font-normal'
          }`}
        >
          <Package className={`w-5 h-5 ${activeTab === 'inventory' ? 'text-blue-900 scale-110' : 'text-slate-500'}`} />
          <span className="mt-0.5 text-[10px] tracking-tight">Stock</span>
        </button>
      )}

      {/* 3. Primary Elevated Center Action: Barcode Camera Scanner */}
      {canUseOperation(viewAsRole, 'scanner') && <button
        type="button"
        onClick={onOpenScanner}
        aria-label="Open camera barcode scanner"
        className="mobile-nav-action -mt-6 flex min-h-[56px] min-w-[56px] shrink-0 flex-col items-center justify-center rounded-full p-3 text-white"
        title="Camera barcode scanner"
      >
        <Camera className="w-6 h-6 text-amber-400" />
      </button>}

      {/* 4. Quotes / SOA based on permission */}
      {allowedTabs.includes('quotations') ? (
        <button
          type="button"
          onClick={() => onSelectTab('quotations')}
          aria-current={activeTab === 'quotations' ? 'page' : undefined}
          data-active={activeTab === 'quotations'}
          className={`mobile-nav-item flex flex-col items-center justify-center py-1 px-2 transition cursor-pointer min-h-[44px] ${
            activeTab === 'quotations'
              ? 'font-medium'
              : 'font-normal'
          }`}
        >
          <FileText className={`w-5 h-5 ${activeTab === 'quotations' ? 'text-blue-900 scale-110' : 'text-slate-500'}`} />
          <span className="mt-0.5 text-[10px] tracking-tight">Quotes</span>
        </button>
      ) : allowedTabs.includes('soa') ? (
        <button
          type="button"
          onClick={() => onSelectTab('soa')}
          aria-current={activeTab === 'soa' ? 'page' : undefined}
          data-active={activeTab === 'soa'}
          className={`mobile-nav-item flex flex-col items-center justify-center py-1 px-2 transition cursor-pointer min-h-[44px] ${
            activeTab === 'soa'
              ? 'font-medium'
              : 'font-normal'
          }`}
        >
          <FileCheck className={`w-5 h-5 ${activeTab === 'soa' ? 'text-blue-900 scale-110' : 'text-slate-500'}`} />
          <span className="mt-0.5 text-[10px] tracking-tight">SOA</span>
        </button>
      ) : null}

      {/* 5. More Modules Drawer */}
      <button
        type="button"
        onClick={onOpenMobileDrawer}
        aria-label="Open more modules"
        className="mobile-nav-item flex flex-col items-center justify-center py-1 px-2 font-normal transition cursor-pointer min-h-[44px]"
      >
        <Menu className="w-5 h-5 text-slate-600" />
        <span className="mt-0.5 text-[10px] tracking-tight">More</span>
      </button>
    </nav>
  );
};
