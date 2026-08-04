'use client';

import React from 'react';
import {
  Building2,
  Plus,
  ShieldAlert,
  CheckCircle2,
  Clock,
  PackageCheck,
  Package,
} from 'lucide-react';

interface PurchasingReceivingProps {
  poList: any[];
  onOpenAddPO: () => void;
  onOpenReceivingModal: () => void;
}

export const PurchasingReceiving: React.FC<PurchasingReceivingProps> = ({
  poList,
  onOpenAddPO,
  onOpenReceivingModal,
}) => {
  return (
    <div className="space-y-6 text-slate-900">
      {/* Module Title & Actions Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-800" />
            Purchasing &amp; Receiving Control (3-Way Match &amp; Fraud Prevention)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
            Strict Over-Receiving Prevention &bull; Warehouse Receiving Report (RR) Entry Access
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto flex-wrap">
          <button
            onClick={onOpenReceivingModal}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
          >
            <PackageCheck className="w-4 h-4" />
            <span>Enter Receiving Report (RR)</span>
          </button>

          <button
            onClick={onOpenAddPO}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Purchase Order (PO)</span>
          </button>
        </div>
      </div>

      {/* 3-Way Match Fraud Control Banner */}
      <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-center gap-3 text-xs sm:text-sm text-amber-950 font-semibold">
        <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0" />
        <div>
          <span className="font-extrabold text-amber-900 block text-sm">3-Way Match Control Active</span>
          <span>Receiving is hard-blocked beyond approved PO quantities (PO Quantity = Goods Receipt = Vendor Invoice). Over-receiving requires formal PO revision.</span>
        </div>
      </div>

      {/* Live PO & Receiving Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-xs">
              <tr>
                <th className="p-4">PO Number</th>
                <th className="p-4">Vendor Name</th>
                <th className="p-4">Item Description</th>
                <th className="p-4 text-right">PO Qty</th>
                <th className="p-4 text-right">RR Received</th>
                <th className="p-4">Invoice Ref</th>
                <th className="p-4 text-right">Total Amount</th>
                <th className="p-4 text-center">3-Way Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-semibold text-slate-800">
              {poList.map((po) => (
                <tr key={po.id} className="hover:bg-slate-50 transition">
                  <td className="p-4 font-mono font-extrabold text-blue-900">{po.poNumber}</td>
                  <td className="p-4 font-bold text-slate-900">{po.vendorName}</td>
                  <td className="p-4 text-xs font-semibold text-slate-700">{po.itemDescription}</td>
                  <td className="p-4 text-right font-mono font-bold text-slate-900">{po.poQty}</td>
                  <td className="p-4 text-right font-mono font-bold text-emerald-800">
                    {po.rrQtyReceived}
                  </td>
                  <td className="p-4 font-mono text-xs text-slate-600">{po.invoiceRef}</td>
                  <td className="p-4 text-right font-mono font-extrabold text-slate-900">
                    ₱{po.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4 text-center">
                    {po.rrQtyReceived >= po.poQty ? (
                      <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-300 font-extrabold text-xs shadow-2xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 3-Way Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-300 font-extrabold text-xs shadow-2xs">
                        <Clock className="w-4 h-4 text-amber-600" /> Pending Receiving
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
