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
      <div className="bg-slate-200/70 p-1.5 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-1.5 w-full sm:w-fit border border-slate-300/80 shadow-2xs">
        <button
          onClick={() => setActiveTab('LIVE')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
            activeTab === 'LIVE'
              ? 'bg-blue-900 text-white shadow-md scale-100'
              : 'text-slate-700 hover:text-slate-950 hover:bg-slate-300/60'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Live Inventory SKUs ({inventoryList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('REPLENISHMENT')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
            activeTab === 'REPLENISHMENT'
              ? 'bg-blue-900 text-white shadow-md scale-100'
              : 'text-slate-700 hover:text-slate-950 hover:bg-slate-300/60'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Demand Replenishment Planner ({replenishmentPlannerList.length})</span>
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

          {/* Inventory Table & Mobile Cards */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Mobile Card View */}
            <div className="block sm:hidden p-3.5 space-y-3 bg-slate-50/50">
              {filteredInventory.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedSkuModal(item)}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3 active:scale-[0.99] transition cursor-pointer"
                >
                  <div className="flex justify-between items-center gap-2 border-b border-slate-100 pb-2.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSkuModal(item);
                      }}
                      className="font-extrabold font-mono text-blue-950 bg-blue-50/90 border border-blue-200/90 hover:bg-blue-900 hover:text-white px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-2xs group cursor-pointer whitespace-nowrap"
                    >
                      <Barcode className="w-4 h-4 text-blue-700 group-hover:text-blue-200 shrink-0" />
                      <span>{item.sku}</span>
                      <Eye className="w-3.5 h-3.5 text-blue-600 group-hover:text-white shrink-0 ml-0.5" />
                    </button>

                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-1 shrink-0">
                      <Building2 className="w-3.5 h-3.5 text-blue-700" />
                      {item.location}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-extrabold text-sm text-slate-900 leading-snug">{item.description}</h4>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 pt-0.5">
                      <span className="font-mono text-slate-600">Lot: {item.lotNumber}</span>
                      <span>&bull;</span>
                      <span className="text-amber-800 font-bold flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-amber-700" />
                        Exp: {item.expiryDate}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-black uppercase text-slate-500 block">On-Hand</span>
                      <span className="font-mono font-extrabold text-slate-900 text-sm">{item.onHand}</span>
                    </div>
                    <div className="bg-amber-50/60 p-2 rounded-xl border border-amber-200">
                      <span className="text-[10px] font-black uppercase text-amber-800 block">Reserved</span>
                      <span className="font-mono font-extrabold text-amber-700 text-sm">{item.reserved}</span>
                    </div>
                    <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                      <span className="text-[10px] font-black uppercase text-emerald-800 block">Available</span>
                      <span className="font-mono font-black text-emerald-800 text-base">{item.available}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
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
                          type="button"
                          onClick={() => setSelectedSkuModal(item)}
                          className="font-extrabold font-mono text-blue-950 bg-blue-50/90 border border-blue-200/90 hover:bg-blue-900 hover:text-white px-3 py-1.5 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-2xs group cursor-pointer whitespace-nowrap"
                          title="Click to inspect SKU barcode details & batch FEFO"
                        >
                          <Barcode className="w-4 h-4 text-blue-700 group-hover:text-blue-200 shrink-0" />
                          <span>{item.sku}</span>
                          <Eye className="w-3.5 h-3.5 text-blue-600 group-hover:text-white shrink-0 ml-0.5 opacity-80 group-hover:opacity-100" />
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
        <div className="space-y-5">
          <div className="p-4 sm:p-5 bg-amber-50 border border-amber-200/90 rounded-2xl text-xs sm:text-sm text-amber-950 font-semibold space-y-2 shadow-2xs">
            <p className="font-black flex items-center gap-2 text-sm sm:text-base text-amber-950 uppercase tracking-wider">
              <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0" />
              Demand-Driven Replenishment Rules (Blueprint Section 3)
            </p>
            <div className="text-amber-900 space-y-1 font-semibold leading-relaxed">
              <p>Replenishment is triggered by actual available stock, reservations, open customer demand, lead time, and critical levels:</p>
              <p>&bull; <strong>Class 1 (Core Stock)</strong>: Reorder automatically at critical level + 10% safety buffer.</p>
              <p>&bull; <strong>Class 2 (Controlled)</strong>: Requires demand forecast review prior to purchase order creation.</p>
              <p>&bull; <strong>Class 3 (Short-Expiry / Special)</strong>: Hard-blocked without linked Customer PO to prevent over-stocking.</p>
            </div>
          </div>

          {/* Replenishment Planner Table & Mobile Cards */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            {/* Mobile Card View for Replenishment */}
            <div className="block sm:hidden p-3.5 space-y-3 bg-slate-50/50">
              {replenishmentPlannerList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    const matched = inventoryList.find((i: any) => i.sku === item.sku) || {
                      id: item.id,
                      sku: item.sku,
                      description: item.description,
                      location: 'Quezon City',
                      lotNumber: 'LOT-2026-X1',
                      expiryDate: '2027-12-31',
                      onHand: item.availableStock,
                      reserved: 0,
                      available: item.availableStock,
                      criticalLevel: item.criticalLevel,
                      unit: 'Kits',
                    };
                    setSelectedSkuModal(matched);
                  }}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3 active:scale-[0.99] transition cursor-pointer"
                >
                  <div className="flex justify-between items-center gap-2 border-b border-slate-100 pb-2.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const matched = inventoryList.find((i: any) => i.sku === item.sku) || {
                          id: item.id,
                          sku: item.sku,
                          description: item.description,
                          location: 'Quezon City',
                          lotNumber: 'LOT-2026-X1',
                          expiryDate: '2027-12-31',
                          onHand: item.availableStock,
                          reserved: 0,
                          available: item.availableStock,
                          criticalLevel: item.criticalLevel,
                          unit: 'Kits',
                        };
                        setSelectedSkuModal(matched);
                      }}
                      className="font-extrabold font-mono text-blue-950 bg-blue-50/90 border border-blue-200/90 hover:bg-blue-900 hover:text-white px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-2xs group cursor-pointer whitespace-nowrap"
                    >
                      <Barcode className="w-4 h-4 text-blue-700 group-hover:text-blue-200 shrink-0" />
                      <span>{item.sku}</span>
                      <Eye className="w-3.5 h-3.5 text-blue-600 group-hover:text-white shrink-0 ml-0.5" />
                    </button>

                    <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-xs font-extrabold rounded-lg border border-slate-200">
                      {item.itemClass}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-extrabold text-sm text-slate-900 leading-snug">{item.description}</h4>
                    <p className="text-xs text-slate-500 font-semibold">{item.supplier} &bull; Lead: {item.leadTimeDays} days</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-black uppercase text-slate-500 block">Available</span>
                      <span className="font-mono font-extrabold text-slate-900 text-sm">{item.availableStock}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-black uppercase text-slate-500 block">Demand</span>
                      <span className="font-mono font-extrabold text-blue-700 text-sm">{item.openDemand}</span>
                    </div>
                    <div className="bg-amber-50/60 p-2 rounded-xl border border-amber-200">
                      <span className="text-[10px] font-black uppercase text-amber-800 block">Proposed Order</span>
                      <span className="font-mono font-black text-amber-900 text-sm">{item.proposedOrderQty}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
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
                    <tr key={item.id} className="hover:bg-blue-50/50 transition group">
                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => {
                            const matched = inventoryList.find((i: any) => i.sku === item.sku) || {
                              id: item.id,
                              sku: item.sku,
                              description: item.description,
                              location: 'Quezon City',
                              lotNumber: 'LOT-2026-X1',
                              expiryDate: '2027-12-31',
                              onHand: item.availableStock,
                              reserved: 0,
                              available: item.availableStock,
                              criticalLevel: item.criticalLevel,
                              unit: 'Kits',
                            };
                            setSelectedSkuModal(matched);
                          }}
                          className="font-extrabold font-mono text-blue-950 bg-blue-50/90 border border-blue-200/90 hover:bg-blue-900 hover:text-white px-3 py-1.5 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-2xs group cursor-pointer whitespace-nowrap"
                          title="Click to inspect SKU barcode details & batch FEFO"
                        >
                          <Barcode className="w-4 h-4 text-blue-700 group-hover:text-blue-200 shrink-0" />
                          <span>{item.sku}</span>
                          <Eye className="w-3.5 h-3.5 text-blue-600 group-hover:text-white shrink-0 ml-0.5 opacity-80 group-hover:opacity-100" />
                        </button>
                        <span className="inline-block mt-2 px-2.5 py-0.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200">
                          {item.itemClass}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="font-extrabold text-slate-900 text-sm sm:text-base">{item.description}</div>
                        <div className="text-xs text-slate-600 font-semibold mt-0.5">{item.supplier} &bull; Lead Time: <span className="font-bold text-slate-800">{item.leadTimeDays} days</span></div>
                      </td>
                      <td className="p-4 text-right font-mono font-black text-slate-900 text-sm sm:text-base">{item.availableStock}</td>
                      <td className="p-4 text-right font-mono font-black text-amber-700 text-sm sm:text-base">{item.openCustomerDemand}</td>
                      <td className="p-4 text-right font-mono font-black text-slate-700 text-sm sm:text-base">{item.criticalLevel}</td>
                      <td className="p-4 text-right font-mono font-black text-blue-900 text-base sm:text-lg">
                        {item.proposedOrderQty}
                      </td>
                      <td className="p-4">
                        {item.itemClass.includes('Class 3') && (
                          <div className="space-y-1">
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-extrabold rounded-xl inline-flex items-center gap-1.5 shadow-2xs">
                              <FileCheck className="w-4 h-4 text-emerald-700" />
                              Customer PO Linked
                            </span>
                            <p className="text-xs font-mono text-slate-600 font-bold">{item.linkedCustomerPO}</p>
                          </div>
                        )}
                        {item.itemClass.includes('Class 1') && (
                          <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 text-xs font-extrabold rounded-xl inline-flex items-center gap-1.5 shadow-2xs">
                            <AlertTriangle className="w-4 h-4 text-amber-700" />
                            Buffer +10% Applied
                          </span>
                        )}
                        {item.itemClass.includes('Class 2') && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-900 border border-blue-300 text-xs font-extrabold rounded-xl inline-flex items-center gap-1.5 shadow-2xs">
                            <Layers className="w-4 h-4 text-blue-700" />
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
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto text-slate-900 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 border border-slate-300 animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200 ease-out text-slate-900 text-sm">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-700 text-white rounded-2xl shadow-sm">
                  <Barcode className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black uppercase text-slate-900 tracking-wider">
                    SKU Details: {selectedSkuModal.sku}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">{selectedSkuModal.description}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSkuModal(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div className="p-4 bg-slate-100 rounded-2xl">
                <span className="text-xs text-slate-600 font-bold block uppercase tracking-wider">On-Hand Stock</span>
                <span className="font-mono font-black text-slate-900 text-xl">{selectedSkuModal.onHand}</span>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                <span className="text-xs text-amber-800 font-bold block uppercase tracking-wider">Reserved (3-Day)</span>
                <span className="font-mono font-black text-amber-900 text-xl">{selectedSkuModal.reserved}</span>
              </div>
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <span className="text-xs text-emerald-800 font-bold block uppercase tracking-wider">Available Stock</span>
                <span className="font-mono font-black text-emerald-900 text-xl">{selectedSkuModal.available}</span>
              </div>
            </div>

            {/* Batch & Location Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">Warehouse Location:</span>
                <span className="font-extrabold text-slate-900 text-base">{selectedSkuModal.location}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">Batch / Lot Number:</span>
                <span className="font-mono font-black text-blue-900 text-base">{selectedSkuModal.lotNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">FEFO Expiry Date:</span>
                <span className="font-extrabold text-amber-900 text-base">{selectedSkuModal.expiryDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">Unit Metric:</span>
                <span className="font-extrabold text-slate-800 text-base">{selectedSkuModal.unit || 'Kits'}</span>
              </div>
            </div>

            {/* Visual Barcode Tag Graphic */}
            <div className="p-4 bg-white border border-slate-300 rounded-2xl text-center space-y-2">
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest block">Scannable GS1 Barcode Preview</span>
              <div className="font-mono font-black text-2xl tracking-[0.3em] text-slate-900 select-all py-2">
                ||| | |||| | ||| |||| | | |||
              </div>
              <span className="font-mono text-xs text-slate-600 font-extrabold">*ACC-{selectedSkuModal.sku}*</span>
            </div>

            {/* Quick Actions */}
            <div className="pt-4 flex justify-between items-center border-t border-slate-200 gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedSkuModal(null);
                  onOpenAddStock();
                }}
                className="px-5 py-3 bg-blue-900 hover:bg-blue-800 text-white font-black text-xs sm:text-sm rounded-2xl transition flex items-center gap-2 shadow-md active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Stock Batch</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedSkuModal(null)}
                className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 font-extrabold text-xs sm:text-sm rounded-2xl transition cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
