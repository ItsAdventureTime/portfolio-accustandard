'use client';

import React from 'react';
import {
  Package,
  Search,
  Plus,
  QrCode,
  Download,
  Building2,
  AlertCircle,
  Calendar,
  Lock,
} from 'lucide-react';

interface InventoryControlProps {
  inventoryList: any[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenAddStock: () => void;
  onOpenProductManager: () => void;
  onOpenScanner: () => void;
}

export const InventoryControl: React.FC<InventoryControlProps> = ({
  inventoryList,
  searchQuery,
  onSearchChange,
  onOpenAddStock,
  onOpenProductManager,
  onOpenScanner,
}) => {
  const filteredInventory = inventoryList.filter(
    (item) =>
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 text-slate-900">
      {/* Module Title & Actions Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Package className="w-6 h-6 text-emerald-700" />
            Multi-Location Inventory Management (QC &amp; Pampanga)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
            Live Stock Items: <span className="font-bold text-slate-900">{filteredInventory.length} SKUs maintained</span> &bull; FEFO Expiry &amp; Lot Control
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto flex-wrap">
          <button
            onClick={onOpenProductManager}
            className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span>Manage Barcode SKUs</span>
          </button>

          <button
            onClick={onOpenAddStock}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Stock Batch</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Filter inventory by SKU, description, lot number, or warehouse location..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <button
          onClick={onOpenScanner}
          className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-sm shrink-0"
        >
          <QrCode className="w-4 h-4" />
          <span>Camera Barcode Scanner</span>
        </button>
      </div>

      {/* Inventory Grid Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-xs">
              <tr>
                <th className="p-4">SKU / Barcode</th>
                <th className="p-4">Item Description</th>
                <th className="p-4">Location</th>
                <th className="p-4">Batch / Lot</th>
                <th className="p-4">Expiry Date</th>
                <th className="p-4 text-right">On-Hand</th>
                <th className="p-4 text-right">Reserved (3-Day)</th>
                <th className="p-4 text-right">Available</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-semibold text-slate-800">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="p-4 font-mono font-extrabold text-blue-900">{item.sku}</td>
                  <td className="p-4 font-bold text-slate-900">{item.description}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-1.5 w-fit">
                      <Building2 className="w-3.5 h-3.5 text-blue-700" />
                      {item.location}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-xs text-slate-700">{item.lotNumber}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1.5 w-fit">
                      <Calendar className="w-3.5 h-3.5 text-amber-700" />
                      {item.expiryDate}
                    </span>
                  </td>
                  <td className="p-4 text-right font-mono font-bold text-slate-900">{item.onHand}</td>
                  <td className="p-4 text-right font-mono text-xs text-amber-700 font-bold">
                    {item.reserved}
                  </td>
                  <td className="p-4 text-right font-mono font-extrabold text-emerald-800 text-base">
                    {item.available}
                  </td>
                </tr>
              ))}

              {filteredInventory.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 font-bold">
                    No registered inventory items matching &quot;{searchQuery}&quot;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
