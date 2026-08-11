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
      attachmentUrl: `${payee.replace(/\s+/g, '_')}_Voucher_Attachment.pdf`,
      disbursementProof: null,
      status: 'PENDING_GM',
      ownerRole: 'General Manager',
    };

    onSubmitRFP(newRFP);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto text-slate-900 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 border border-slate-300 animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200 ease-out text-sm font-semibold">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-900 text-white rounded-2xl shadow-sm">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-slate-900">
                Create Request for Payment (RFP Voucher)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">Non-PO Expense Disbursement Request</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-sm font-semibold">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">Payee / Vendor Name *</label>
              <input
                type="text"
                placeholder="e.g. LBC Express Courier Services"
                value={payee}
                onChange={(e) => setPayee(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-extrabold rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-blue-700"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">GL Chart of Accounts *</label>
              <select
                value={glAccount}
                onChange={(e) => setGlAccount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-black rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-blue-700 cursor-pointer"
              >
                <option value="6100 - Freight & Delivery">6100 - Freight &amp; Delivery</option>
                <option value="6200 - Utilities Expense">6200 - Utilities Expense</option>
                <option value="6300 - Professional & Calibration Fees">6300 - Professional &amp; Calibration Fees</option>
                <option value="6400 - Office Supplies">6400 - Office Supplies</option>
                <option value="6500 - Maintenance & Repairs">6500 - Maintenance & Repairs</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">Disbursement Purpose / Description *</label>
            <textarea
              rows={2}
              placeholder="Detail the expense purpose..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-blue-700"
              required
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">Total Voucher Amount (₱) *</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 text-purple-950 font-mono font-black text-lg sm:text-xl rounded-xl px-4 py-3 focus:outline-none focus:border-blue-700"
              required
            />
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
              className="px-6 py-3 bg-purple-900 hover:bg-purple-800 text-white font-black text-xs sm:text-sm rounded-2xl transition flex items-center gap-2 shadow-md active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4 text-purple-200" />
              <span>Submit RFP Expense Voucher</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
