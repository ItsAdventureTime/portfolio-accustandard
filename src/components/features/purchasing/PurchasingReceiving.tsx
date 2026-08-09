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
                <tr key={po.id} className="hover:bg-blue-50/50 transition group">
                  <td className="p-4">
                    <button
                      onClick={() => setSelectedPoModal(po)}
                      className="font-mono font-extrabold text-blue-900 hover:text-blue-700 hover:underline flex items-center gap-1.5 group-hover:scale-105 transition-transform"
                    >
                      <FileText className="w-4 h-4 text-blue-700 shrink-0" />
                      <span>{po.poNumber}</span>
                      <Eye className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-blue-600 transition-opacity" />
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
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-300 animate-in fade-in zoom-in duration-200 text-slate-900 text-xs">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-900 text-white rounded-xl">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase text-slate-900 tracking-wider">
                    PO Breakdown: {selectedPoModal.poNumber}
                  </h3>
                  <p className="text-slate-500 font-medium">Vendor: {selectedPoModal.vendorName}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPoModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* PO Info Grid */}
            <div className="space-y-2 p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium">
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Item Description:</span>
                <span className="font-bold text-slate-900 text-right">{selectedPoModal.itemDescription}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">SKU Code:</span>
                <span className="font-mono font-bold text-blue-900">{selectedPoModal.sku || 'ACC-REAG-01'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Vendor Invoice Ref:</span>
                <span className="font-mono text-slate-700">{selectedPoModal.invoiceRef || 'INV-PENDING'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Total PO Amount:</span>
                <span className="font-mono font-extrabold text-emerald-800 text-sm">
                  ₱{Number(selectedPoModal.totalAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* 3-Way Match Verification Progress */}
            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-blue-950 uppercase text-[11px]">3-Way Match Audit Progress</span>
                <span className="font-extrabold text-blue-900">
                  {selectedPoModal.rrQtyReceived} / {selectedPoModal.poQty} Units Received
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, ((selectedPoModal.rrQtyReceived || 0) / (selectedPoModal.poQty || 1)) * 100)}%`,
                  }}
                />
              </div>
              <p className="text-[10px] text-slate-600 font-medium">
                {selectedPoModal.rrQtyReceived >= selectedPoModal.poQty
                  ? '✓ Hard-Block Check Passed: Approved PO quantity matches actual Goods Received and Vendor Invoice.'
                  : '⚠️ Pending Goods Receipt (RR): Receiving report entry required at warehouse prior to payment disbursement.'}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 flex justify-between items-center border-t border-slate-200 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedPoModal(null);
                  onOpenReceivingModal();
                }}
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl transition flex items-center gap-1.5"
              >
                <PackageCheck className="w-4 h-4" />
                <span>Enter Receiving Report (RR)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPoModal(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
