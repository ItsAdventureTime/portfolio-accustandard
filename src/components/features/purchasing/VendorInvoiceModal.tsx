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
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white flex justify-between items-center shrink-0 border-b border-blue-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/20 text-blue-300 rounded-2xl border border-blue-400/30">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-white">
                Record Vendor Invoice (FR-010)
              </h2>
              <p className="text-xs text-blue-200/90 font-medium">
                Linked Purchase Order: <strong className="text-white">{poData.qrn || 'PO-2026-0891'}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Vendor Invoice Modal"
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
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

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-900 hover:bg-blue-950 text-white font-extrabold rounded-xl transition text-xs flex items-center gap-2 shadow-md cursor-pointer active:scale-95"
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
