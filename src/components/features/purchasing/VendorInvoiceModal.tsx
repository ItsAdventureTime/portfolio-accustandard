'use client';

import React, { useEffect, useState } from 'react';
import { X, FileText, Upload, CheckCircle2, FileCheck } from 'lucide-react';

import { CurrencyInputField } from '@/components/common/CurrencyInputField';
import { AccessibleModal } from '@/components/common/AccessibleModal';

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
  const [invoiceNo, setInvoiceNo] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [invoiceAmount, setInvoiceAmount] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [fileName, setFileName] = useState('');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    const amount = Number(poData?.totalAmount) || 0;
    setInvoiceNo('');
    setInvoiceDate('');
    setVendorName(poData?.supplier || poData?.vendorName || '');
    setInvoiceAmount(amount);
    setTaxAmount(amount * 0.12);
    setFileName('');
    setRemarks('');
  }, [poData]);

  if (!isOpen) return null;

  const poNo = poData?.poNumber || poData?.qrn || '';
  const hasPurchaseOrder = Boolean(poNo);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPurchaseOrder || !fileName || !invoiceNo.trim() || !invoiceDate || invoiceAmount <= 0) return;
    if (onSaveInvoice) {
      onSaveInvoice({
        invoiceNo,
        invoiceDate,
        vendorName,
        poNo,
        amount: invoiceAmount,
        taxAmount,
        fileName,
        remarks,
        status: 'PREVIEW_ONLY',
      });
    }
    onClose();
  };

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Vendor Invoice"
      description="Enter and preview invoice evidence linked to a selected purchase order."
      contentClassName="text-slate-900"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-100 my-auto text-slate-900 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        {/* Header Block */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0 bg-white">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-600/20 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Record Vendor Invoice
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/80">
                  FR-010
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Linked Purchase Order: <strong className="text-slate-900">{poNo || 'No purchase order selected'}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Vendor Invoice Modal"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!hasPurchaseOrder ? (
          <div className="p-6 space-y-4 text-sm">
            <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 font-medium text-amber-900">
              Preview only: select a purchase order with a real record before entering invoice evidence.
            </p>
            <button type="button" onClick={onClose} className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white">Close preview</button>
          </div>
        ) : <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm flex-1 bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Vendor Invoice Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
                className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-2 font-semibold text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Invoice Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-2 font-semibold text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Supplier / Vendor Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-2 font-semibold text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <CurrencyInputField
              label="Invoice Billed Amount"
              required
              value={invoiceAmount}
              onChange={(amt) => {
                setInvoiceAmount(amt);
                setTaxAmount(amt * 0.12);
              }}
            />
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                VAT Component (12%)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">₱</span>
                <input
                  type="number"
                  value={taxAmount}
                  onChange={(e) => setTaxAmount(Number(e.target.value))}
                  className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-8 pr-3.5 py-2 font-semibold text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Vendor Invoice Attachment (.pdf / .jpg) <span className="text-rose-500">*</span>
            </label>
            <label className="border-2 border-dashed border-blue-200 hover:border-blue-400 rounded-xl p-4 bg-blue-50/20 text-center space-y-2 transition cursor-pointer block">
              <Upload className="w-6 h-6 text-blue-600 mx-auto" />
              <input type="file" accept=".pdf,.jpg,.jpeg" className="sr-only" onChange={(e) => setFileName(e.target.files?.[0]?.name || '')} />
              <div>
                {fileName ? (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100/80 text-blue-900 font-semibold text-xs rounded-lg border border-blue-200">
                    <FileCheck className="w-3.5 h-3.5 text-blue-700" />
                    {fileName}
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-slate-800">
                    Upload Official Vendor Invoice Document
                  </span>
                )}
              </div>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Accounting Notes / Remarks
            </label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full bg-slate-50/80 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none transition-all"
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
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-blue-600/20 cursor-pointer active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Preview invoice entry</span>
            </button>
          </div>
        </form>}
      </div>
    </AccessibleModal>
  );
};
