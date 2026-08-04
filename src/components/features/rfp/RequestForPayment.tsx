'use client';

import React from 'react';
import {
  CreditCard,
  Plus,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface RequestForPaymentProps {
  rfpList: any[];
  onOpenAddRFP: () => void;
}

export const RequestForPayment: React.FC<RequestForPaymentProps> = ({
  rfpList,
  onOpenAddRFP,
}) => {
  return (
    <div className="space-y-6 text-slate-900">
      {/* Module Title & Actions Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-purple-800" />
            Request for Payment (RFP) Non-PO Expense Vouchers
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
            GL Chart of Accounts Picklist &bull; Disbursement Approval Chain &bull; Bank Releasing
          </p>
        </div>

        <button
          onClick={onOpenAddRFP}
          className="px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-sm self-stretch sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create RFP Voucher</span>
        </button>
      </div>

      {/* Live RFP Vouchers Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-xs">
              <tr>
                <th className="p-4">RFP Voucher ID</th>
                <th className="p-4">Payee / Vendor</th>
                <th className="p-4">GL Account Description</th>
                <th className="p-4">Requested By</th>
                <th className="p-4 text-right">Amount</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-semibold text-slate-800">
              {rfpList.map((rfp) => (
                <tr key={rfp.id} className="hover:bg-slate-50 transition">
                  <td className="p-4 font-mono font-extrabold text-blue-900">{rfp.rfpNo}</td>
                  <td className="p-4 font-bold text-slate-900">{rfp.payee}</td>
                  <td className="p-4 text-xs font-semibold text-slate-700">{rfp.glAccount}</td>
                  <td className="p-4 text-xs font-semibold text-slate-700">{rfp.requestedBy}</td>
                  <td className="p-4 text-right font-mono font-extrabold text-slate-900">
                    ₱{rfp.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-300 font-extrabold text-xs shadow-2xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Approved (DCS)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
