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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-5 sm:p-6 space-y-4 border border-slate-300 animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col text-slate-900">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 text-white rounded-xl">
              <Barcode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Barcode & Product SKU Manager
              </h3>
              <p className="text-xs text-slate-500 font-medium">Add, revise, or delete barcode products for scanner lookup</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add/Edit Product Form */}
        {(isAddingNew || editingId) ? (
          <form onSubmit={handleSave} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 shrink-0">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-xs font-extrabold uppercase text-blue-900">
                {editingId ? 'Revise Existing Product SKU' : 'Add New Barcode Product SKU'}
              </span>
              <button type="button" onClick={resetForm} className="text-xs text-slate-500 hover:text-slate-800 font-bold">
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">SKU / Barcode Code *</label>
                <input
                  type="text"
                  placeholder="e.g. ACC-REAG-05"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 font-mono font-bold rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Warehouse Location</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 text-slate-900 font-bold rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="Quezon City">Quezon City</option>
                  <option value="Pampanga">Pampanga</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Item Description *</label>
                <input
                  type="text"
                  placeholder="e.g. Hematology Reagent Clean Pack 20L"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 font-medium rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Batch / Lot Number</label>
                <input
                  type="text"
                  placeholder="LOT-2026-X1"
                  value={lotNumber}
                  onChange={(e) => setLotNumber(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 font-mono rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 font-medium rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">On Hand Quantity</label>
                <input
                  type="number"
                  value={onHand}
                  onChange={(e) => setOnHand(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 text-slate-900 font-bold rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  min="0"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Unit of Measure</label>
                <input
                  type="text"
                  placeholder="Kits, Boxes, Packs"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 font-medium rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="submit"
                className="btn-primary-blue text-xs px-4 py-2 font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Check className="w-4 h-4" />
                <span>{editingId ? 'Save Product Changes' : 'Add Barcode Product'}</span>
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAddingNew(true)}
            className="w-full py-2.5 px-4 bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-900 font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 transition shrink-0"
          >
            <Plus className="w-4 h-4 text-blue-700" />
            <span>Add New Product SKU for Barcode Scanner</span>
          </button>
        )}

        {/* Product List Table */}
        <div className="flex-1 overflow-y-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 sticky top-0 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-2.5">SKU / Barcode</th>
                <th className="p-2.5">Description</th>
                <th className="p-2.5">Location</th>
                <th className="p-2.5 text-right">Stock</th>
                <th className="p-2.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition">
                  <td className="p-2.5 font-mono font-bold text-blue-700 whitespace-nowrap">{p.sku}</td>
                  <td className="p-2.5">{p.description}</td>
                  <td className="p-2.5 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.location === 'Quezon City' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                      {p.location}
                    </span>
                  </td>
                  <td className="p-2.5 text-right font-bold whitespace-nowrap">{p.onHand} {p.unit}</td>
                  <td className="p-2.5 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleStartEdit(p)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                        title="Edit / Revise SKU"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteProduct(p.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition"
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
        <div className="pt-2 flex justify-between items-center text-xs text-slate-500 border-t border-slate-100 shrink-0">
          <span className="font-mono">{products.length} Active Barcode SKUs Registered</span>
          <button onClick={onClose} className="px-4 py-1.5 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
