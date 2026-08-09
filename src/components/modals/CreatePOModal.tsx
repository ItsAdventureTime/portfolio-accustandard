'use client';

import React, { useState } from 'react';
import { X, Building2, Send, AlertTriangle, ShieldAlert } from 'lucide-react';

interface CreatePOModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventoryList: any[];
  onSubmitPO: (newPO: any) => void;
  existingPOs?: any[];
}

export const CreatePOModal: React.FC<CreatePOModalProps> = ({
  isOpen,
  onClose,
  inventoryList,
  onSubmitPO,
  existingPOs = [],
}) => {
  const [vendorName, setVendorName] = useState('BioMerieux Diagnostics Corp');
  const [selectedSku, setSelectedSku] = useState(inventoryList[0]?.sku || 'ACC-BACT-01');
  const [poQty, setPoQty] = useState(100);
  const [unitPrice, setUnitPrice] = useState(1420);
  const [linkedCustomerPO, setLinkedCustomerPO] = useState('');
  const [class3Error, setClass3Error] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedItem = inventoryList.find((i) => i.sku === selectedSku) || inventoryList[0];
  const isClass3 = selectedItem?.itemClass?.includes('Class 3') || selectedSku === 'ACC-SPEC-99';

  // Check for open PO overlap
  const openPOOverlap = existingPOs.find(
    (p) => p.vendorName?.toLowerCase() === vendorName.toLowerCase() && p.sku === selectedSku && p.status !== 'VERIFIED_3WAY'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorName.trim()) return;

    if (isClass3 && !linkedCustomerPO.trim()) {
      setClass3Error('COSO Fraud Control Block: Class 3 (Short-Expiry / Special) items require an approved linked Customer PO before generating a supplier PO.');
      return;
    }

    setClass3Error(null);
    const poNum = `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPO = {
      id: `po-${Date.now()}`,
      poNumber: poNum,
      vendorName,
      itemDescription: selectedItem?.description || 'Medical Supply Kit',
      sku: selectedSku,
      poQty,
      rrQtyReceived: 0,
      invoiceRef: 'Awaiting Receipt',
      totalAmount: poQty * unitPrice,
      linkedCustomerPO: isClass3 ? linkedCustomerPO : 'N/A',
      status: 'PENDING_RECEIVING',
    };

    onSubmitPO(newPO);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 border border-slate-300 animate-in fade-in zoom-in duration-200 text-slate-900">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-700 text-white rounded-xl">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Create Purchase Order (PO)
              </h3>
              <p className="text-xs text-slate-500 font-medium">Select Registered Item SKU &amp; Set Order Quantity</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {class3Error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-bold flex items-start gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <span>{class3Error}</span>
          </div>
        )}

        {openPOOverlap && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-bold flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <span>Warning: An open PO ({openPOOverlap.poNumber}) already exists for vendor &quot;{vendorName}&quot; and SKU {selectedSku}.</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Supplier / Vendor Name *</label>
            <input
              type="text"
              placeholder="e.g. BioMerieux Diagnostics Corp"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Registered Inventory Item Dropdown Picklist */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Select Registered Inventory Item (Dropdown Picklist) *
            </label>
            <select
              value={selectedSku}
              onChange={(e) => {
                setSelectedSku(e.target.value);
                setClass3Error(null);
              }}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            >
              {inventoryList.map((item) => (
                <option key={item.id} value={item.sku}>
                  {item.sku} — {item.description} ({item.location}) {item.itemClass ? `[${item.itemClass}]` : ''}
                </option>
              ))}
            </select>
          </div>

          {isClass3 && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1.5">
              <label className="font-extrabold text-blue-900 block">
                Linked Customer PO / Contract Number * (Mandatory for Class 3)
              </label>
              <input
                type="text"
                placeholder="e.g. CUST-PO-2026-88"
                value={linkedCustomerPO}
                onChange={(e) => setLinkedCustomerPO(e.target.value)}
                className="w-full bg-white border border-blue-300 text-slate-900 font-bold rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600"
                required
              />
              <p className="text-[11px] text-blue-700 font-medium">Class 3 short-expiry items cannot generate a supplier PO without a confirmed customer PO.</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">PO Order Quantity</label>
              <input
                type="number"
                min="1"
                value={poQty}
                onChange={(e) => setPoQty(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Unit Cost (₱)</label>
              <input
                type="number"
                value={unitPrice}
                onChange={(e) => setUnitPrice(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-100 rounded-xl flex justify-between items-center font-bold">
            <span className="text-slate-700">Total Purchase Order Value:</span>
            <span className="font-mono text-base text-blue-900">₱{(poQty * unitPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-extrabold rounded-xl transition flex items-center gap-1.5 shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>Route PO for Approval</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

