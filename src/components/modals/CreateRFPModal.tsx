'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CreditCard, Send, X } from 'lucide-react';
import { CurrencyInputField } from '@/components/common/CurrencyInputField';

interface CreateRFPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitRFP: (newRFP: any) => void | Promise<boolean | void>;
}

export const CreateRFPModal: React.FC<CreateRFPModalProps> = ({ isOpen, onClose, onSubmitRFP }) => {
  const [step, setStep] = useState(1);
  const [payee, setPayee] = useState('LBC Express Courier Services');
  const [glAccount, setGlAccount] = useState('6100 - Freight & Delivery');
  const [description, setDescription] = useState('Cold-chain express shipping for Pampanga hospital orders');
  const [amount, setAmount] = useState(18500);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rfpNumPreview] = useState(() => `RFP-2026-${Math.floor(1000 + Math.random() * 9000)}`);

  if (!isOpen) return null;

  const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const handleNext = () => {
    if (step === 1 && !payee.trim()) return;
    if (step === 2 && (!description.trim() || amount <= 0)) return;
    setStep((current) => Math.min(3, current + 1));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!payee.trim() || !description.trim() || amount <= 0) return;
    const newRFP = {
      id: `rfp-${Date.now()}`,
      rfpNo: rfpNumPreview,
      payee,
      glAccount,
      description,
      amount: Number(amount),
      requestedBy: 'Bookkeeper (Aila)',
      attachmentUrl: `${payee.replace(/\s+/g, '_')}_Voucher_Attachment.pdf`,
      disbursementProof: null,
      status: 'PENDING_GM',
      ownerRole: 'General Manager',
    };
    setIsSubmitting(true);
    try {
      const committed = await onSubmitRFP(newRFP);
      if (committed !== false) {
        setStep(1);
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
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4"><div className="flex items-center gap-3"><div className="rounded-2xl bg-purple-900 p-3 text-white"><CreditCard className="h-6 w-6" /></div><div><h2 className="text-base font-black tracking-tight sm:text-lg">Create request for payment</h2><p className="text-xs font-medium text-slate-600">Non-PO expense voucher routed through the approval chain.</p></div></div><button type="button" onClick={onClose} aria-label="Close request for payment wizard" className="min-h-[44px] min-w-[44px] rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-6 w-6" /></button></div>
        <div className="flex items-center gap-2" aria-label={`Request for payment wizard step ${step} of 3`}>{[1, 2, 3].map((item) => <span key={item} className={`h-2 flex-1 rounded-full ${item <= step ? 'bg-purple-900' : 'bg-slate-200'}`} />)}</div><div className="flex items-center justify-between text-xs font-black text-slate-500"><span className={step === 1 ? 'text-purple-900' : ''}>1. Document basics</span><span className={step === 2 ? 'text-purple-900' : ''}>2. Expense details</span><span className={step === 3 ? 'text-purple-900' : ''}>3. Review &amp; submit</span></div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {step === 1 && <div className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><label className="space-y-1.5 text-xs font-bold text-slate-700">Payee / vendor name *<input value={payee} onChange={(event) => setPayee(event.target.value)} className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900" required /></label><label className="space-y-1.5 text-xs font-bold text-slate-700">GL account *<select value={glAccount} onChange={(event) => setGlAccount(event.target.value)} className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900"><option>6100 - Freight &amp; Delivery</option><option>6200 - Utilities Expense</option><option>6300 - Professional &amp; Calibration Fees</option><option>6400 - Office Supplies</option><option>6500 - Maintenance &amp; Repairs</option></select></label></div><div className="grid gap-4 sm:grid-cols-2"><label className="space-y-1.5 text-xs font-bold text-slate-700">Request date<input readOnly value={date} className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600" /></label><label className="space-y-1.5 text-xs font-bold text-slate-700">Reference number<input readOnly value={rfpNumPreview} className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 font-mono text-sm font-semibold text-slate-600" /></label></div></div>}
          {step === 2 && <div className="space-y-4"><label className="block space-y-1.5 text-xs font-bold text-slate-700">Disbursement purpose / description *<textarea rows={3} value={description} onChange={(event) => setDescription(event.target.value)} className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900" required /></label><CurrencyInputField label="Total voucher amount" required value={amount} onChange={setAmount} /><details className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><summary className="cursor-pointer text-sm font-black text-slate-800">Advanced options</summary><label className="mt-3 block space-y-1.5 text-xs font-bold text-slate-700">Internal notes<textarea rows={2} value={notes} onChange={(event) => setNotes(event.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900" /></label></details></div>}
          {step === 3 && <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs font-black uppercase tracking-wider text-slate-500">Review before routing</p><dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2"><div><dt className="text-xs font-bold text-slate-500">Payee</dt><dd className="font-black">{payee}</dd></div><div><dt className="text-xs font-bold text-slate-500">Reference</dt><dd className="font-mono font-black">{rfpNumPreview}</dd></div><div><dt className="text-xs font-bold text-slate-500">GL account</dt><dd className="font-black">{glAccount}</dd></div><div><dt className="text-xs font-bold text-slate-500">Amount</dt><dd className="font-mono font-black">₱{amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</dd></div></dl><p className="mt-4 text-xs font-medium text-slate-600">{description}</p><details className="mt-3 rounded-xl border border-slate-200 bg-white p-3"><summary className="cursor-pointer text-xs font-black">Advanced options</summary><p className="mt-2 text-xs text-slate-600">{notes || 'No internal notes added.'}</p></details></div>}
          <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-4"><button type="button" onClick={step === 1 ? onClose : () => setStep((current) => current - 1)} className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-black text-slate-800 hover:bg-slate-200">{step === 1 ? 'Cancel' : <><ChevronLeft className="h-4 w-4" /> Back</>}</button>{step < 3 ? <button type="button" onClick={handleNext} className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-purple-900 px-5 py-2.5 text-sm font-black text-white hover:bg-purple-800">Continue <ChevronRight className="h-4 w-4" /></button> : <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-purple-900 px-5 py-2.5 text-sm font-black text-white disabled:opacity-60"><Send className="h-4 w-4 text-purple-200" /> {isSubmitting ? 'Submitting…' : 'Submit RFP voucher'}</button>}</div>
        </form>
      </div>
    </div>
  );
};
