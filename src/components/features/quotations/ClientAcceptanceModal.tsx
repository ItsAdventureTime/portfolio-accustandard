'use client';

import React, { useState } from 'react';
import { X, Upload, FileCheck, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

interface ClientAcceptanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  quotationData?: any;
  onConfirmAcceptance?: (evidenceData: any) => void;
}

export const ClientAcceptanceModal: React.FC<ClientAcceptanceModalProps> = ({
  isOpen,
  onClose,
  quotationData = {},
  onConfirmAcceptance,
}) => {
  const [clientApprover, setClientApprover] = useState('Dr. Amalia Santos (Medical Director)');
  const [approvalDate, setApprovalDate] = useState('2026-08-10');
  const [clientPONumber, setClientPONumber] = useState('ACE-PO-2026-9921');
  const [remarks, setRemarks] = useState('Client approved pricing offer and signed standard 3-year RTU contract.');
  const [fileName, setFileName] = useState('Signed_Sales_Quotation_ACE_Medical.pdf');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      if (onConfirmAcceptance) {
        onConfirmAcceptance({
          quotationId: quotationData.id || 'quote-1',
          clientApprover,
          approvalDate,
          clientPONumber,
          remarks,
          fileName,
          status: 'CLIENT_APPROVED',
        });
      }
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Upload Client Acceptance Evidence Modal"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-slate-300 my-auto text-slate-900 overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200 ease-out flex flex-col">
        {/* Header Block Matching Screenshot 2 Design System */}
        <div className="p-6 sm:p-7 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0 bg-white">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-700 text-white rounded-2xl shrink-0 shadow-md">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-slate-900">
                RECORD CLIENT ACCEPTANCE EVIDENCE
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">
                Sales Quote: <strong className="text-slate-900">{quotationData.qrn || 'QRN20240415037'}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Client Acceptance Modal"
            className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 text-xs sm:text-sm flex-1">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950 font-semibold space-y-1">
            <div className="flex items-center gap-1.5 font-extrabold text-amber-900">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>FR-005 Compliance Requirement:</span>
            </div>
            <p className="text-slate-700">
              Downstream fulfillment (Delivery Receipt &amp; Stock Release) is hard-blocked until valid signed client acceptance evidence is uploaded and recorded.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Client Approver / Contact Person</label>
            <input
              type="text"
              required
              value={clientApprover}
              onChange={(e) => setClientApprover(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Client Approval Date</label>
              <input
                type="date"
                required
                value={approvalDate}
                onChange={(e) => setApprovalDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Client PO / Ref Number</label>
              <input
                type="text"
                required
                value={clientPONumber}
                onChange={(e) => setClientPONumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Signed Evidence Attachment (.pdf / .jpg)</label>
            <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-4 bg-emerald-50/40 text-center space-y-2">
              <Upload className="w-6 h-6 text-emerald-700 mx-auto" />
              <div className="text-xs font-bold text-emerald-950">
                {fileName ? (
                  <span className="text-emerald-800 font-mono bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300 inline-block">
                    ✓ {fileName}
                  </span>
                ) : (
                  'Click or drag signed quotation / client PO document here'
                )}
              </div>
              <p className="text-[11px] text-slate-500">Max size 25MB &bull; PDF, PNG, JPG supported</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Approval Remarks / Special Conditions</label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          {/* Footer Actions Matching Screenshot 2 Design System */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold rounded-2xl transition text-xs sm:text-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-2xl transition text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Recording Evidence...' : 'Confirm Client Acceptance & Unlock Fulfillment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
