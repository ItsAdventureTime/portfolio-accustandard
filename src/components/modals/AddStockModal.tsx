'use client';

import React, { useState } from 'react';
import { X, Package, Plus, Check, Calendar, MapPin, Building2 } from 'lucide-react';

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStockBatch: (newStockItem: any) => void;
}

export const AddStockModal: React.FC<AddStockModalProps> = ({
  isOpen,
  onClose,
  onAddStockBatch,
}) => {
  const [sku, setSku] = useState('ACC-REAG-08');
  const [description, setDescription] = useState('Blood Chemistry Control High 5x5mL');
  const [location, setLocation] = useState<'Quezon City' | 'Pampanga'>('Pampanga');
  const [lotNumber, setLotNumber] = useState('LOT-2026-E1');
  const [expiryDate, setExpiryDate] = useState('2027-10-31');
  const [onHand, setOnHand] = useState(100);
  const [unit, setUnit] = useState('Kits');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sku.trim() || !description.trim()) return;

    const formattedSku = sku.trim().toUpperCase();
    const qty = Number(onHand);

    const newStockItem = {
      id: `inv-${Date.now()}`,
      sku: formattedSku,
      description,
      location,
      lotNumber: lotNumber || 'LOT-2026-X1',
      expiryDate,
      onHand: qty,
      reserved: 0,
      available: qty,
      unit: unit || 'Kits',
      status: 'NORMAL',
    };

    onAddStockBatch(newStockItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 border border-slate-300 animate-in fade-in zoom-in duration-200 text-slate-900">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-900 text-white rounded-xl">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Add Stock Batch / Goods Receipt
              </h3>
              <p className="text-xs text-slate-500 font-medium">Log new inventory arrival for QC or Pampanga warehouse</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stock Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">SKU / Barcode Code *</label>
              <input
                type="text"
                placeholder="e.g. ACC-REAG-08"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Warehouse Location *</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="Quezon City">Quezon City Warehouse</option>
                <option value="Pampanga">Pampanga Warehouse</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Item Description *</label>
            <input
              type="text"
              placeholder="e.g. Blood Chemistry Control High 5x5mL"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Lot / Batch Number</label>
              <input
                type="text"
                placeholder="LOT-2026-E1"
                value={lotNumber}
                onChange={(e) => setLotNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">FEFO Expiry Date</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Batch Stock Quantity</label>
              <input
                type="number"
                min="1"
                value={onHand}
                onChange={(e) => setOnHand(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Unit of Measure</label>
              <input
                type="text"
                placeholder="Kits, Boxes, Bottles"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-3 flex justify-end gap-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-extrabold rounded-xl transition flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Stock Batch</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
