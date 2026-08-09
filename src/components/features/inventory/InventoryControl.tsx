'use client';

import React, { useState } from 'react';
import {
  Package,
  Search,
  Plus,
  QrCode,
  Building2,
  Calendar,
  Layers,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  ArrowRight,
  TrendingUp,
  Barcode,
  Eye,
  X,
} from 'lucide-react';

interface InventoryControlProps {
  inventoryList: any[];
  replenishmentPlannerList: any[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenAddStock: () => void;
  onOpenProductManager: () => void;
  onOpenScanner: () => void;
}

export const InventoryControl: React.FC<InventoryControlProps> = ({
  inventoryList,
  replenishmentPlannerList,
  searchQuery,
  onSearchChange,
  onOpenAddStock,
  onOpenProductManager,
  onOpenScanner,
}) => {
  const [activeTab, setActiveTab] = useState<'LIVE' | 'REPLENISHMENT'>('LIVE');
  const [selectedSkuModal, setSelectedSkuModal] = useState<any | null>(null);

  const filteredInventory = inventoryList.filter(
    (item) =>
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Package className="w-6 h-6 text-emerald-700" />
            Multi-Location Inventory Management (QC &amp; Pampanga)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
            Live Stock Items: <span className="font-bold text-slate-900">{filteredInventory.length} SKUs maintained</span> &bull; Demand-Driven Replenishment &amp; FEFO Expiry
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
            <span>Add Stock Batch</span>
          </button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('LIVE')}
          className={`pb-3 px-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'LIVE'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Live Inventory SKUs ({inventoryList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('REPLENISHMENT')}
          className={`pb-3 px-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'REPLENISHMENT'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4 text-amber-700" />
          <span>Demand &amp; Replenishment Planner (Class 1/2/3)</span>
          <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-full">
            {replenishmentPlannerList.length} Items
          </span>
        </button>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'LIVE' && (
        <>
          {/* Search & Scanner Input Bar */}
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

          {/* Inventory Table */}
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
                    <tr key={item.id} className="hover:bg-blue-50/50 transition group">
                      <td className="p-4">
                        <button
                          onClick={() => setSelectedSkuModal(item)}
                          className="font-mono font-extrabold text-blue-900 hover:text-blue-700 hover:underline flex items-center gap-1.5 group-hover:scale-105 transition-transform"
                        >
                          <Barcode className="w-4 h-4 text-blue-700 shrink-0" />
                          <span>{item.sku}</span>
                          <Eye className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-blue-600 transition-opacity" />
                        </button>
                      </td>
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
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'REPLENISHMENT' && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              Demand-Driven Replenishment Rules (Blueprint Section 3)
            </p>
            <p className="text-amber-800">
              Replenishment is triggered by actual available stock, reservations, open customer demand, lead time, and critical levels.
              <br />
              &bull; <strong>Class 1 (Core Stock)</strong>: Reorder at critical level + 10% safety buffer.
              <br />
              &bull; <strong>Class 2 (Controlled)</strong>: Requires demand forecast review.
              <br />
              &bull; <strong>Class 3 (Short-Expiry / Special)</strong>: Hard-blocked without linked Customer PO to prevent over-stocking.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-xs">
                  <tr>
                    <th className="p-4">SKU / Class</th>
                    <th className="p-4">Description / Supplier</th>
                    <th className="p-4 text-right">Available Stock</th>
                    <th className="p-4 text-right">Open Demand</th>
                    <th className="p-4 text-right">Critical Level</th>
                    <th className="p-4 text-right">Proposed Order Qty</th>
                    <th className="p-4">Class Controls &amp; Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-semibold text-slate-800">
                  {replenishmentPlannerList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition">
                      <td className="p-4">
                        <div className="font-mono font-extrabold text-blue-900">{item.sku}</div>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded border border-slate-200">
                          {item.itemClass}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{item.description}</div>
                        <div className="text-xs text-slate-500">{item.supplier} &bull; Lead Time: {item.leadTimeDays} days</div>
                      </td>
                      <td className="p-4 text-right font-mono font-bold text-slate-800">{item.availableStock}</td>
                      <td className="p-4 text-right font-mono text-amber-700 font-bold">{item.openCustomerDemand}</td>
                      <td className="p-4 text-right font-mono text-slate-700 font-bold">{item.criticalLevel}</td>
                      <td className="p-4 text-right font-mono font-black text-blue-900 text-base">
                        {item.proposedOrderQty}
                      </td>
                      <td className="p-4">
                        {item.itemClass.includes('Class 3') && (
                          <div className="space-y-1">
                            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full inline-flex items-center gap-1">
                              <FileCheck className="w-3.5 h-3.5" />
                              Customer PO Linked
                            </span>
                            <p className="text-[10px] text-slate-500">{item.linkedCustomerPO}</p>
                          </div>
                        )}
                        {item.itemClass.includes('Class 1') && (
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full inline-flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Buffer +10% Applied
                          </span>
                        )}
                        {item.itemClass.includes('Class 2') && (
                          <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full inline-flex items-center gap-1">
                            <Layers className="w-3.5 h-3.5" />
                            Forecast Verified
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SKU Barcode & Stock Detail Modal Overlay */}
      {selectedSkuModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-300 animate-in fade-in zoom-in duration-200 text-slate-900 text-xs">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-700 text-white rounded-xl">
                  <Barcode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase text-slate-900 tracking-wider">
                    SKU Details: {selectedSkuModal.sku}
                  </h3>
                  <p className="text-slate-500 font-medium">{selectedSkuModal.description}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSkuModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 bg-slate-100 rounded-xl">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">On-Hand</span>
                <span className="font-mono font-extrabold text-slate-900 text-base">{selectedSkuModal.onHand}</span>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <span className="text-[10px] text-amber-700 font-bold block uppercase">Reserved (3-Day)</span>
                <span className="font-mono font-extrabold text-amber-900 text-base">{selectedSkuModal.reserved}</span>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <span className="text-[10px] text-emerald-700 font-bold block uppercase">Available</span>
                <span className="font-mono font-extrabold text-emerald-900 text-base">{selectedSkuModal.available}</span>
              </div>
            </div>

            {/* Batch & Location Info */}
            <div className="space-y-2 p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium">
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Warehouse Location:</span>
                <span className="font-bold text-slate-900">{selectedSkuModal.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Batch / Lot Number:</span>
                <span className="font-mono font-extrabold text-blue-900">{selectedSkuModal.lotNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">FEFO Expiry Date:</span>
                <span className="font-bold text-amber-900">{selectedSkuModal.expiryDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Unit Metric:</span>
                <span className="font-bold text-slate-800">{selectedSkuModal.unit || 'Kits'}</span>
              </div>
            </div>

            {/* Visual Barcode Tag Graphic */}
            <div className="p-3 bg-white border border-slate-300 rounded-xl text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Scannable GS1 Barcode Preview</span>
              <div className="font-mono font-black text-xl tracking-[0.25em] text-slate-900 select-all py-1">
                ||| | |||| | ||| |||| | | |||
              </div>
              <span className="font-mono text-[10px] text-slate-600 font-bold">*ACC-{selectedSkuModal.sku}*</span>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedSkuModal(null);
                  onOpenAddStock();
                }}
                className="px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white font-extrabold rounded-xl transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Stock Batch</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedSkuModal(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
