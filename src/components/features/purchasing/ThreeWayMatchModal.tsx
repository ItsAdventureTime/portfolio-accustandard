'use client';

import React from 'react';
import { X, CheckCircle2, ShieldCheck, FileText, Package, FileCheck, ArrowRight } from 'lucide-react';
import { AccessibleModal } from '@/components/common/AccessibleModal';

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
  poData,
  vendorInvoice,
  onConfirmVerification,
}) => {
  if (!isOpen) return null;

  const poNo = poData?.poNumber || poData?.qrn || '';
  const supplier = poData?.supplier || poData?.vendorName || '';
  const poAmount = Number(poData?.totalAmount);
  const poQty = Number(poData?.poQty);
  const grQty = Number(poData?.rrQtyReceived);
  const grNo = poData?.receivingReportNo || poData?.goodsReceiptNo || '';
  const invNo = vendorInvoice?.invoiceNo || '';
  const invAmount = Number(vendorInvoice?.amount);
  const hasPurchaseOrder = Boolean(poNo);
  const hasGoodsReceipt = Number.isFinite(grQty) && grQty > 0;
  const hasVendorInvoice = Boolean(vendorInvoice?.invoiceNo && Number.isFinite(invAmount) && invAmount > 0);
  const hasCompleteEvidence = hasPurchaseOrder && hasGoodsReceipt && hasVendorInvoice;
  const quantityVariance = Number.isFinite(poQty) && poQty > 0 ? poQty - grQty : null;
  const amountVariance = Number.isFinite(poAmount) && Number.isFinite(invAmount) ? poAmount - invAmount : null;
  const evidenceMissing = [
    !hasPurchaseOrder && 'approved purchase order',
    !hasGoodsReceipt && 'posted goods receipt',
    !hasVendorInvoice && 'vendor invoice',
  ].filter(Boolean).join(', ');

  const handleVerify = () => {
    if (!hasCompleteEvidence || (quantityVariance !== null && quantityVariance !== 0) || (amountVariance !== null && amountVariance !== 0)) return;
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
    <AccessibleModal
      isOpen={isOpen}
      onClose={onClose}
      title="3-Way Match Reconciliation Engine"
      description="Review purchase order, goods receipt, and vendor invoice evidence before verification."
      contentClassName="text-slate-900"
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
                <h2 id="three-way-match-title" className="text-lg font-bold text-slate-900 tracking-tight">
                  3-Way Match Reconciliation Engine
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                  FR-011
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                PO Reference: <strong className="text-slate-900">{poNo || 'No purchase order selected'}</strong> {supplier && <>&bull; Vendor: <strong className="text-slate-900">{supplier}</strong></>}
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
              <p className="font-bold text-slate-900 text-sm">{poNo || 'No approved PO selected'}</p>
              <div className="text-xs text-slate-600 space-y-1 font-medium">
                <p>Qty Ordered: <strong className="text-slate-900">{Number.isFinite(poQty) ? `${poQty} units` : 'Unavailable'}</strong></p>
                <p>PO Amount: <strong className="text-slate-900">{Number.isFinite(poAmount) ? `₱${poAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : 'Unavailable'}</strong></p>
              </div>
              <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md ${hasPurchaseOrder ? 'bg-emerald-100/80 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-900 border border-amber-200'}`}>
                {hasPurchaseOrder ? <><CheckCircle2 className="w-3 h-3 text-emerald-600" /> Selected PO record</> : 'Missing PO evidence'}
              </span>
            </div>

            {/* Document 2: Posted Goods Receipt */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                <Package className="w-4 h-4 text-emerald-600" />
                <span>2. Goods Receipt</span>
              </div>
              <p className="font-bold text-slate-900 text-sm">{grNo || (hasGoodsReceipt ? 'Receiving report linked to PO' : 'No goods receipt selected')}</p>
              <div className="text-xs text-slate-600 space-y-1 font-medium">
                <p>Qty Received: <strong className="text-slate-900">{hasGoodsReceipt ? `${grQty} units` : 'Unavailable'}</strong></p>
                <p>Warehouse: <strong className="text-slate-900">{poData?.warehouse || 'Unavailable'}</strong></p>
              </div>
              <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md ${hasGoodsReceipt ? 'bg-emerald-100/80 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-900 border border-amber-200'}`}>
                {hasGoodsReceipt ? <><CheckCircle2 className="w-3 h-3 text-emerald-600" /> Receipt available</> : 'Missing goods receipt'}
              </span>
            </div>

            {/* Document 3: Vendor Invoice */}
            <div className={`p-4 rounded-xl border space-y-2.5 ${hasVendorInvoice ? 'bg-slate-50/70 border-slate-200/80' : 'bg-amber-50/60 border-amber-200'}`}>
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
                <FileCheck className="w-4 h-4 text-indigo-600" />
                <span>3. Vendor Invoice</span>
              </div>
              <p className="font-bold text-slate-900 text-sm">{invNo || 'No vendor invoice selected'}</p>
              <div className="text-xs text-slate-600 space-y-1 font-medium">
                <p>Invoice Amount: <strong className="text-slate-900">{hasVendorInvoice ? `₱${invAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : 'Unavailable'}</strong></p>
                <p>Attachment: <strong className="text-blue-600">{vendorInvoice?.fileName || 'Unavailable'}</strong></p>
              </div>
              <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md ${hasVendorInvoice ? 'bg-emerald-100/80 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-900 border border-amber-200'}`}>
                {hasVendorInvoice ? <><CheckCircle2 className="w-3 h-3 text-emerald-600" /> Invoice preview available</> : 'Missing invoice evidence'}
              </span>
            </div>
          </div>

          {/* Variance Analysis Box */}
          <div className={`p-4 rounded-xl space-y-2 ${hasCompleteEvidence ? 'bg-emerald-50/60 border border-emerald-200' : 'bg-amber-50/70 border border-amber-200'}`}>
            <div className={`flex items-center gap-2 font-bold text-sm ${hasCompleteEvidence ? 'text-emerald-950' : 'text-amber-950'}`}>
              {hasCompleteEvidence ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <FileCheck className="w-5 h-5 text-amber-700 shrink-0" />}
              <span>{hasCompleteEvidence ? 'Evidence complete — variance can be reviewed.' : `Preview only — missing ${evidenceMissing}.`}</span>
            </div>
            {hasCompleteEvidence && <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-medium text-slate-700 pt-1">
              <div>Quantity variance: <strong className={quantityVariance === 0 ? 'text-emerald-800' : 'text-rose-800'}>{quantityVariance === null ? 'Unavailable' : `${quantityVariance} units`}</strong></div>
              <div>Unit price variance: <strong className="text-slate-700">Not calculated</strong></div>
              <div>Amount variance: <strong className={amountVariance === 0 ? 'text-emerald-800' : 'text-rose-800'}>{amountVariance === null ? 'Unavailable' : `₱${amountVariance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}</strong></div>
            </div>}
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
                disabled={!hasCompleteEvidence || quantityVariance !== 0 || amountVariance !== 0}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer active:scale-95 flex-1 sm:flex-initial disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify match</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AccessibleModal>
  );
};
