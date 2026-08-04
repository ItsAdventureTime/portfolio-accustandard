'use client';

import React, { useState } from 'react';
import { X, FileText, Send, Lock, Plus } from 'lucide-react';

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
      clientName,
      facilityName,
      address,
      itemDescription: selectedItem?.description || 'Medical Reagent Kit',
      sku: selectedSku,
      packaging: `${quantity} ${selectedItem?.unit || 'Kits'}`,
      unitPrice,
    };

    onSubmitQuotation(newQuote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 border border-slate-300 animate-in fade-in zoom-in duration-200 text-slate-900">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-600 text-white rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Create &amp; Submit Sales Quotation
              </h3>
              <p className="text-xs text-slate-500 font-medium">Routes to Marketing (Reviewer) &rarr; GM &rarr; DCS for Approval</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3-Day Reservation Notice */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 text-xs flex items-center gap-2 font-medium">
          <Lock className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Creating this quote will automatically trigger a 3-day stock reservation for the selected item.</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Client Contact Name *</label>
            <input
              type="text"
              placeholder="e.g. Ms. Katherine Porciuncula"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-medium rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Medical Facility / Hospital Name *</label>
            <input
              type="text"
              placeholder="e.g. Allied Care Experts Medical Center"
              value={facilityName}
              onChange={(e) => setFacilityName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Facility Address</label>
            <input
              type="text"
              placeholder="e.g. Baliuag, Bulacan"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-medium rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Registered Inventory Dropdown Select */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Select Registered Inventory Item *</label>
            <select
              value={selectedSku}
              onChange={(e) => setSelectedSku(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            >
              {inventoryList.map((item) => (
                <option key={item.id} value={item.sku}>
                  {item.sku} — {item.description} ({item.onHand - item.reserved} available at {item.location})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Unit Price (₱)</label>
              <input
                type="number"
                value={unitPrice}
                onChange={(e) => setUnitPrice(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-100 rounded-xl flex justify-between items-center font-bold">
            <span className="text-slate-700">Total Quotation Value:</span>
            <span className="font-mono text-base text-blue-900">₱{(quantity * unitPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
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
              <span>Submit Sales Quote for Approval</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
