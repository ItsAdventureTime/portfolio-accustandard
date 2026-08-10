'use client';

import React, { useState } from 'react';
import { X, FileText, Upload, CheckCircle2, ShieldCheck, DollarSign } from 'lucide-react';

interface VendorInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  poData?: any;
  onSaveInvoice?: (invoiceData: any) => void;
}

export const VendorInvoiceModal: React.FC<VendorInvoiceModalProps> = ({
  isOpen,
  onClose,
  poData = {},
  onSaveInvoice,
}) => {
  const [invoiceNo, setInvoiceNo] = useState(`INV-SYS-${Math.floor(10000 + Math.random() * 90000)}`);
  const [invoiceDate, setInvoiceDate] = useState('2026-08-10');
  const [vendorName, setVendorName] = useState(poData.supplier || 'BioMerieux Corp Philippines');
  const [invoiceAmount, setInvoiceAmount] = useState(poData.totalAmount || 142000.0);
  const [taxAmount, setTaxAmount] = useState((poData.totalAmount || 142000.0) * 0.12);
  const [fileName, setFileName] = useState('Vendor_Official_Invoice_BioMerieux.pdf');
  const [remarks, setRemarks] = useState('Official BIR tax invoice received matching PO delivery.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSaveInvoice) {
      onSaveInvoice({
        id: `vinv-${Math.floor(100 + Math.random() * 900)}`,
        invoiceNo,
        invoiceDate,
        vendorName,
        poNo: poData.qrn || 'PO-2026-0891',
        amount: invoiceAmount,
        taxAmount,
        fileName,
        remarks,
        status: 'POSTED',
      });
    }
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Vendor Invoice Entry Modal"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-slate-300 my-auto text-slate-900 overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200 ease-out flex flex-col">
        {/* Header Block Matching Screenshot 2 Design System */}
        <div className="p-6 sm:p-7 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0 bg-white">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-900 text-white rounded-2xl shrink-0 shadow-md">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-slate-900">
                RECORD VENDOR INVOICE (FR-010)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">
                Linked Purchase Order: <strong className="text-slate-900">{poData.qrn || 'PO-2026-0891'}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Vendor Invoice Modal"
            className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 text-xs sm:text-sm flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Vendor Invoice Number</label>
              <input
                type="text"
                required
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Invoice Date</label>
              <input
                type="date"
                required
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-semibold text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Supplier / Vendor Name</label>
            <input
              type="text"
              required
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Invoice Billed Amount (PHP)</label>
              <input
                type="number"
                required
                value={invoiceAmount}
                onChange={(e) => {
                  const amt = Number(e.target.value);
                  setInvoiceAmount(amt);
                  setTaxAmount(amt * 0.12);
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">VAT Component (12%)</label>
              <input
                type="number"
                value={taxAmount}
                onChange={(e) => setTaxAmount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mandatory Vendor Invoice Attachment (.pdf / .jpg)</label>
            <div className="border-2 border-dashed border-blue-300 rounded-2xl p-4 bg-blue-50/40 text-center space-y-1.5">
              <Upload className="w-6 h-6 text-blue-700 mx-auto" />
              <div className="text-xs font-bold text-blue-950">
                {fileName ? (
                  <span className="text-blue-900 font-mono bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-300 inline-block">
                    ✓ {fileName}
                  </span>
                ) : (
                  'Upload Official Vendor Invoice Document'
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Accounting Notes / Remarks</label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
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
              className="px-6 py-2.5 bg-blue-900 hover:bg-blue-950 text-white font-extrabold rounded-2xl transition text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Record Vendor Invoice &amp; Trigger 3-Way Match</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
