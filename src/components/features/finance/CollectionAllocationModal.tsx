'use client';

import React, { useState } from 'react';
import { X, CreditCard, CheckCircle2, ShieldCheck, DollarSign, Layers } from 'lucide-react';

interface CollectionAllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectionData?: any;
  onConfirmAllocation?: (allocationData: any) => void;
}

export const CollectionAllocationModal: React.FC<CollectionAllocationModalProps> = ({
  isOpen,
  onClose,
  collectionData = {},
  onConfirmAllocation,
}) => {
  const paymentAmount = collectionData.amount || 25000.0;
  const checkNo = collectionData.checkNo || 'CHK-BDO-99201';
  const clientName = collectionData.clientName || 'Allied Care Experts (ACE) Medical Center';

  // Invoices eligible for allocation
  const [allocations, setAllocations] = useState([
    { id: 'soa-1', salesInvoiceNo: 'SI-6087', invoiceAmount: 16960.0, allocatedAmount: 16960.0, remainingBalance: 0.0 },
    { id: 'soa-2', salesInvoiceNo: 'SI-6107', invoiceAmount: 1968.0, allocatedAmount: 1968.0, remainingBalance: 0.0 },
    { id: 'soa-3', salesInvoiceNo: 'SI-6118', invoiceAmount: 13280.0, allocatedAmount: 6072.0, remainingBalance: 7208.0 },
  ]);

  if (!isOpen) return null;

  const totalAllocated = allocations.reduce((sum, item) => sum + item.allocatedAmount, 0);
  const unallocatedAmount = paymentAmount - totalAllocated;

  const handleAmountChange = (index: number, newAllocated: number) => {
    const updated = [...allocations];
    const item = updated[index];
    item.allocatedAmount = Math.min(newAllocated, item.invoiceAmount);
    item.remainingBalance = item.invoiceAmount - item.allocatedAmount;
    setAllocations(updated);
  };

  const handleSave = () => {
    if (onConfirmAllocation) {
      onConfirmAllocation({
        checkNo,
        paymentAmount,
        totalAllocated,
        unallocatedAmount,
        allocations,
      });
    }
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Collection Payment Allocation Modal"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-300 my-auto text-slate-900 overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200 ease-out flex flex-col">
        {/* Header Block Matching Screenshot 2 Design System */}
        <div className="p-6 sm:p-7 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0 bg-white">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-900 text-white rounded-2xl shrink-0 shadow-md">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-slate-900">
                MULTI-INVOICE COLLECTION ALLOCATION (FR-020)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">
                Check Ref: <strong className="text-slate-900">{checkNo}</strong> &bull; Client: <strong className="text-slate-900">{clientName}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Allocation Modal"
            className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-5 text-xs sm:text-sm flex-1">
          {/* Payment Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Payment Received</span>
              <span className="font-mono font-black text-slate-900 text-lg">₱{paymentAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Allocated Across Invoices</span>
              <span className="font-mono font-black text-blue-900 text-lg">₱{totalAllocated.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Unallocated Balance</span>
              <span className={`font-mono font-black text-lg ${unallocatedAmount === 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                ₱{unallocatedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Invoice Allocation Table */}
          <div className="space-y-2">
            <h3 className="font-extrabold text-xs uppercase text-slate-700 tracking-wider">
              Allocate Payment Across Open Client Invoices:
            </h3>
            <div className="overflow-x-auto border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse font-semibold">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Sales Invoice No</th>
                    <th className="p-3 text-right">Invoice Total</th>
                    <th className="p-3 text-right">Allocated Payment (PHP)</th>
                    <th className="p-3 text-right">Remaining Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {allocations.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-blue-50/40">
                      <td className="p-3 font-mono font-bold text-slate-900">{item.salesInvoiceNo}</td>
                      <td className="p-3 text-right font-mono text-slate-700">₱{item.invoiceAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td className="p-3 text-right">
                        <input
                          type="number"
                          value={item.allocatedAmount}
                          onChange={(e) => handleAmountChange(idx, Number(e.target.value))}
                          className="w-28 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 font-mono font-bold text-right text-blue-950 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        />
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-slate-800">
                        {item.remainingBalance === 0 ? (
                          <span className="text-emerald-700 font-extrabold">₱0.00 (PAID)</span>
                        ) : (
                          `₱${item.remainingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Actions Matching Screenshot 2 Design System */}
          <div className="pt-4 border-t border-slate-200 flex justify-between items-center shrink-0">
            <span className="text-xs font-semibold text-slate-500">
              Rule FR-020: Partial allocations preserve exact remaining invoice balances on SOA.
            </span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold rounded-2xl transition text-xs sm:text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-2.5 bg-blue-900 hover:bg-blue-950 text-white font-extrabold rounded-2xl transition text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Post Payment Allocations &amp; Update Client SOA</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
