'use client';

import React, { useState } from 'react';
import { X, Package, Plus, Check, Calendar, MapPin, Building2 } from 'lucide-react';
import { AccessibleModal } from '@/components/common/AccessibleModal';

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
    <AccessibleModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add stock batch or goods receipt"
      description="Log a new inventory arrival for quality control or the Pampanga warehouse."
      size="lg"
      contentClassName="text-slate-900"
    >
      <div className="modal-panel p-6 space-y-6 text-sm font-semibold sm:p-8">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-900 text-white rounded-2xl shadow-sm">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-slate-900">
                Add Stock Batch / Goods Receipt
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">Log new inventory arrival for QC or Pampanga warehouse</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close add stock batch" title="Close" className="modal-close cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Stock Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-sm font-semibold">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">SKU / Barcode Code *</label>
              <input
                type="text"
                placeholder="e.g. ACC-REAG-08"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-mono font-black rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-blue-700"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">Warehouse Location *</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-black rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-blue-700 cursor-pointer"
              >
                <option value="Quezon City">Quezon City Warehouse</option>
                <option value="Pampanga">Pampanga Warehouse</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">Item Description *</label>
            <input
              type="text"
              placeholder="e.g. Blood Chemistry Control High 5x5mL"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-extrabold rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-blue-700"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">Lot / Batch Number</label>
              <input
                type="text"
                placeholder="LOT-2026-E1"
                value={lotNumber}
                onChange={(e) => setLotNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-mono font-black rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-blue-700"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">FEFO Expiry Date</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-black rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-blue-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">Batch Stock Quantity</label>
              <input
                type="number"
                min="1"
                value={onHand}
                onChange={(e) => setOnHand(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-black rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-blue-700"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">Unit of Measure</label>
              <input
                type="text"
                placeholder="Kits, Boxes, Bottles"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-blue-700"
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 flex justify-between items-center border-t border-slate-200 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 font-extrabold text-xs sm:text-sm rounded-2xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white font-black text-xs sm:text-sm rounded-2xl transition flex items-center gap-2 shadow-md active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Stock Batch</span>
            </button>
          </div>
        </form>
      </div>
    </AccessibleModal>
  );
};
