'use client';

import React, { useState } from 'react';
import { X, FileText, Send, Lock } from 'lucide-react';

interface CreateQuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventoryList: any[];
  onSubmitQuotation: (newQuote: any) => void;
}

export const CreateQuotationModal: React.FC<CreateQuotationModalProps> = ({
  isOpen,
  onClose,
  inventoryList,
  onSubmitQuotation,
}) => {
  const [clientName, setClientName] = useState('');
  const [facilityName, setFacilityName] = useState('');
  const [address, setAddress] = useState('');
  const [selectedSku, setSelectedSku] = useState(inventoryList[0]?.sku || 'ACC-BACT-01');
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(31500);

  if (!isOpen) return null;

  const selectedItem = inventoryList.find((i) => i.sku === selectedSku) || inventoryList[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !facilityName.trim()) return;

    const qrnCode = `QRN${Date.now().toString().slice(-8)}`;
    const newQuote = {
      id: `quote-${Date.now()}`,
      qrn: qrnCode,
      type: 'Sales Quotation',
      maker: 'Sales Officer',
      reviewerStatus: 'PENDING',
      gmStatus: 'PENDING',
      dcsStatus: 'PENDING',
      totalAmount: quantity * unitPrice,
      totalPrice: quantity * unitPrice,
      clientName,
      clientFacility: facilityName,
      facilityName,
      clientAddress: address || 'Baliuag, Bulacan',
      address: address || 'Baliuag, Bulacan',
      itemDescription: selectedItem?.description || 'Calibration Sticks Bact Alert',
      sku: selectedSku,
      packaging: `${quantity} Box of ${selectedItem?.onHand || 40}`,
      unitPrice,
      quantity,
      quotationDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      items: [
        {
          id: `item-${Date.now()}`,
          description: selectedItem?.description || 'Calibration Sticks Bact Alert',
          packaging: `${quantity} Box of ${selectedItem?.onHand || 40}`,
          unitPrice,
        },
      ],
    };

    onSubmitQuotation(newQuote);
    setClientName('');
    setFacilityName('');
    setAddress('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto text-slate-900 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 border border-slate-300 animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200 ease-out text-slate-900 text-sm">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-600 text-white rounded-2xl shadow-sm">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-slate-900">
                Create &amp; Submit Sales Quotation
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">Routes to Marketing (Reviewer) &rarr; GM &rarr; Awaiting Client Approval (AT-SALES-005 compliant)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 3-Day Reservation Notice */}
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-amber-950 text-xs sm:text-sm flex items-center gap-3 font-semibold">
          <Lock className="w-5 h-5 text-amber-600 shrink-0" />
          <span>Creating this quote will automatically trigger a 3-day stock reservation for the selected item in the warehouse.</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-sm font-semibold">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">Client Contact Name *</label>
              <input
                type="text"
                placeholder="e.g. Ms. Katherine Porciuncula"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-blue-600"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">Medical Facility / Hospital Name *</label>
              <input
                type="text"
                placeholder="e.g. Allied Care Experts Medical Center"
                value={facilityName}
                onChange={(e) => setFacilityName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-blue-600"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">Facility Delivery Address</label>
            <input
              type="text"
              placeholder="e.g. Baliuag, Bulacan"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Registered Inventory Dropdown Select */}
          <div>
            <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">Select Registered Inventory Item *</label>
            <select
              value={selectedSku}
              onChange={(e) => setSelectedSku(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-black rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-blue-600 cursor-pointer"
            >
              {inventoryList.map((item) => (
                <option key={item.id} value={item.sku}>
                  {item.sku} — {item.description} ({item.onHand - item.reserved} available at {item.location})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">Order Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-black rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">Unit Price (₱)</label>
              <input
                type="number"
                value={unitPrice}
                onChange={(e) => setUnitPrice(Math.max(0, Number(e.target.value)))}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-mono font-black rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* Total Value Card */}
          <div className="p-4 sm:p-5 bg-slate-900 text-white rounded-2xl flex justify-between items-center font-bold shadow-md">
            <span className="text-slate-300 text-xs sm:text-sm uppercase tracking-wider">Total Sales Quotation Value:</span>
            <span className="font-mono text-xl sm:text-2xl font-black text-emerald-400">₱{(quantity * unitPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>

          {/* Actions */}
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
              <Send className="w-4 h-4 text-blue-200" />
              <span>Submit Sales Quote for Approval</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
