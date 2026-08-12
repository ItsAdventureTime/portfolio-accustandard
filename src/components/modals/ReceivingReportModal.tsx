'use client';

import React, { useState } from 'react';
import { AlertTriangle, Check, ChevronLeft, ChevronRight, PackageCheck, ShieldAlert, X } from 'lucide-react';
import { WorkflowStepper } from '@/components/common/WorkflowStepper';

interface ReceivingReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  poList: any[];
  onReceivePO: (poId: string, receivedQty: number, details?: { batchNumber?: string; serialNumber?: string }) => void | Promise<boolean | void>;
}

export const ReceivingReportModal: React.FC<ReceivingReportModalProps> = ({ isOpen, onClose, poList, onReceivePO }) => {
  const pendingPOs = poList.filter((po) => po.rrQtyReceived < po.poQty);
  const [step, setStep] = useState(1);
  const [selectedPoId, setSelectedPoId] = useState(pendingPOs[0]?.id || poList[0]?.id || '');
  const [receivedQty, setReceivedQty] = useState(100);
  const [batchNumber, setBatchNumber] = useState('LOT-2026-REC-01');
  const [serialNumber, setSerialNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [hardBlockError, setHardBlockError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const selectedPO = poList.find((po) => po.id === selectedPoId) || poList[0];
  const maxAllowed = selectedPO ? selectedPO.poQty - selectedPO.rrQtyReceived : 0;
  const receiptDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const referencePreview = selectedPO ? `RR-${selectedPO.poNumber}` : 'RR-NEW';

  const handleNext = () => {
    if (step === 1 && !selectedPO) return;
    if (step === 2 && (receivedQty < 1 || receivedQty > maxAllowed)) return;
    setStep((current) => Math.min(3, current + 1));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedPO) return;
    if (selectedPO.rrQtyReceived + Number(receivedQty) > selectedPO.poQty) {
      setHardBlockError(`COSO Fraud Control HARD-BLOCK: Cannot receive ${receivedQty} units. Total would reach ${selectedPO.rrQtyReceived + Number(receivedQty)}, exceeding approved PO limit of ${selectedPO.poQty} units.`);
      setStep(2);
      return;
    }
    setHardBlockError(null);
    setIsSubmitting(true);
    try {
      const committed = await onReceivePO(selectedPO.id, Number(receivedQty), { batchNumber, serialNumber });
      if (committed !== false) {
        setStep(1);
        setHardBlockError(null);
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
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4"><div className="flex items-center gap-3"><div className="rounded-2xl bg-emerald-700 p-3 text-white"><PackageCheck className="h-6 w-6" /></div><div><h2 className="text-base font-black tracking-tight sm:text-lg">Enter receiving report</h2><p className="text-xs font-medium text-slate-600">Verify goods receipt against the approved purchase order.</p></div></div><button type="button" onClick={onClose} aria-label="Close receiving report wizard" className="min-h-[44px] min-w-[44px] rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-6 w-6" /></button></div>
        <WorkflowStepper currentStep="RR" compact /><div className="flex items-center gap-2" aria-label={`Receiving report wizard step ${step} of 3`}>{[1, 2, 3].map((item) => <span key={item} className={`h-2 flex-1 rounded-full ${item <= step ? 'bg-emerald-700' : 'bg-slate-200'}`} />)}</div><div className="flex items-center justify-between text-xs font-black text-slate-500"><span className={step === 1 ? 'text-emerald-800' : ''}>1. Document basics</span><span className={step === 2 ? 'text-emerald-800' : ''}>2. Receipt details</span><span className={step === 3 ? 'text-emerald-800' : ''}>3. Review &amp; submit</span></div>
        <div className="flex items-center gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-xs font-semibold text-amber-950 sm:text-sm"><ShieldAlert className="h-5 w-5 shrink-0 text-amber-600" /><span>3-Way Match control: received quantity cannot exceed the approved PO quantity ({selectedPO?.poQty || 0} units).</span></div>
        {hardBlockError && <div className="flex items-start gap-3 rounded-2xl border border-rose-300 bg-rose-50 p-4 text-xs font-bold text-rose-950"><AlertTriangle className="h-5 w-5 shrink-0 text-rose-600" /><span>{hardBlockError}</span></div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {step === 1 && <div className="space-y-4"><label className="block space-y-1.5 text-xs font-bold text-slate-700">Select purchase order *<select value={selectedPoId} onChange={(event) => { setSelectedPoId(event.target.value); setHardBlockError(null); const po = poList.find((item) => item.id === event.target.value); if (po) setReceivedQty(Math.max(1, po.poQty - po.rrQtyReceived)); }} className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900">{poList.map((po) => <option key={po.id} value={po.id}>{po.poNumber} — {po.vendorName} ({po.itemDescription})</option>)}</select></label><div className="grid gap-4 sm:grid-cols-2"><label className="space-y-1.5 text-xs font-bold text-slate-700">Receipt date<input readOnly value={receiptDate} className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600" /></label><label className="space-y-1.5 text-xs font-bold text-slate-700">Reference number<input readOnly value={referencePreview} className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 font-mono text-sm font-semibold text-slate-600" /></label></div></div>}
          {step === 2 && <div className="space-y-4"><div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold sm:grid-cols-2"><p><span className="block text-xs font-bold uppercase text-slate-500">Item</span><span className="font-black">{selectedPO?.itemDescription}</span></p><p><span className="block text-xs font-bold uppercase text-slate-500">Approved PO quantity</span><span className="font-black">{selectedPO?.poQty} units</span></p><p><span className="block text-xs font-bold uppercase text-slate-500">Previously received</span><span className="font-black">{selectedPO?.rrQtyReceived} units</span></p><p><span className="block text-xs font-bold uppercase text-emerald-700">Remaining allowed</span><span className="font-black text-emerald-800">{maxAllowed} units</span></p></div><div className="grid gap-4 sm:grid-cols-2"><label className="space-y-1.5 text-xs font-bold text-slate-700">Quantity received *<input type="number" min="1" max={maxAllowed > 0 ? maxAllowed : selectedPO?.poQty || 100} value={receivedQty} onChange={(event) => { setReceivedQty(Number(event.target.value)); setHardBlockError(null); }} className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-black text-slate-900" required /></label><label className="space-y-1.5 text-xs font-bold text-slate-700">Batch / lot number<input value={batchNumber} onChange={(event) => setBatchNumber(event.target.value)} className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-black text-slate-900" /></label></div><details className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><summary className="cursor-pointer text-sm font-black text-slate-800">Advanced options</summary><label className="mt-3 block space-y-1.5 text-xs font-bold text-slate-700">Equipment serial number<input value={serialNumber} onChange={(event) => setSerialNumber(event.target.value)} placeholder="Optional for equipment" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900" /></label><label className="mt-3 block space-y-1.5 text-xs font-bold text-slate-700">Internal notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={2} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900" /></label></details></div>}
          {step === 3 && <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs font-black uppercase tracking-wider text-slate-500">Review goods receipt</p><dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2"><div><dt className="text-xs font-bold text-slate-500">Purchase order</dt><dd className="font-mono font-black">{selectedPO?.poNumber}</dd></div><div><dt className="text-xs font-bold text-slate-500">Reference</dt><dd className="font-mono font-black">{referencePreview}</dd></div><div><dt className="text-xs font-bold text-slate-500">Quantity</dt><dd className="font-black">{receivedQty} of {selectedPO?.poQty} units</dd></div><div><dt className="text-xs font-bold text-slate-500">Batch / lot</dt><dd className="font-mono font-black">{batchNumber || 'Not provided'}</dd></div></dl><details className="mt-4 rounded-xl border border-slate-200 bg-white p-3"><summary className="cursor-pointer text-xs font-black">Advanced options</summary><p className="mt-2 text-xs text-slate-600">{serialNumber || 'No serial number provided.'}{notes ? ` · ${notes}` : ''}</p></details></div>}
          <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-4"><button type="button" onClick={step === 1 ? onClose : () => setStep((current) => current - 1)} className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-black text-slate-800 hover:bg-slate-200">{step === 1 ? 'Cancel' : <><ChevronLeft className="h-4 w-4" /> Back</>}</button>{step < 3 ? <button type="button" onClick={handleNext} className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-black text-white hover:bg-emerald-800">Continue <ChevronRight className="h-4 w-4" /></button> : <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-black text-white disabled:opacity-60"><Check className="h-4 w-4" /> {isSubmitting ? 'Submitting…' : 'Confirm goods receipt'}</button>}</div>
        </form>
      </div>
    </div>
  );
};
