'use client';

import React, { useState } from 'react';
import { X, CreditCard, Send, Plus } from 'lucide-react';

interface CreateRFPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitRFP: (newRFP: any) => void;
}

export const CreateRFPModal: React.FC<CreateRFPModalProps> = ({
  isOpen,
  onClose,
  onSubmitRFP,
}) => {
  const [payee, setPayee] = useState('LBC Express Courier Services');
  const [glAccount, setGlAccount] = useState('6100 - Freight & Delivery');
  const [description, setDescription] = useState('Cold-chain express shipping for Pampanga hospital orders');
  const [amount, setAmount] = useState(18500.0);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payee.trim() || !description.trim()) return;

    const rfpNum = `RFP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRFP = {
      id: `rfp-${Date.now()}`,
      rfpNo: rfpNum,
      payee,
      glAccount,
      description,
      amount: Number(amount),
      requestedBy: 'Bookkeeper (Aila)',
      status: 'APPROVED_DCS',
    };

    onSubmitRFP(newRFP);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 text-slate-900">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 border border-slate-300 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-900 text-white rounded-xl">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Create Request for Payment (RFP Voucher)
              </h3>
              <p className="text-xs text-slate-500 font-medium">Non-PO Expense Disbursement Request</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Payee / Vendor Name *</label>
            <input
              type="text"
              placeholder="e.g. LBC Express Courier Services"
              value={payee}
              onChange={(e) => setPayee(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-700"
              required
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">GL Chart of Accounts *</label>
            <select
              value={glAccount}
              onChange={(e) => setGlAccount(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-700"
            >
              <option value="6100 - Freight & Delivery">6100 - Freight &amp; Delivery</option>
              <option value="6200 - Utilities Expense">6200 - Utilities Expense</option>
              <option value="6300 - Professional & Calibration Fees">6300 - Professional &amp; Calibration Fees</option>
              <option value="6400 - Office Supplies">6400 - Office Supplies</option>
              <option value="6500 - Maintenance & Repairs">6500 - Maintenance &amp; Repairs</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Disbursement Purpose / Description *</label>
            <textarea
              rows={2}
              placeholder="Detail the expense purpose..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-medium rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-700"
              required
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Total Payment Amount (₱) *</label>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-700"
              required
            />
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
              className="px-4 py-2.5 bg-purple-900 hover:bg-purple-800 text-white font-extrabold rounded-xl transition flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Route RFP for Approval</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
