'use client';

import React, { useState } from 'react';
import {
  Building2,
  Plus,
  ShieldAlert,
  CheckCircle2,
  Clock,
  PackageCheck,
  Package,
  FileText,
  Eye,
  X,
  FileCheck,
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
  const [selectedPoModal, setSelectedPoModal] = useState<any | null>(null);

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

        <div className="flex items-center gap-3 self-stretch sm:self-auto flex-wrap">
          <button
            onClick={onOpenReceivingModal}
            className="flex-1 sm:flex-initial px-5 py-3 bg-emerald-700 hover:bg-emerald-800 hover:shadow-md text-white font-extrabold text-xs sm:text-sm rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm active:scale-95 cursor-pointer"
          >
            <PackageCheck className="w-4 h-4" />
            <span>Enter Receiving Report (RR)</span>
          </button>

          <button
            onClick={onOpenAddPO}
            className="flex-1 sm:flex-initial px-5 py-3 bg-blue-900 hover:bg-blue-800 hover:shadow-md text-white font-extrabold text-xs sm:text-sm rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm active:scale-95 cursor-pointer"
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
                <tr key={po.id} className="hover:bg-blue-50/50 transition group">
                  <td className="p-4">
                    <button
                      type="button"
                      onClick={() => setSelectedPoModal(po)}
                      className="font-extrabold font-mono text-blue-950 bg-blue-50/90 border border-blue-200/90 hover:bg-blue-900 hover:text-white px-3 py-1.5 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-2xs group cursor-pointer"
                      title="Click to inspect 3-way match purchase order details"
                    >
                      <FileText className="w-4 h-4 text-blue-700 group-hover:text-blue-200 shrink-0" />
                      <span>{po.poNumber}</span>
                      <Eye className="w-3.5 h-3.5 text-blue-600 group-hover:text-white shrink-0 ml-0.5 opacity-80 group-hover:opacity-100" />
                    </button>
                  </td>
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

      {/* PO Detail Inspector Modal */}
      {selectedPoModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 border border-slate-300 animate-in fade-in zoom-in duration-200 text-slate-900 text-sm">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-900 text-white rounded-2xl shadow-sm">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black uppercase text-slate-900 tracking-wider">
                    PO Breakdown: {selectedPoModal.poNumber}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">Vendor: {selectedPoModal.vendorName}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPoModal(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* PO Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-sm">
              <div>
                <span className="text-slate-500 font-bold block text-xs uppercase tracking-wider">Item Description</span>
                <span className="font-extrabold text-slate-900 text-base">{selectedPoModal.itemDescription}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block text-xs uppercase tracking-wider">SKU Code</span>
                <span className="font-mono font-black text-blue-950 text-base">{selectedPoModal.sku || 'ACC-REAG-01'}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block text-xs uppercase tracking-wider">Vendor Invoice Reference</span>
                <span className="font-mono font-bold text-slate-700 text-sm sm:text-base">{selectedPoModal.invoiceRef || 'INV-PENDING'}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block text-xs uppercase tracking-wider">Total PO Amount</span>
                <span className="font-mono font-black text-emerald-800 text-lg">
                  ₱{Number(selectedPoModal.totalAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* 3-Way Match Verification Progress */}
            <div className="p-4 sm:p-5 bg-blue-50/90 border border-blue-200 rounded-2xl space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-black text-blue-950 uppercase text-xs tracking-wider">3-Way Match Audit Progress</span>
                <span className="font-extrabold text-blue-900 text-base">
                  {selectedPoModal.rrQtyReceived} / {selectedPoModal.poQty} Units Received
                </span>
              </div>
              <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, ((selectedPoModal.rrQtyReceived || 0) / (selectedPoModal.poQty || 1)) * 100)}%`,
                  }}
                />
              </div>
              <p className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed">
                {selectedPoModal.rrQtyReceived >= selectedPoModal.poQty
                  ? '✓ Hard-Block Check Passed: Approved PO quantity matches actual Goods Received and Vendor Invoice.'
                  : '⚠️ Pending Goods Receipt (RR): Receiving report entry required at warehouse prior to payment disbursement.'}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="pt-4 flex justify-between items-center border-t border-slate-200 gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedPoModal(null);
                  onOpenReceivingModal();
                }}
                className="px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs sm:text-sm rounded-2xl transition flex items-center gap-2 shadow-md active:scale-95 cursor-pointer"
              >
                <PackageCheck className="w-4 h-4" />
                <span>Enter Receiving Report (RR)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPoModal(null)}
                className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 font-extrabold text-xs sm:text-sm rounded-2xl transition cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
