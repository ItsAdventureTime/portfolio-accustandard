'use client';

import React, { useState } from 'react';
import { AlertTriangle, Building2, ChevronLeft, ChevronRight, Send, ShieldAlert, X } from 'lucide-react';
import { CurrencyInputField } from '@/components/common/CurrencyInputField';
import { WorkflowStepper } from '@/components/common/WorkflowStepper';

interface CreatePOModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventoryList: any[];
  onSubmitPO: (newPO: any) => void | Promise<boolean | void>;
  existingPOs?: any[];
}

const Progress: React.FC<{ step: number }> = ({ step }) => <div className="flex items-center gap-2" aria-label={`Purchase order wizard step ${step} of 3`}>{[1, 2, 3].map((item) => <span key={item} className={`h-2 flex-1 rounded-full ${item <= step ? 'bg-blue-900' : 'bg-slate-200'}`} />)}</div>;

export const CreatePOModal: React.FC<CreatePOModalProps> = ({ isOpen, onClose, inventoryList, onSubmitPO, existingPOs = [] }) => {
  const [step, setStep] = useState(1);
  const [vendorName, setVendorName] = useState('BioMerieux Diagnostics Corp');
  const [selectedSku, setSelectedSku] = useState(inventoryList[0]?.sku || 'ACC-BACT-01');
  const [poQty, setPoQty] = useState(100);
  const [unitPrice, setUnitPrice] = useState(1420);
  const [linkedCustomerPO, setLinkedCustomerPO] = useState('');
  const [shortageReason, setShortageReason] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [poNumPreview] = useState(() => `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`);

  if (!isOpen) return null;

  const selectedItem = inventoryList.find((item) => item.sku === selectedSku) || inventoryList[0];
  const isClass3 = Boolean(selectedItem?.itemClass?.includes('Class 3') || selectedSku === 'ACC-SPEC-99');
  const existingOpenPO = existingPOs.find((po) => po.sku === selectedSku && ['PENDING_RECEIVING', 'PENDING_ACCOUNTING', 'PARTIALLY_RECEIVED'].includes(po.status));
  const remainingQtyInOpenPO = existingOpenPO ? Math.max(0, existingOpenPO.poQty - (existingOpenPO.rrQtyReceived || 0)) : 0;
  const isCoveredByOpenPO = Boolean(existingOpenPO && remainingQtyInOpenPO >= poQty);
  const isShortageException = Boolean(existingOpenPO && remainingQtyInOpenPO > 0 && poQty > remainingQtyInOpenPO);
  const total = poQty * unitPrice;
  const orderDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const handleNext = () => {
    if (step === 1 && !vendorName.trim()) return;
    if (step === 2 && (poQty < 1 || unitPrice <= 0)) return;
    setStep((current) => Math.min(3, current + 1));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!vendorName.trim() || poQty < 1 || unitPrice <= 0) return;
    if (isClass3 && !linkedCustomerPO.trim()) {
      setErrorMessage('COSO Fraud Control Block: Class 3 (Short-Expiry / Special) items require an approved linked Customer PO before generating a supplier PO.');
      setStep(2);
      return;
    }
    if (isCoveredByOpenPO) {
      setErrorMessage(`AT-PO-001 Block: SKU ${selectedSku} is fully covered by open ${existingOpenPO.poNumber} (Remaining Qty: ${remainingQtyInOpenPO}). Creating a duplicate PO is prohibited.`);
      setStep(2);
      return;
    }
    if (isShortageException && !shortageReason.trim()) {
      setErrorMessage('AT-PO-002 Requirement: A shortage exception reason is mandatory when ordering beyond remaining open PO quantity.');
      setStep(2);
      return;
    }

    setErrorMessage(null);
    const newPO = {
      id: `po-${Date.now()}`,
      poNumber: poNumPreview,
      vendorName,
      itemDescription: selectedItem?.description || 'Medical Supply Kit',
      sku: selectedSku,
      itemClass: selectedItem?.itemClass || '',
      poQty,
      rrQtyReceived: 0,
      invoiceRef: 'Awaiting Receipt',
      totalAmount: total,
      linkedCustomerPO: isClass3 ? linkedCustomerPO : 'N/A',
      accountingApproved: false,
      gmApproved: false,
      dcsApproved: false,
      isShortageException,
      shortageReason: isShortageException ? shortageReason : null,
      status: 'PENDING_ACCOUNTING',
      ownerRole: 'Bookkeeper',
    };

    setIsSubmitting(true);
    try {
      const committed = await onSubmitPO(newPO);
      if (committed !== false) {
        setStep(1);
        setErrorMessage(null);
        setNotes('');
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/80 p-4 text-slate-900 backdrop-blur-md sm:p-6">
      <div className="modal-surface mobile-modal-container w-full max-w-3xl space-y-5 rounded-3xl border border-slate-300 bg-white p-5 text-sm shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4"><div className="flex items-center gap-3"><div className="rounded-2xl bg-blue-900 p-3 text-white"><Building2 className="h-6 w-6" /></div><div><h2 className="text-base font-black tracking-tight sm:text-lg">Create purchase order</h2><p className="text-xs font-medium text-slate-600">Routes to Accounting review, then General Manager approval.</p></div></div><button type="button" onClick={onClose} aria-label="Close purchase order wizard" className="min-h-[44px] min-w-[44px] rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-6 w-6" /></button></div>
        <WorkflowStepper currentStep="PO" compact /><Progress step={step} /><div className="flex items-center justify-between text-xs font-black text-slate-500"><span className={step === 1 ? 'text-blue-900' : ''}>1. Document basics</span><span className={step === 2 ? 'text-blue-900' : ''}>2. Line items</span><span className={step === 3 ? 'text-blue-900' : ''}>3. Review &amp; submit</span></div>
        {errorMessage && <div id="purchase-order-error" role="alert" aria-live="assertive" aria-atomic="true" className="flex items-start gap-3 rounded-2xl border border-rose-300 bg-rose-50 p-4 text-xs font-bold text-rose-950"><ShieldAlert className="h-5 w-5 shrink-0 text-rose-600" /><span>{errorMessage}</span></div>}
        {existingOpenPO && <div className="space-y-2 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-950"><div className="flex items-center justify-between gap-3 text-xs font-black uppercase tracking-wider"><span className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-600" />Open PO found for this SKU</span><span className="rounded-full bg-amber-200 px-2.5 py-1">{existingOpenPO.poNumber}</span></div><div className="grid gap-2 text-xs font-semibold sm:grid-cols-4"><span>Supplier: <strong>{existingOpenPO.vendorName}</strong></span><span>Ordered: <strong>{existingOpenPO.poQty}</strong></span><span>Received: <strong>{existingOpenPO.rrQtyReceived || 0}</strong></span><span>Remaining: <strong className="text-amber-700">{remainingQtyInOpenPO}</strong></span></div></div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {step === 1 && <div className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><label className="space-y-1.5 text-xs font-bold text-slate-700">Supplier / vendor name *<input value={vendorName} onChange={(event) => { setVendorName(event.target.value); setErrorMessage(null); }} className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900" required /></label><label className="space-y-1.5 text-xs font-bold text-slate-700">Inventory item *<select value={selectedSku} onChange={(event) => { setSelectedSku(event.target.value); setErrorMessage(null); }} className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900">{inventoryList.map((item) => <option key={item.id} value={item.sku}>{item.sku} — {item.description} ({item.location})</option>)}</select></label></div><div className="grid gap-4 sm:grid-cols-2"><label className="space-y-1.5 text-xs font-bold text-slate-700">Order date<input readOnly value={orderDate} className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600" /></label><label className="space-y-1.5 text-xs font-bold text-slate-700">Reference number<input readOnly value={poNumPreview} className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 font-mono text-sm font-semibold text-slate-600" /></label></div></div>}
          {step === 2 && <div className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><label className="space-y-1.5 text-xs font-bold text-slate-700">PO quantity *<input type="number" min="1" value={poQty} onChange={(event) => setPoQty(Math.max(1, Number(event.target.value)))} aria-describedby={errorMessage ? 'purchase-order-error' : undefined} aria-invalid={errorMessage ? true : undefined} className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-black text-slate-900" /></label><CurrencyInputField label="Unit cost" value={unitPrice} onChange={setUnitPrice} /></div>{isClass3 && <label className="block space-y-1.5 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-xs font-extrabold text-blue-950">Linked customer PO / contract number *<input value={linkedCustomerPO} onChange={(event) => setLinkedCustomerPO(event.target.value)} placeholder="e.g. CUST-PO-2026-88" aria-describedby={errorMessage ? 'purchase-order-error' : undefined} aria-invalid={errorMessage ? true : undefined} className="mt-1 w-full rounded-xl border border-blue-300 bg-white px-4 py-3 text-sm font-bold text-slate-900" required /></label>}{isShortageException && <label className="block space-y-1.5 rounded-2xl border border-purple-200 bg-purple-50 p-4 text-xs font-extrabold text-purple-950">Shortage exception justification *<input value={shortageReason} onChange={(event) => setShortageReason(event.target.value)} placeholder="Explain the demand exception" aria-describedby={errorMessage ? 'purchase-order-error' : undefined} aria-invalid={errorMessage ? true : undefined} className="mt-1 w-full rounded-xl border border-purple-300 bg-white px-4 py-3 text-sm font-bold text-slate-900" required /></label>}<details className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><summary className="cursor-pointer text-sm font-black text-slate-800">Advanced options</summary><label className="mt-3 block space-y-1.5 text-xs font-bold text-slate-700">Internal notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={2} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900" /></label></details><div className="flex items-center justify-between rounded-2xl bg-slate-900 p-4 text-white"><span className="text-xs font-bold uppercase tracking-wider text-slate-300">Total purchase order value</span><span className="font-mono text-xl font-black text-emerald-400">₱{total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></div></div>}
          {step === 3 && <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs font-black uppercase tracking-wider text-slate-500">Review before routing</p><dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2"><div><dt className="text-xs font-bold text-slate-500">Supplier</dt><dd className="font-black">{vendorName}</dd></div><div><dt className="text-xs font-bold text-slate-500">Reference</dt><dd className="font-mono font-black">{poNumPreview}</dd></div><div><dt className="text-xs font-bold text-slate-500">Item / quantity</dt><dd className="font-black">{selectedItem?.description} · {poQty}</dd></div><div><dt className="text-xs font-bold text-slate-500">Total</dt><dd className="font-mono font-black">₱{total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</dd></div></dl><details className="mt-4 rounded-xl border border-slate-200 bg-white p-3"><summary className="cursor-pointer text-xs font-black">Advanced options</summary><p className="mt-2 text-xs font-medium text-slate-600">{isClass3 ? `Linked customer PO: ${linkedCustomerPO || 'Missing'}` : 'No special customer PO link required.'}{notes ? ` · ${notes}` : ''}</p></details></div>}
          <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-4"><button type="button" onClick={step === 1 ? onClose : () => setStep((current) => current - 1)} className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-black text-slate-800 hover:bg-slate-200">{step === 1 ? 'Cancel' : <><ChevronLeft className="h-4 w-4" /> Back</>}</button>{step < 3 ? <button type="button" onClick={handleNext} className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-blue-900 px-5 py-2.5 text-sm font-black text-white hover:bg-blue-800">Continue <ChevronRight className="h-4 w-4" /></button> : <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-blue-900 px-5 py-2.5 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60"><Send className="h-4 w-4 text-blue-200" /> {isSubmitting ? 'Submitting…' : 'Submit to Accounting'}</button>}</div>
        </form>
      </div>
    </div>
  );
};
