'use client';

import React from 'react';
import { Layers, Package, Camera, Menu, FileText } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onSelectTab: (tabKey: string) => void;
  onOpenScanner: () => void;
  onOpenMobileDrawer: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenScanner,
  onOpenMobileDrawer,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-300 shadow-2xl px-3 py-2 flex items-center justify-around text-slate-700">
      {/* 1. Overview */}
      <button
        type="button"
        onClick={() => onSelectTab('overview')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition cursor-pointer min-h-[44px] ${
          activeTab === 'overview'
            ? 'text-blue-950 font-black'
            : 'text-slate-500 hover:text-slate-900 font-semibold'
        }`}
      >
        <Layers className={`w-5 h-5 ${activeTab === 'overview' ? 'text-blue-900 scale-110' : 'text-slate-500'}`} />
        <span className="text-[10px] mt-0.5 uppercase tracking-wider">Overview</span>
      </button>

      {/* 2. Inventory */}
      <button
        type="button"
        onClick={() => onSelectTab('inventory')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition cursor-pointer min-h-[44px] ${
          activeTab === 'inventory'
            ? 'text-blue-950 font-black'
            : 'text-slate-500 hover:text-slate-900 font-semibold'
        }`}
      >
        <Package className={`w-5 h-5 ${activeTab === 'inventory' ? 'text-blue-900 scale-110' : 'text-slate-500'}`} />
        <span className="text-[10px] mt-0.5 uppercase tracking-wider">Stock</span>
      </button>

      {/* 3. Primary Center Thumb Action: Barcode Scanner */}
      <button
        type="button"
        onClick={onOpenScanner}
        className="flex flex-col items-center justify-center -mt-5 bg-blue-900 hover:bg-blue-800 text-white rounded-full p-3.5 shadow-xl transition-all active:scale-95 border-4 border-white cursor-pointer min-h-[52px] min-w-[52px]"
        title="Instant Mobile Camera Barcode Scanner"
      >
        <Camera className="w-6 h-6 text-amber-400" />
      </button>

      {/* 4. Quotations */}
      <button
        type="button"
        onClick={() => onSelectTab('quotations')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition cursor-pointer min-h-[44px] ${
          activeTab === 'quotations'
            ? 'text-blue-950 font-black'
            : 'text-slate-500 hover:text-slate-900 font-semibold'
        }`}
      >
        <FileText className={`w-5 h-5 ${activeTab === 'quotations' ? 'text-blue-900 scale-110' : 'text-slate-500'}`} />
        <span className="text-[10px] mt-0.5 uppercase tracking-wider">Quotes</span>
      </button>

      {/* 5. More Modules Drawer */}
      <button
        type="button"
        onClick={onOpenMobileDrawer}
        className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-slate-500 hover:text-slate-900 font-semibold transition cursor-pointer min-h-[44px]"
      >
        <Menu className="w-5 h-5 text-slate-600" />
        <span className="text-[10px] mt-0.5 uppercase tracking-wider">More</span>
      </button>
    </div>
  );
};
