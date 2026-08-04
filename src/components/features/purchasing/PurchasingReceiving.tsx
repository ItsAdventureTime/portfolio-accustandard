'use client';

import React from 'react';
import {
  Building2,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ShieldCheck,
  Plus,
  Lock,
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
    <div className="space-y-6">
      {/* Module Title & Actions Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Purchasing &amp; Receiving Control (3-Way Match)
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            PO &harr; Receiving Report (RR) &harr; Supplier Invoice &bull; Hard-Blocked Over-Receiving
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            onClick={onOpenReceivingModal}
            className="flex-1 sm:flex-initial px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <FileCheck className="w-4 h-4" />
            <span>Process Stock Receiving (RR)</span>
          </button>

          <button
            onClick={onOpenAddPO}
            className="flex-1 sm:flex-initial px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create New PO</span>
          </button>
        </div>
      </div>

      {/* Hard Blocked Control Banner */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-3 text-blue-950">
        <div className="p-2.5 bg-blue-700 text-white rounded-xl shadow-xs shrink-0">
          <Lock className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-black uppercase text-blue-900 tracking-wider">
            Hard-Blocked Over-Receiving Active
          </h4>
          <p className="text-[11px] text-blue-800 font-medium">
            Warehouse staff cannot receive quantities exceeding the approved PO limit. Excess stock requires a revised approved PO.
          </p>
        </div>
      </div>

      {/* PO List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider">
            Supplier Purchase Orders &amp; 3-Way Verification Ledger
          </h3>
          <span className="text-xs font-mono font-bold text-slate-500">{poList.length} Purchase Orders Recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3">PO Number</th>
                <th className="p-3">Supplier / Vendor</th>
                <th className="p-3">Item Description</th>
                <th className="p-3 text-center">PO Qty</th>
                <th className="p-3 text-center">RR Qty Recv</th>
                <th className="p-3">Supplier SI Ref</th>
                <th className="p-3 text-right">Total Amount</th>
                <th className="p-3 text-center">3-Way Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
              {poList.map((po) => (
                <tr key={po.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-3 font-mono font-bold text-blue-900 whitespace-nowrap">{po.poNumber}</td>
                  <td className="p-3 font-semibold whitespace-nowrap">{po.vendorName}</td>
                  <td className="p-3">{po.itemDescription}</td>
                  <td className="p-3 text-center font-mono font-bold">{po.poQty}</td>
                  <td className="p-3 text-center font-mono font-bold text-emerald-700">{po.rrQtyReceived}</td>
                  <td className="p-3 font-mono text-slate-600 whitespace-nowrap">{po.invoiceRef}</td>
                  <td className="p-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                    ₱{po.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3 text-center whitespace-nowrap">
                    {po.status === 'VERIFIED_3WAY' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 3-Way Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
                        <AlertTriangle className="w-3 h-3 text-amber-600" /> Awaiting Receiving
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
