'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, FileText, Lock, Send, X } from 'lucide-react';
import { CurrencyInputField } from '@/components/common/CurrencyInputField';
import { WorkflowStepper } from '@/components/common/WorkflowStepper';

interface CreateQuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventoryList: any[];
  onSubmitQuotation: (newQuote: any) => void | Promise<boolean | void>;
}

const WizardProgress: React.FC<{ step: number }> = ({ step }) => (
  <div className="flex items-center gap-2" aria-label={`Quotation wizard step ${step} of 3`}>
    {[1, 2, 3].map((item) => (
      <span key={item} className={`h-2 flex-1 rounded-full ${item <= step ? 'bg-blue-900' : 'bg-slate-200'}`} />
    ))}
  </div>
);

export const CreateQuotationModal: React.FC<CreateQuotationModalProps> = ({
  isOpen,
  onClose,
  inventoryList,
  onSubmitQuotation,
}) => {
  const [step, setStep] = useState(1);
  const [clientName, setClientName] = useState('');
  const [facilityName, setFacilityName] = useState('');
  const [address, setAddress] = useState('');
  const [selectedSku, setSelectedSku] = useState(inventoryList[0]?.sku || 'ACC-BACT-01');
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(31500);
  const [notes, setNotes] = useState('');
  const [referencePreview] = useState(() => `QRN${Date.now().toString().slice(-8)}`);

  if (!isOpen) return null;

  const selectedItem = inventoryList.find((item) => item.sku === selectedSku) || inventoryList[0];
  const total = quantity * unitPrice;
  const quotationDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const handleNext = () => {
    if (step === 1 && (!clientName.trim() || !facilityName.trim())) return;
    if (step === 2 && (!selectedItem || quantity < 1 || unitPrice <= 0)) return;
    setStep((current) => Math.min(3, current + 1));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!clientName.trim() || !facilityName.trim() || !selectedItem || quantity < 1 || unitPrice <= 0) return;

    const newQuote = {
      id: `quote-${Date.now()}`,
      qrn: referencePreview,
      type: 'Sales Quotation',
      maker: 'Sales Officer',
      reviewerStatus: 'PENDING',
      gmStatus: 'PENDING',
      dcsStatus: 'NOT_REQUIRED',
      totalAmount: total,
      totalPrice: total,
      clientName,
      clientFacility: facilityName,
      facilityName,
      clientAddress: address || 'Baliuag, Bulacan',
      address: address || 'Baliuag, Bulacan',
      itemDescription: selectedItem.description || 'Calibration Sticks Bact Alert',
      sku: selectedSku,
      packaging: `${quantity} Box of ${selectedItem.onHand || 40}`,
      unitPrice,
      quantity,
      quotationDate,
      items: [{ id: `item-${Date.now()}`, description: selectedItem.description || 'Calibration Sticks Bact Alert', packaging: `${quantity} Box of ${selectedItem.onHand || 40}`, unitPrice }],
    };

    const committed = await onSubmitQuotation(newQuote);
    if (committed === false) return;
    setStep(1);
    setClientName('');
    setFacilityName('');
    setAddress('');
    setNotes('');
    onClose();
  };

  return (
    <div className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/80 p-4 text-slate-900 backdrop-blur-md sm:p-6">
      <div className="modal-surface mobile-modal-container w-full max-w-3xl space-y-5 rounded-3xl border border-slate-300 bg-white p-5 text-sm shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-amber-600 p-3 text-white"><FileText className="h-6 w-6" /></div>
            <div>
              <h2 className="text-base font-black tracking-tight sm:text-lg">Create sales quotation</h2>
              <p className="text-xs font-medium text-slate-600">Routes to Marketing review, General Manager approval, then customer acceptance.</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close quotation wizard" className="min-h-[44px] min-w-[44px] rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"><X className="h-6 w-6" /></button>
        </div>

        <WorkflowStepper currentStep="RFQ" compact />
        <WizardProgress step={step} />
        <div className="flex items-center justify-between text-xs font-black text-slate-500"><span className={step === 1 ? 'text-blue-900' : ''}>1. Document basics</span><span className={step === 2 ? 'text-blue-900' : ''}>2. Line items</span><span className={step === 3 ? 'text-blue-900' : ''}>3. Review &amp; submit</span></div>

        <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-semibold text-amber-950 sm:text-sm"><Lock className="h-5 w-5 shrink-0 text-amber-600" /><span>Submitting this quote reserves the selected stock item for 3 days.</span></div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1.5 text-xs font-bold text-slate-700">Client contact name *<input value={clientName} onChange={(event) => setClientName(event.target.value)} placeholder="e.g. Katherine Porciuncula" className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900" required /></label>
                <label className="space-y-1.5 text-xs font-bold text-slate-700">Medical facility name *<input value={facilityName} onChange={(event) => setFacilityName(event.target.value)} placeholder="e.g. Allied Care Experts Medical Center" className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900" required /></label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1.5 text-xs font-bold text-slate-700">Quotation date<input value={quotationDate} readOnly className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600" /></label>
                <label className="space-y-1.5 text-xs font-bold text-slate-700">Reference number<input value={referencePreview} readOnly className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 font-mono text-sm font-semibold text-slate-600" /></label>
              </div>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-black text-slate-800">Advanced options</summary>
                <label className="mt-3 block space-y-1.5 text-xs font-bold text-slate-700">Delivery address<input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Defaults to Baliuag, Bulacan" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900" /></label>
              </details>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <label className="block space-y-1.5 text-xs font-bold text-slate-700">Search registered inventory<select value={selectedSku} onChange={(event) => setSelectedSku(event.target.value)} className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900">{inventoryList.map((item) => <option key={item.id} value={item.sku}>{item.sku} — {item.description} ({item.onHand - item.reserved} available at {item.location})</option>)}</select></label>
              <div className="grid gap-4 sm:grid-cols-2"><label className="space-y-1.5 text-xs font-bold text-slate-700">Order quantity<input type="number" min="1" value={quantity} onChange={(event) => setQuantity(Math.max(1, Number(event.target.value)))} className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-black text-slate-900" /></label><CurrencyInputField label="Unit price" value={unitPrice} onChange={setUnitPrice} /></div>
              <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><summary className="cursor-pointer text-sm font-black text-slate-800">Advanced options</summary><label className="mt-3 block space-y-1.5 text-xs font-bold text-slate-700">Internal notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={2} placeholder="Optional internal note" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900" /></label></details>
              <div className="flex items-center justify-between rounded-2xl bg-slate-900 p-4 text-white"><span className="text-xs font-bold uppercase tracking-wider text-slate-300">Total quotation value</span><span className="font-mono text-xl font-black text-emerald-400">₱{total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4"><div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs font-black uppercase tracking-wider text-slate-500">Ready to submit</p><dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2"><div><dt className="text-xs font-bold text-slate-500">Client</dt><dd className="font-black text-slate-900">{clientName} · {facilityName}</dd></div><div><dt className="text-xs font-bold text-slate-500">Reference</dt><dd className="font-mono font-black text-slate-900">{referencePreview}</dd></div><div><dt className="text-xs font-bold text-slate-500">Item</dt><dd className="font-black text-slate-900">{selectedItem?.description}</dd></div><div><dt className="text-xs font-bold text-slate-500">Quantity / total</dt><dd className="font-black text-slate-900">{quantity} · ₱{total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</dd></div></dl></div><details className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><summary className="cursor-pointer text-sm font-black text-slate-800">Advanced options</summary><p className="mt-3 text-xs font-medium text-slate-600">{notes || 'No internal notes added.'}</p></details></div>
          )}

          <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-4"><button type="button" onClick={step === 1 ? onClose : () => setStep((current) => current - 1)} className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-black text-slate-800 transition hover:bg-slate-200">{step === 1 ? 'Cancel' : <><ChevronLeft className="h-4 w-4" /> Back</>}</button>{step < 3 ? <button type="button" onClick={handleNext} className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-blue-900 px-5 py-2.5 text-sm font-black text-white transition hover:bg-blue-800">Continue <ChevronRight className="h-4 w-4" /></button> : <button type="submit" className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-blue-900 px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-blue-800"><Send className="h-4 w-4 text-blue-200" /> Submit for approval</button>}</div>
        </form>
      </div>
    </div>
  );
};
