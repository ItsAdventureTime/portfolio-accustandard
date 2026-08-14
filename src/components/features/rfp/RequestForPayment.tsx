'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Landmark,
  CheckCircle2,
  Clock,
  X,
  FileText,
  Eye,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { AccessibleModal } from '@/components/common/AccessibleModal';

interface RequestForPaymentProps {
  rfpList: any[];
  dataState?: 'loading' | 'live' | 'offline';
  onOpenAddRFP: () => void;
  onReleaseRFP?: (id: string, bank: string, refNo: string) => void | Promise<boolean | void>;
}

export const RequestForPayment: React.FC<RequestForPaymentProps> = ({
  rfpList,
  dataState = 'loading',
  onOpenAddRFP,
  onReleaseRFP,
}) => {
  const releaseEligibleStatuses = new Set(['APPROVED', 'APPROVED_DCS', 'PENDING_BANK_RELEASING']);
  const canRelease = (rfp: any) => releaseEligibleStatuses.has(String(rfp?.status || '').toUpperCase());
  const releaseBlockReason = (rfp: any) => {
    const status = String(rfp?.status || '').toUpperCase();
    if (!rfp?.id || !rfp?.rfpNo || !rfp?.payee || Number(rfp?.amount) <= 0) return 'Incomplete voucher data';
    if (status === 'REJECTED') return 'Rejected voucher';
    if (status === 'OVERDUE') return 'Overdue voucher';
    if (status === 'DISBURSED_PAID') return 'Already disbursed';
    if (status === 'PENDING' || status === 'PENDING_APPROVAL') return 'Awaiting approval';
    if (!canRelease(rfp)) return 'Not eligible for bank release';
    return '';
  };
  const [releasingRfp, setReleasingRfp] = useState<any | null>(null);
  const [inspectingRfp, setInspectingRfp] = useState<any | null>(null);
  const [bankSource, setBankSource] = useState('');
  const [refNo, setRefNo] = useState('');

  const handleConfirmRelease = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!releasingRfp) return;
    if (onReleaseRFP) {
      const committed = await onReleaseRFP(releasingRfp.id, bankSource, refNo);
      if (committed === false) return;
    }
    setReleasingRfp(null);
  };

  return (
    <div className="feature-module space-y-6 text-slate-900">
      {/* Module Title & Actions Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-purple-800" />
            Requests for payment
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
            GL Chart of Accounts Picklist &bull; Disbursement Approval Chain &bull; Bank Releasing
          </p>
          {dataState === 'offline' && <p className="mt-2 text-xs font-semibold text-amber-900">Offline demo preview — release actions remain unavailable unless the record is backend-eligible.</p>}
        </div>

        <button
          onClick={onOpenAddRFP}
          className="w-full sm:w-auto px-5 py-3 bg-blue-900 hover:bg-blue-800 hover:shadow-md text-white font-black text-xs sm:text-sm rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm shrink-0 active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create RFP Voucher</span>
        </button>
      </div>

      {/* Live RFP Vouchers Table */}
      <div className="wayfinding-card overflow-hidden">
        <div className="block sm:hidden text-[11px] text-slate-500 font-extrabold text-center py-1.5 bg-slate-100/90 border-b border-slate-200 uppercase tracking-wider">
          &larr; Swipe table horizontally for details &rarr;
        </div>
        <div className="table-responsive-wrapper">
          <table className="wayfinding-grid w-full text-left text-sm border-collapse">
            <caption className="sr-only">Requests for payment and bank release eligibility</caption>
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase text-xs">
              <tr>
                <th scope="col" className="p-4">RFP Voucher ID</th>
                <th scope="col" className="p-4">Payee / Vendor</th>
                <th scope="col" className="p-4">Date</th>
                <th scope="col" className="p-4 text-center">Status</th>
                <th scope="col" className="p-4 text-right">Amount</th>
                <th scope="col" className="p-4 text-center">Primary action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-semibold text-slate-800">
              {rfpList.map((rfp) => (
                <tr
                  key={rfp.id}
                  className="hover:bg-blue-50/50 transition group"
                >
                  <td className="p-4">
                    <button
                      type="button"
                      onClick={() => setInspectingRfp(rfp)}
                      className="font-extrabold font-mono text-purple-950 bg-purple-50/90 border border-purple-200/90 hover:bg-purple-900 hover:text-white px-3 py-1.5 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-2xs group cursor-pointer"
                      title="Click to inspect expense voucher & GL account details"
                    >
                      <FileText className="w-4 h-4 text-purple-700 group-hover:text-purple-200 shrink-0" />
                      <span>{rfp.rfpNo}</span>
                      <Eye className="w-3.5 h-3.5 text-purple-600 group-hover:text-white shrink-0 ml-0.5 opacity-80 group-hover:opacity-100" />
                    </button>
                  </td>
                  <td className="p-4 font-bold text-slate-900">{rfp.payee}</td>
                  <td className="p-4 text-xs font-semibold text-slate-700">{rfp.createdAt || rfp.requestedDate || '—'}</td>
                  <td className="p-4 text-center">
                    {rfp.status === 'DISBURSED_PAID' ? <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-900">Paid</span> : canRelease(rfp) ? <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-extrabold text-blue-950">Ready for release</span> : <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-extrabold text-amber-900">Blocked</span>}
                  </td>
                  <td className="p-4 text-right font-mono font-extrabold text-slate-900">
                    ₱{Number(rfp.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4 text-center">
                    {canRelease(rfp) ? (
                      <button type="button" onClick={() => setReleasingRfp(rfp)} className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-emerald-700 px-3 py-2 text-xs font-extrabold text-white shadow-2xs transition hover:bg-emerald-800"><Landmark className="w-3.5 h-3.5" /> {dataState === 'live' ? 'Release fund' : 'Preview release'}</button>
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <button type="button" onClick={() => setInspectingRfp(rfp)} className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"><Eye className="h-4 w-4" /> Inspect</button>
                        <span className="text-[11px] font-medium text-slate-500">{releaseBlockReason(rfp)}</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {dataState === 'loading' && <p className="px-4 py-8 text-sm font-medium text-slate-600" role="status">Loading payment requests…</p>}
        {dataState !== 'loading' && rfpList.length === 0 && <p className="px-4 py-8 text-sm font-medium text-slate-600" role="status">No payment requests returned. Create a voucher only when its source documents are available.</p>}
      </div>

      {/* Fund Release Modal */}
      {releasingRfp && (
        <AccessibleModal
          isOpen={Boolean(releasingRfp)}
          onClose={() => setReleasingRfp(null)}
          title={`Fund release: ${releasingRfp.rfpNo}`}
          description="Confirm bank release details for an eligible payment request."
          contentClassName="text-slate-900"
        >
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-5 border border-slate-300 animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200 ease-out text-slate-900 text-xs sm:text-sm">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-700 text-white rounded-xl">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase text-slate-900">Fund Releasing — {releasingRfp.rfpNo}</h3>
                  <p className="text-slate-500 font-medium">Select Admin Bank Account &amp; Reference No.</p>
                </div>
              </div>
              <button onClick={() => setReleasingRfp(null)} className="p-1 text-slate-400 hover:text-slate-700 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmRelease} className="space-y-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <p><span className="font-bold">Payee:</span> {releasingRfp.payee}</p>
                <p><span className="font-bold">Amount:</span> ₱{Number(releasingRfp.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                <p><span className="font-bold">GL:</span> {releasingRfp.glAccount}</p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Admin Bank Fund Source *</label>
                <input
                  type="text"
                  required
                  value={bankSource}
                  onChange={(e) => setBankSource(e.target.value)}
                  placeholder="Enter configured bank account"
                  className="w-full bg-slate-50 border border-slate-300 font-bold rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Check / Online Reference Number *</label>
                <input
                  type="text"
                  value={refNo}
                  onChange={(e) => setRefNo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 font-bold rounded-xl px-3 py-2 text-xs focus:outline-none"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setReleasingRfp(null)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>{dataState === 'live' ? 'Confirm fund release' : 'Preview fund release'}</span>
                </button>
              </div>
            </form>
          </div>
        </AccessibleModal>
      )}

      {/* RFP Detail Inspector Modal Overlay */}
      {inspectingRfp && (
        <AccessibleModal
          isOpen={Boolean(inspectingRfp)}
          onClose={() => setInspectingRfp(null)}
          title={`RFP details: ${inspectingRfp.rfpNo}`}
          description="Inspect payment request status and release eligibility."
          contentClassName="text-slate-900"
        >
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 border border-slate-300 animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200 ease-out text-slate-900 text-sm">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-900 text-white rounded-2xl shadow-sm">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black uppercase text-slate-900 tracking-wider">
                    RFP Breakdown: {inspectingRfp.rfpNo}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">Payee: {inspectingRfp.payee}</p>
                </div>
              </div>
              <button
                onClick={() => setInspectingRfp(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* RFP Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-sm">
              <div>
                <span className="text-slate-500 font-bold block text-xs uppercase tracking-wider">GL Chart of Accounts</span>
                <span className="font-extrabold text-slate-900 text-base">{inspectingRfp.glAccount}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block text-xs uppercase tracking-wider">Requested By</span>
                <span className="font-extrabold text-slate-800 text-base">{inspectingRfp.requestedBy}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block text-xs uppercase tracking-wider">Total Voucher Amount</span>
                <span className="font-mono font-black text-purple-950 text-lg">
                  ₱{Number(inspectingRfp.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block text-xs uppercase tracking-wider">Disbursement Status</span>
                <span className={`font-black text-sm sm:text-base ${inspectingRfp.status === 'DISBURSED_PAID' ? 'text-purple-800' : 'text-amber-900'}`}>
                  {inspectingRfp.status === 'DISBURSED_PAID' ? '✓ DISBURSED & PAID' : canRelease(inspectingRfp) ? 'ELIGIBLE FOR BANK RELEASE' : releaseBlockReason(inspectingRfp).toUpperCase()}
                </span>
              </div>
              {inspectingRfp.releasedBank && (
                <div className="sm:col-span-2 flex justify-between items-center border-t border-slate-200 pt-3 mt-1">
                  <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">Released Bank / Ref:</span>
                  <span className="font-mono text-purple-900 font-extrabold text-base">
                    {inspectingRfp.releasedBank} ({inspectingRfp.releasedRefNo})
                  </span>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="pt-4 flex justify-between items-center border-t border-slate-200 gap-3">
              {canRelease(inspectingRfp) ? (
                <button
                  type="button"
                  onClick={() => {
                    const target = inspectingRfp;
                    setInspectingRfp(null);
                    setReleasingRfp(target);
                  }}
                  className="px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs sm:text-sm rounded-2xl transition flex items-center gap-2 shadow-md active:scale-95 cursor-pointer"
                >
                  <Landmark className="w-4 h-4" />
                  <span>{dataState === 'live' ? 'Release fund now' : 'Preview release'}</span>
                </button>
              ) : (
                <span className="text-xs sm:text-sm text-slate-700 font-extrabold flex items-center gap-1.5">
                  <CheckCircle2 className="w-5 h-5 text-purple-700" />
                  {releaseBlockReason(inspectingRfp)}
                </span>
              )}

              <button
                type="button"
                onClick={() => setInspectingRfp(null)}
                className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 font-extrabold text-xs sm:text-sm rounded-2xl transition cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </AccessibleModal>
      )}
    </div>
  );
};
