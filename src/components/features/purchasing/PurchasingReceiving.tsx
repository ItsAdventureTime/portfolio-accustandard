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
import { WorkflowStepper } from '@/components/common/WorkflowStepper';

interface PurchasingReceivingProps {
  poList: any[];
  onOpenAddPO: () => void;
  onOpenReceivingModal: () => void;
  onOpenVendorInvoiceModal?: (po?: any) => void;
  onOpenThreeWayMatchModal?: (po?: any) => void;
}

export const PurchasingReceiving: React.FC<PurchasingReceivingProps> = ({
  poList,
  onOpenAddPO,
  onOpenReceivingModal,
  onOpenVendorInvoiceModal,
  onOpenThreeWayMatchModal,
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
          {onOpenVendorInvoiceModal && (
            <button
              onClick={() => onOpenVendorInvoiceModal(poList[0])}
              className="flex-1 sm:flex-initial px-4 py-3 bg-blue-900 hover:bg-blue-950 text-white font-extrabold text-xs sm:text-sm rounded-2xl transition flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-95"
            >
              <FileText className="w-4 h-4 text-blue-300" />
              <span>Record Vendor Invoice</span>
            </button>
          )}

          {onOpenThreeWayMatchModal && (
            <button
              onClick={() => onOpenThreeWayMatchModal(poList[0])}
              className="flex-1 sm:flex-initial px-4 py-3 bg-indigo-900 hover:bg-indigo-950 text-white font-extrabold text-xs sm:text-sm rounded-2xl transition flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-95"
            >
              <FileCheck className="w-4 h-4 text-indigo-300" />
              <span>Run 3-Way Match</span>
            </button>
          )}

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
        <div className="block sm:hidden text-[11px] text-slate-500 font-extrabold text-center py-1.5 bg-slate-100/90 border-b border-slate-200 uppercase tracking-wider">
          &larr; Swipe table horizontally for details &rarr;
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase text-xs">
              <tr>
                <th className="p-4">PO Number</th>
                <th className="p-4">Vendor Name</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Total Amount</th>
                <th className="p-4 text-center">Primary action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-semibold text-slate-800">
              {poList.map((po) => (
                <tr
                  key={po.id}
                  onClick={() => setSelectedPoModal(po)}
                  className="hover:bg-blue-50/50 transition cursor-pointer group"
                >
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
                  <td className="p-4 text-xs font-semibold text-slate-700">{po.createdAt || po.orderDate || '—'}</td>
                  <td className="p-4 text-center">
                    {po.rrQtyReceived >= po.poQty ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-900"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Complete</span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-extrabold text-amber-900"><Clock className="h-4 w-4 text-amber-600" /> Pending receiving</span>
                    )}
                  </td>
                  <td className="p-4 text-right font-mono font-extrabold text-slate-900">
                    ₱{po.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4 text-center">
                    <button type="button" onClick={() => setSelectedPoModal(po)} className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-black text-blue-950 transition hover:bg-blue-900 hover:text-white"><Eye className="h-4 w-4" /> Inspect</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PO Detail Inspector Modal */}
      {selectedPoModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto text-slate-900 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 border border-slate-300 animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200 ease-out text-slate-900 text-sm">
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

            <WorkflowStepper currentStep="PO" compact />

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
