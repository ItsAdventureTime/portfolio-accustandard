'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, FileText, Package, FileCheck, ArrowRight } from 'lucide-react';

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
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-100 my-auto text-slate-900 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        {/* Header Block */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0 bg-white">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-md shadow-indigo-600/20 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  3-Way Match Reconciliation Engine
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                  FR-011
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                PO Reference: <strong className="text-slate-900">{poNo}</strong> &bull; Vendor: <strong className="text-slate-900">{supplier}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close 3-Way Match Modal"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-sm flex-1 bg-white">
          {/* 3 Document Comparison Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Document 1: Approved PO */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-2.5">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>1. Approved PO</span>
              </div>
              <p className="font-bold text-slate-900 text-sm">{poNo}</p>
              <div className="text-xs text-slate-600 space-y-1 font-medium">
                <p>Qty Ordered: <strong className="text-slate-900">60 Kits</strong></p>
                <p>PO Amount: <strong className="text-slate-900">₱{poAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></p>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-100/80 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> GM Approved
              </span>
            </div>

            {/* Document 2: Posted Goods Receipt */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                <Package className="w-4 h-4 text-emerald-600" />
                <span>2. Goods Receipt</span>
              </div>
              <p className="font-bold text-slate-900 text-sm">{grNo}</p>
              <div className="text-xs text-slate-600 space-y-1 font-medium">
                <p>Qty Received: <strong className="text-slate-900">{grQty} Kits</strong></p>
                <p>Warehouse: <strong className="text-slate-900">Pampanga</strong></p>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-100/80 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Stock Posted
              </span>
            </div>

            {/* Document 3: Vendor Invoice */}
            <div className={`p-4 rounded-xl border space-y-2.5 ${hasVendorInvoice ? 'bg-slate-50/70 border-slate-200/80' : 'bg-amber-50/60 border-amber-200'}`}>
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
                <FileCheck className="w-4 h-4 text-indigo-600" />
                <span>3. Vendor Invoice</span>
              </div>
              <p className="font-bold text-slate-900 text-sm">{invNo}</p>
              <div className="text-xs text-slate-600 space-y-1 font-medium">
                <p>Invoice Amount: <strong className="text-slate-900">₱{invAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></p>
                <p>Attachment: <strong className="text-blue-600">Billed_Inv.pdf</strong></p>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-100/80 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Invoice Attached
              </span>
            </div>
          </div>

          {/* Variance Analysis Box */}
          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-950">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>3-Way Match Audit Result: Zero Variance Detected</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-medium text-slate-700 pt-1">
              <div>Quantity Variance: <strong className="text-emerald-800">0 Kits (100% Match)</strong></div>
              <div>Unit Price Variance: <strong className="text-emerald-800">₱0.00 (0% Diff)</strong></div>
              <div>Amount Variance: <strong className="text-emerald-800">₱0.00 (Perfect Match)</strong></div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <span className="text-xs font-medium text-slate-500">
              Rule FR-011: Verified status requires PO + GR + Vendor Invoice.
            </span>
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl transition text-xs sm:text-sm cursor-pointer shadow-xs flex-1 sm:flex-initial"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleVerify}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer active:scale-95 flex-1 sm:flex-initial"
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
