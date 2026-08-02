'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, Layers, Package, FileText, FileCheck, Building2, CreditCard, UserCheck, ArrowRight } from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  category: 'Overview' | 'Inventory' | 'Sales' | 'Purchasing' | 'Admin';
  tabKey: 'overview' | 'inventory' | 'quotations' | 'soa' | 'purchasing' | 'rfp' | 'admin';
  icon: React.ReactNode;
}

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tabKey: any) => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
}) => {
  const [query, setQuery] = useState('');

  const commands: CommandItem[] = [
    { id: 'c1', title: 'Executive Overview & Approvals', category: 'Overview', tabKey: 'overview', icon: <Layers className="w-4 h-4 text-blue-600" /> },
    { id: 'c2', title: 'Multi-Location Inventory (QC & Pampanga)', category: 'Inventory', tabKey: 'inventory', icon: <Package className="w-4 h-4 text-emerald-600" /> },
    { id: 'c3', title: 'Sales Quotation Generator', category: 'Sales', tabKey: 'quotations', icon: <FileText className="w-4 h-4 text-amber-600" /> },
    { id: 'c4', title: 'Statement of Account (SOA)', category: 'Sales', tabKey: 'soa', icon: <FileCheck className="w-4 h-4 text-purple-600" /> },
    { id: 'c5', title: 'Purchasing & 3-Way Match', category: 'Purchasing', tabKey: 'purchasing', icon: <Building2 className="w-4 h-4 text-blue-600" /> },
    { id: 'c6', title: 'Request for Payment (RFP)', category: 'Purchasing', tabKey: 'rfp', icon: <CreditCard className="w-4 h-4 text-rose-600" /> },
    { id: 'c7', title: 'System Audit Log Stream', category: 'Admin', tabKey: 'admin', icon: <UserCheck className="w-4 h-4 text-slate-700" /> },
  ];

  // Listen for Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or trigger
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-slate-300 overflow-hidden text-slate-900">
        {/* Search Header Bar */}
        <div className="p-3 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Type a command or search module (e.g. Inventory, SOA, Quotation)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-900 focus:outline-none placeholder-slate-400 font-medium"
            autoFocus
          />
          <kbd className="hidden sm:inline-block bg-slate-200 text-slate-700 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-300">
            ESC
          </kbd>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Command Results */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1 text-xs">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-slate-500">
              No matching module or command found for "{query}"
            </div>
          ) : (
            filtered.map((cmd) => (
              <button
                key={cmd.id}
                onClick={() => {
                  onSelectTab(cmd.tabKey);
                  onClose();
                }}
                className="w-full p-2.5 rounded-lg flex items-center justify-between hover:bg-slate-100 transition text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-md border border-slate-200 group-hover:bg-white transition">
                    {cmd.icon}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{cmd.title}</span>
                    <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{cmd.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-slate-400 group-hover:text-blue-600 font-medium text-[11px]">
                  <span>Jump</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="p-2.5 bg-slate-100 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between items-center px-4">
          <span>Navigate: <strong className="text-slate-800">↑ ↓</strong> to navigate</span>
          <span>Select: <strong className="text-slate-800">Enter</strong></span>
        </div>
      </div>
    </div>
  );
};
