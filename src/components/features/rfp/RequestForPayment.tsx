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

interface RequestForPaymentProps {
  rfpList: any[];
  onOpenAddRFP: () => void;
  onReleaseRFP?: (id: string, bank: string, refNo: string) => void;
}

export const RequestForPayment: React.FC<RequestForPaymentProps> = ({
  rfpList,
  onOpenAddRFP,
  onReleaseRFP,
}) => {
  const [releasingRfp, setReleasingRfp] = useState<any | null>(null);
  const [inspectingRfp, setInspectingRfp] = useState<any | null>(null);
  const [bankSource, setBankSource] = useState('BDO Unibank — Corporate Acct #0012-9981-00');
  const [refNo, setRefNo] = useState('TXN-BDO-2026-9012');

  const handleConfirmRelease = (e: React.FormEvent) => {
    e.preventDefault();
    if (!releasingRfp) return;
    if (onReleaseRFP) {
      onReleaseRFP(releasingRfp.id, bankSource, refNo);
    }
    setReleasingRfp(null);
  };

  return (
    <div className="space-y-6 text-slate-900">
      {/* Module Title & Actions Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-purple-800" />
            Request for Payment (RFP) Non-PO Expense Vouchers
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
            GL Chart of Accounts Picklist &bull; Disbursement Approval Chain &bull; Bank Releasing
          </p>
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
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="block sm:hidden text-[11px] text-slate-500 font-extrabold text-center py-1.5 bg-slate-100/90 border-b border-slate-200 uppercase tracking-wider">
          &larr; Swipe table horizontally for details &rarr;
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-xs">
              <tr>
                <th className="p-4">RFP Voucher ID</th>
                <th className="p-4">Payee / Vendor</th>
                <th className="p-4">GL Account Description</th>
                <th className="p-4">Requested By</th>
                <th className="p-4 text-right">Amount</th>
                <th className="p-4 text-center">Status / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-semibold text-slate-800">
              {rfpList.map((rfp) => (
                <tr key={rfp.id} className="hover:bg-blue-50/50 transition group">
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
                  <td className="p-4 text-xs font-semibold text-slate-700">{rfp.glAccount}</td>
                  <td className="p-4 text-xs font-semibold text-slate-700">{rfp.requestedBy}</td>
                  <td className="p-4 text-right font-mono font-extrabold text-slate-900">
                    ₱{rfp.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4 text-center">
                    {rfp.status === 'DISBURSED_PAID' ? (
                      <span className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-900 border border-purple-300 font-extrabold text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-700" /> Disbursed ({rfp.releasedBank?.split(' ')[0] || 'Paid'})
                      </span>
                    ) : (
                      <button
                        onClick={() => setReleasingRfp(rfp)}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl transition inline-flex items-center gap-1 shadow-2xs"
                      >
                        <Landmark className="w-3.5 h-3.5" />
                        <span>Release Fund</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fund Release Modal */}
      {releasingRfp && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto text-slate-900 animate-in fade-in duration-200">
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
                <p><span className="font-bold">Amount:</span> ₱{releasingRfp.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                <p><span className="font-bold">GL:</span> {releasingRfp.glAccount}</p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Admin Bank Fund Source *</label>
                <select
                  value={bankSource}
                  onChange={(e) => setBankSource(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 font-bold rounded-xl px-3 py-2 text-xs focus:outline-none"
                >
                  <option value="BDO Unibank — Corporate Acct #0012-9981-00">BDO Unibank — Corporate Acct #0012-9981-00</option>
                  <option value="Metrobank — Operating Acct #0293-1102-44">Metrobank — Operating Acct #0293-1102-44</option>
                  <option value="BPI — Treasury Acct #0091-2283-11">BPI — Treasury Acct #0091-2283-11</option>
                </select>
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
                  <span>Confirm Fund Release</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RFP Detail Inspector Modal Overlay */}
      {inspectingRfp && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto text-slate-900 animate-in fade-in duration-200">
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
                  {inspectingRfp.status === 'DISBURSED_PAID' ? '✓ DISBURSED & PAID' : 'PENDING BANK RELEASING'}
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
              {inspectingRfp.status !== 'DISBURSED_PAID' ? (
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
                  <span>Release Fund Now</span>
                </button>
              ) : (
                <span className="text-xs sm:text-sm text-purple-900 font-extrabold flex items-center gap-1.5">
                  <CheckCircle2 className="w-5 h-5 text-purple-700" />
                  Fund Disbursed
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
        </div>
      )}
    </div>
  );
};

