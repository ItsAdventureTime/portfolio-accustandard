'use client';

import React from 'react';
import {
  CreditCard,
  Plus,
  CheckCircle2,
  Clock,
  DollarSign,
  Building,
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
    <div className="space-y-6">
      {/* Module Title & Actions Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-rose-600" />
            Request for Payment (RFP) &amp; Non-PO Expenses
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Expense Vouchers &bull; Maintained Chart of Accounts (GL Picklist) &bull; Bank Fund Releasing
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            onClick={onOpenAddRFP}
            className="flex-1 sm:flex-initial px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Expense RFP</span>
          </button>
        </div>
      </div>

      {/* RFP Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider">
            Non-PO Expense Payment Vouchers &amp; Approvals
          </h3>
          <span className="text-xs font-mono font-bold text-slate-500">{rfpList.length} Payment Requests</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3">RFP Number</th>
                <th className="p-3">Payee Name</th>
                <th className="p-3">GL Account Code</th>
                <th className="p-3">Expense Purpose</th>
                <th className="p-3 text-right">Voucher Amount</th>
                <th className="p-3 text-center">Approval State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
              {rfpList.map((rfp) => (
                <tr key={rfp.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-3 font-mono font-bold text-blue-900 whitespace-nowrap">{rfp.rfpNumber}</td>
                  <td className="p-3 font-semibold whitespace-nowrap">{rfp.payeeName}</td>
                  <td className="p-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-mono font-bold text-slate-800 text-[10px]">
                      {rfp.glAccount}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600">{rfp.description}</td>
                  <td className="p-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                    ₱{rfp.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3 text-center whitespace-nowrap">
                    {rfp.status === 'APPROVED_DCS' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Released / Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
                        <Clock className="w-3 h-3 text-amber-600" /> Pending Approval
                      </span>
                    )}
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
