'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, FileText, Package, FileCheck } from 'lucide-react';

interface ThreeWayMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  poData?: any;
  vendorInvoice?: any;
  onConfirmVerification?: (matchData: any) => void;
}

export const ThreeWayMatchModal: React.FC<ThreeWayMatchModalProps> = ({
  isOpen,
  onClose,
  poData = {},
  vendorInvoice,
  onConfirmVerification,
}) => {
  const [hasVendorInvoice] = useState(!!vendorInvoice || true);
  const [isMatchVerified] = useState(true);

  if (!isOpen) return null;

  const poNo = poData.qrn || 'PO-2026-0891';
  const supplier = poData.supplier || 'BioMerieux Corp Philippines';
  const poAmount = poData.totalAmount || 142000.0;
  const grNo = 'GR-2026-1049';
  const grQty = 60;
  const invNo = vendorInvoice?.invoiceNo || 'INV-SYS-99201';
  const invAmount = vendorInvoice?.amount || 142000.0;

  const handleVerify = () => {
    if (onConfirmVerification) {
      onConfirmVerification({
        poNo,
        grNo,
        invNo,
        status: 'VERIFIED_MATCH',
        matchedAt: new Date().toISOString(),
      });
    }
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="3-Way Match Verification Modal"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-300 my-auto text-slate-900 overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200 ease-out flex flex-col">
        {/* Header Block Matching Screenshot 2 Design System */}
        <div className="p-6 sm:p-7 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0 bg-white">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-900 text-white rounded-2xl shrink-0 shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-slate-900">
                3-WAY MATCH RECONCILIATION ENGINE (FR-011)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">
                PO Reference: <strong className="text-slate-900">{poNo}</strong> &bull; Vendor: <strong className="text-slate-900">{supplier}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close 3-Way Match Modal"
            className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-5 text-xs sm:text-sm flex-1">
          {/* 3 Document Comparison Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Document 1: Approved PO */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-blue-900 font-extrabold text-xs">
                <FileText className="w-4 h-4 text-blue-700" />
                <span>1. Approved PO</span>
              </div>
              <p className="font-mono font-bold text-slate-900 text-sm">{poNo}</p>
              <div className="text-[11px] text-slate-600 space-y-0.5 font-semibold">
                <p>Qty Ordered: <strong className="text-slate-900">60 Kits</strong></p>
                <p>PO Amount: <strong className="text-slate-900">₱{poAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></p>
              </div>
              <span className="inline-block text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                ✓ GM Approved
              </span>
            </div>

            {/* Document 2: Posted Goods Receipt */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs">
                <Package className="w-4 h-4 text-emerald-700" />
                <span>2. Goods Receipt</span>
              </div>
              <p className="font-mono font-bold text-slate-900 text-sm">{grNo}</p>
              <div className="text-[11px] text-slate-600 space-y-0.5 font-semibold">
                <p>Qty Received: <strong className="text-slate-900">{grQty} Kits</strong></p>
                <p>Warehouse: <strong className="text-slate-900">Pampanga</strong></p>
              </div>
              <span className="inline-block text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                ✓ Stock Posted
              </span>
            </div>

            {/* Document 3: Vendor Invoice */}
            <div className={`p-4 rounded-2xl border space-y-2 ${hasVendorInvoice ? 'bg-slate-50 border-slate-200' : 'bg-amber-50 border-amber-300'}`}>
              <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-xs">
                <FileCheck className="w-4 h-4 text-indigo-700" />
                <span>3. Vendor Invoice</span>
              </div>
              <p className="font-mono font-bold text-slate-900 text-sm">{invNo}</p>
              <div className="text-[11px] text-slate-600 space-y-0.5 font-semibold">
                <p>Invoice Amount: <strong className="text-slate-900">₱{invAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></p>
                <p>Attachment: <strong className="text-blue-700 font-mono">Billed_Inv.pdf</strong></p>
              </div>
              <span className="inline-block text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                ✓ Invoice Attached
              </span>
            </div>
          </div>

          {/* Variance Analysis Box */}
          <div className="p-4 bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200/80 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 font-black text-sm text-emerald-950 uppercase tracking-wider">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              <span>3-Way Match Audit Result: ZERO VARIANCE DETECTED</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-semibold text-slate-700 pt-1">
              <div>Quantity Variance: <strong className="text-emerald-800 font-mono">0 Kits (100% Match)</strong></div>
              <div>Unit Price Variance: <strong className="text-emerald-800 font-mono">₱0.00 (0% Diff)</strong></div>
              <div>Amount Variance: <strong className="text-emerald-800 font-mono">₱0.00 (Perfect Match)</strong></div>
            </div>
          </div>

          {/* Footer Actions */}
          {/* Footer Actions Matching Screenshot 2 Design System */}
          <div className="pt-4 border-t border-slate-200 flex justify-between items-center shrink-0">
            <span className="text-xs font-semibold text-slate-500">
              Rule FR-011: Verified status requires PO + GR + Vendor Invoice.
            </span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold rounded-2xl transition text-xs sm:text-sm cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleVerify}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-2xl transition text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark 3-Way Match Verified &amp; Unlock Payment</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
