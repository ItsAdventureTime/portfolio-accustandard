'use client';

import React, { useState } from 'react';
import { X, Upload, FileCheck, CheckCircle2, ShieldCheck } from 'lucide-react';
import { AccessibleModal } from '@/components/common/AccessibleModal';

interface ClientAcceptanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  quotationData?: any;
  onConfirmAcceptance?: (evidenceData: any) => void;
}

export const ClientAcceptanceModal: React.FC<ClientAcceptanceModalProps> = ({
  isOpen,
  onClose,
  quotationData,
  onConfirmAcceptance,
}) => {
  const [clientApprover, setClientApprover] = useState('');
  const [approvalDate, setApprovalDate] = useState('');
  const [clientPONumber, setClientPONumber] = useState('');
  const [remarks, setRemarks] = useState('');
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const quotationId = quotationData?.id || quotationData?.qrn;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quotationId || !fileName || !clientApprover.trim() || !approvalDate || !clientPONumber.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      if (onConfirmAcceptance) {
        onConfirmAcceptance({
          quotationId,
          clientApprover,
          approvalDate,
          clientPONumber,
          remarks,
          fileName,
          status: 'PREVIEW_ONLY',
        });
      }
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <AccessibleModal
      isOpen={Boolean(isOpen)}
      onClose={onClose}
      title="Client acceptance evidence preview"
      description="Review client acceptance evidence without persisting a workflow transition."
      contentClassName="text-slate-900"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-100 my-auto text-slate-900 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        {/* Header Block */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0 bg-white">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-md shadow-emerald-600/20 shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Record Client Acceptance Evidence
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Sales Quote: <strong className="text-slate-900">{quotationData?.qrn || 'No quotation selected'}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Client Acceptance Modal"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!quotationId ? <div className="p-6 space-y-4 text-sm"><p className="rounded-xl border border-amber-200 bg-amber-50 p-4 font-medium text-amber-900">Preview only: select a real quotation before entering acceptance evidence.</p><button type="button" onClick={onClose} className="w-full rounded-xl bg-slate-900 px-4 py-3 font-bold text-white">Close preview</button></div> : <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm flex-1 bg-white">
          <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-950 font-medium space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Fulfillment Requirement:</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              Order fulfillment (Delivery Receipt and stock release) requires uploaded proof of signed client acceptance.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Client Approver / Contact Person <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={clientApprover}
              onChange={(e) => setClientApprover(e.target.value)}
              className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-2 font-semibold text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Client Approval Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={approvalDate}
                onChange={(e) => setApprovalDate(e.target.value)}
                className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-2 font-semibold text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Client PO / Ref Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={clientPONumber}
                onChange={(e) => setClientPONumber(e.target.value)}
                className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-2 font-semibold text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Signed Evidence Attachment (.pdf / .jpg)
            </label>
            <label className="border-2 border-dashed border-emerald-200 hover:border-emerald-400 rounded-xl p-4 bg-emerald-50/20 text-center space-y-2 transition cursor-pointer block">
              <Upload className="w-6 h-6 text-emerald-600 mx-auto" />
              <input type="file" accept=".pdf,.png,.jpg,.jpeg" className="sr-only" onChange={(e) => setFileName(e.target.files?.[0]?.name || '')} />
              <div>
                {fileName ? (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100/80 text-emerald-900 font-semibold text-xs rounded-lg border border-emerald-200">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-700" />
                    {fileName}
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-slate-800">
                    Click or drag signed quotation / client PO document here
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">Max size 25MB &bull; PDF, PNG, JPG supported</p>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Approval Remarks / Special Conditions
            </label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full bg-slate-50/80 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none transition-all"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl transition text-xs sm:text-sm cursor-pointer shadow-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Preparing preview...' : 'Preview acceptance evidence'}</span>
            </button>
          </div>
        </form>}
      </div>
    </AccessibleModal>
  );
};
