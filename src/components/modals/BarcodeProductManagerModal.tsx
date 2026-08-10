'use client';

import React, { useState } from 'react';
import { X, Plus, Edit, Trash2, Package, Check, Barcode, MapPin, Tag } from 'lucide-react';

export interface ProductSKU {
  id: string;
  sku: string;
  description: string;
  location: 'Quezon City' | 'Pampanga';
  lotNumber: string;
  expiryDate: string;
  onHand: number;
  reserved: number;
  unit: string;
  status: 'NORMAL' | 'NEAR_EXPIRY' | 'LOW_STOCK';
}

interface BarcodeProductManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductSKU[];
  onAddProduct: (newProduct: ProductSKU) => void;
  onUpdateProduct: (updatedProduct: ProductSKU) => void;
  onDeleteProduct: (productId: string) => void;
}

export const BarcodeProductManagerModal: React.FC<BarcodeProductManagerModalProps> = ({
  isOpen,
  onClose,
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form State
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<'Quezon City' | 'Pampanga'>('Quezon City');
  const [lotNumber, setLotNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('2027-12-31');
  const [onHand, setOnHand] = useState(50);
  const [unit, setUnit] = useState('Kits');

  if (!isOpen) return null;

  const resetForm = () => {
    setSku('');
    setDescription('');
    setLocation('Quezon City');
    setLotNumber('');
    setExpiryDate('2027-12-31');
    setOnHand(50);
    setUnit('Kits');
    setEditingId(null);
    setIsAddingNew(false);
  };

  const handleStartEdit = (p: ProductSKU) => {
    setEditingId(p.id);
    setSku(p.sku);
    setDescription(p.description);
    setLocation(p.location);
    setLotNumber(p.lotNumber);
    setExpiryDate(p.expiryDate);
    setOnHand(p.onHand);
    setUnit(p.unit);
    setIsAddingNew(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sku.trim() || !description.trim()) return;

    const formattedSku = sku.trim().toUpperCase();

    if (editingId) {
      const updated: ProductSKU = {
        id: editingId,
        sku: formattedSku,
        description,
        location,
        lotNumber: lotNumber || 'LOT-2026-X1',
        expiryDate,
        onHand: Number(onHand),
        reserved: 0,
        unit,
        status: onHand < 10 ? 'LOW_STOCK' : 'NORMAL',
      };
      onUpdateProduct(updated);
    } else {
      const newProd: ProductSKU = {
        id: `inv-${Date.now()}`,
        sku: formattedSku,
        description,
        location,
        lotNumber: lotNumber || 'LOT-2026-X1',
        expiryDate,
        onHand: Number(onHand),
        reserved: 0,
        unit,
        status: onHand < 10 ? 'LOW_STOCK' : 'NORMAL',
      };
      onAddProduct(newProd);
    }
    resetForm();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto text-slate-900">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-6 sm:p-8 space-y-6 border border-slate-300 animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col text-sm">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-900 text-white rounded-2xl shadow-sm">
              <Barcode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-slate-900">
                Barcode &amp; Product SKU Manager
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">Add, revise, or delete barcode products for scanner lookup</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Add/Edit Product Form */}
        {(isAddingNew || editingId) ? (
          <form onSubmit={handleSave} className="bg-blue-50/50 p-5 rounded-2xl border border-blue-200 space-y-4 shrink-0 font-semibold">
            <div className="flex justify-between items-center pb-3 border-b border-blue-200">
              <span className="text-xs font-black uppercase tracking-wider text-blue-950">
                {editingId ? 'Revise Existing Product SKU' : 'Add New Barcode Product SKU'}
              </span>
              <button type="button" onClick={resetForm} className="text-xs text-slate-600 hover:text-slate-900 font-black cursor-pointer">
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-semibold">
              <div>
                <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">SKU / Barcode Code *</label>
                <input
                  type="text"
                  placeholder="e.g. ACC-REAG-05"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 font-mono font-black rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">Warehouse Location</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 text-slate-900 font-black rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-blue-600 cursor-pointer"
                >
                  <option value="Quezon City">Quezon City Warehouse</option>
                  <option value="Pampanga">Pampanga Warehouse</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">Item Description *</label>
                <input
                  type="text"
                  placeholder="e.g. Hematology Reagent Clean Pack 20L"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 font-extrabold rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">Batch / Lot Number</label>
                <input
                  type="text"
                  placeholder="LOT-2026-X1"
                  value={lotNumber}
                  onChange={(e) => setLotNumber(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 font-mono font-black rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">Expiry Date</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 font-black rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">On Hand Quantity</label>
                <input
                  type="number"
                  value={onHand}
                  onChange={(e) => setOnHand(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 text-slate-900 font-black rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-blue-600"
                  min="0"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">Unit of Measure</label>
                <input
                  type="text"
                  placeholder="Kits, Boxes, Packs"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 font-bold rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-3 border-t border-blue-200">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white font-black text-xs sm:text-sm rounded-2xl transition flex items-center gap-2 shadow-md active:scale-95 cursor-pointer"
              >
                <Check className="w-4 h-4 text-blue-200" />
                <span>{editingId ? 'Save Product Changes' : 'Add Barcode Product'}</span>
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAddingNew(true)}
            className="w-full py-3.5 px-5 bg-blue-50 hover:bg-blue-900 border border-blue-300 text-blue-950 hover:text-white font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-xs shrink-0 cursor-pointer group"
          >
            <Plus className="w-5 h-5 text-blue-700 group-hover:text-white transition-colors" />
            <span>+ Add New Product SKU for Barcode Scanner</span>
          </button>
        )}

        {/* Product List Table */}
        <div className="flex-1 overflow-y-auto border border-slate-200 rounded-2xl shadow-xs">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-100 sticky top-0 text-slate-700 font-bold border-b border-slate-200 uppercase text-xs">
              <tr>
                <th className="p-3.5">SKU / Barcode</th>
                <th className="p-3.5">Description</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5 text-right">Stock</th>
                <th className="p-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-semibold text-slate-800">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-blue-50/50 transition">
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="font-extrabold font-mono text-blue-950 bg-blue-50/90 border border-blue-200/90 px-3 py-1.5 rounded-xl text-xs sm:text-sm inline-flex items-center gap-1.5 shadow-2xs">
                      <Barcode className="w-4 h-4 text-blue-700 shrink-0" />
                      <span>{p.sku}</span>
                    </span>
                  </td>
                  <td className="p-3.5 font-bold text-slate-900">{p.description}</td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-xl text-xs font-black ${p.location === 'Quezon City' ? 'bg-blue-100 text-blue-900 border border-blue-200' : 'bg-purple-100 text-purple-900 border border-purple-200'}`}>
                      {p.location}
                    </span>
                  </td>
                  <td className="p-3.5 text-right font-mono font-black text-slate-900 whitespace-nowrap">{p.onHand} {p.unit}</td>
                  <td className="p-3.5 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleStartEdit(p)}
                        className="p-2 text-blue-700 hover:bg-blue-100 rounded-xl transition border border-blue-200 cursor-pointer"
                        title="Edit / Revise SKU"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteProduct(p.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-xl transition border border-red-200 cursor-pointer"
                        title="Delete SKU"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="pt-4 flex justify-between items-center text-xs sm:text-sm text-slate-600 font-bold border-t border-slate-200 shrink-0">
          <span className="font-mono text-slate-800">{products.length} Active Barcode SKUs Registered</span>
          <button onClick={onClose} className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm rounded-2xl transition cursor-pointer">
            Close Manager
          </button>
        </div>
      </div>
    </div>
  );
};
