'use client';

import React, { useState, useMemo } from 'react';
import {
  Package,
  Search,
  Plus,
  Filter,
  MapPin,
  Barcode,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Camera,
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
  const [selectedLocation, setSelectedLocation] = useState<'ALL' | 'Quezon City' | 'Pampanga'>('ALL');

  const filteredInventory = useMemo(() => {
    return inventoryList.filter((item) => {
      const matchesSearch =
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.lotNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLocation = selectedLocation === 'ALL' || item.location === selectedLocation;
      return matchesSearch && matchesLocation;
    });
  }, [inventoryList, searchQuery, selectedLocation]);

  const qcCount = inventoryList.filter((i) => i.location === 'Quezon City').length;
  const pampangaCount = inventoryList.filter((i) => i.location === 'Pampanga').length;

  return (
    <div className="space-y-5">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-600" />
            Multi-Location Inventory Control
          </h2>
          <p className="text-xs text-slate-500 font-medium">Quezon City &amp; Pampanga Medical Warehouses (FEFO Lot &amp; Expiry Tracking)</p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto flex-wrap">
          <button
            onClick={onOpenScanner}
            className="flex-1 sm:flex-initial px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Camera className="w-4 h-4 text-blue-400" />
            <span>Scan Barcode</span>
          </button>

          <button
            onClick={onOpenProductManager}
            className="flex-1 sm:flex-initial px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Barcode className="w-4 h-4 text-blue-300" />
            <span>Manage SKUs</span>
          </button>

          <button
            onClick={onOpenAddStock}
            className="flex-1 sm:flex-initial px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Adjust Stock</span>
          </button>
        </div>
      </div>

      {/* Warehouse Location Segmented Control Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by SKU, Description, or Lot Number..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Location Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setSelectedLocation('ALL')}
            className={`px-3 py-1.5 rounded-lg font-extrabold text-xs transition ${
              selectedLocation === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({inventoryList.length})
          </button>

          <button
            onClick={() => setSelectedLocation('Quezon City')}
            className={`px-3 py-1.5 rounded-lg font-extrabold text-xs transition flex items-center gap-1.5 ${
              selectedLocation === 'Quezon City' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-blue-200" />
            Quezon City ({qcCount})
          </button>

          <button
            onClick={() => setSelectedLocation('Pampanga')}
            className={`px-3 py-1.5 rounded-lg font-extrabold text-xs transition flex items-center gap-1.5 ${
              selectedLocation === 'Pampanga' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-purple-200" />
            Pampanga ({pampangaCount})
          </button>
        </div>
      </div>

      {/* Inventory Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3">SKU / Barcode</th>
                <th className="p-3">Product Description</th>
                <th className="p-3">Location</th>
                <th className="p-3">Lot # / Expiry</th>
                <th className="p-3 text-right">On-Hand</th>
                <th className="p-3 text-right">Reserved</th>
                <th className="p-3 text-right">Available</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
              {filteredInventory.map((item) => {
                const available = item.onHand - item.reserved;
                const isLow = available <= 30;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-mono font-bold text-blue-900 whitespace-nowrap">{item.sku}</td>
                    <td className="p-3 font-semibold">{item.description}</td>
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.location === 'Quezon City'
                            ? 'bg-blue-100 text-blue-900'
                            : 'bg-purple-100 text-purple-900'
                        }`}
                      >
                        {item.location}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className="font-mono text-slate-700 block text-[11px]">{item.lotNumber}</span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        Exp: {item.expiryDate}
                      </span>
                    </td>
                    <td className="p-3 text-right font-bold whitespace-nowrap">{item.onHand} {item.unit}</td>
                    <td className="p-3 text-right font-semibold text-amber-700 whitespace-nowrap">{item.reserved} {item.unit}</td>
                    <td className="p-3 text-right font-mono font-black text-slate-900 whitespace-nowrap">
                      {available} {item.unit}
                    </td>
                    <td className="p-3 text-center whitespace-nowrap">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
                          <AlertTriangle className="w-3 h-3 text-amber-600" /> Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Normal
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredInventory.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 font-medium">
                    No medical inventory items found matching &quot;{searchQuery}&quot;.
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
