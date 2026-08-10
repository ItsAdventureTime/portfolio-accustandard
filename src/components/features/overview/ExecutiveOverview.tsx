'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Send,
  Lock,
  Database,
  RefreshCw,
  X,
  FileText,
  Eye,
  ExternalLink,
} from 'lucide-react';

interface ExecutiveOverviewProps {
  approvalsList: any[];
  inventoryList: any[];
  soaRows: any[];
  poList: any[];
  rfpList: any[];
  qboQueue?: any[];
  viewAsRole: string;
  onApproveItem: (id: string, stage: string) => void;
  onSelectTab: (tabKey: string) => void;
  onOpenScanner: () => void;
  onOpenQBOQueue?: () => void;
  onOpenCreateQuotationModal?: () => void;
}

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({
  approvalsList,
  inventoryList,
  soaRows,
  poList,
  rfpList,
  qboQueue = [],
  viewAsRole,
  onApproveItem,
  onSelectTab,
  onOpenScanner,
  onOpenQBOQueue,
  onOpenCreateQuotationModal,
}) => {
  const [selectedDocModal, setSelectedDocModal] = useState<any | null>(null);

  const pendingApprovalsCount = approvalsList.filter(
    (item) =>
      item.reviewerStatus === 'PENDING' ||
      item.gmStatus === 'PENDING' ||
      item.dcsStatus === 'PENDING'
  ).length;

  const totalArBalance = (soaRows || []).reduce(
    (acc, row) => acc + (Number(row.totalBalance) || Number(row.runningBalance) || Number(row.invoiceBalance) || 0),
    0
  );

  const lowStockSkus = (inventoryList || []).filter((item) => (item.available || item.onHand) < 50);

  // Role Approval Eligibility Checks
  const canApproveReviewer = ['Admin', 'Marketing', 'General Manager', 'Chairman (DCS)'].includes(viewAsRole);
  const canApproveGM = ['Admin', 'General Manager', 'Chairman (DCS)'].includes(viewAsRole);
  const canApproveDCS = ['Admin', 'Chairman (DCS)'].includes(viewAsRole);

  return (
    <div className="space-y-6 text-slate-900">
      {/* Banner / Overview Title */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-6 rounded-2xl shadow-md border border-blue-950 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="bg-red-600 text-white font-extrabold text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              COSO Internal Control System
            </span>
            <span className="text-blue-200 text-xs font-bold">&bull; Active Role: {viewAsRole}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Executive Control &amp; Operations Pipeline
          </h1>
          <p className="text-sm text-blue-100 font-medium mt-1">
            Enforcing Segregation of Duties (Maker &rarr; Reviewer &rarr; GM &rarr; DCS Chairman) across Accustandard Medical operations.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {onOpenQBOQueue && (
            <button
              onClick={onOpenQBOQueue}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-xl transition flex items-center gap-2 shadow-sm"
            >
              <Database className="w-4 h-4 text-emerald-200" />
              <span>QBO Sync Queue ({qboQueue.length})</span>
            </button>
          )}

          <button
            onClick={() => onSelectTab('inventory')}
            className="px-4 py-2.5 bg-white text-blue-950 hover:bg-slate-100 font-extrabold text-sm rounded-xl transition flex items-center gap-2 shadow-sm"
          >
            <span>View Warehouses</span>
            <ArrowRight className="w-4 h-4 text-blue-700" />
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Approvals Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 space-y-3 h-full flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Pending Approvals</span>
            <div className="p-2.5 bg-amber-100/90 text-amber-800 rounded-xl shadow-2xs">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900">{pendingApprovalsCount}</span>
              <span className="text-xs font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">Awaiting Action</span>
            </div>
            <p className="text-xs text-slate-600 font-bold mt-1">Across Sales Quotes, POs &amp; RFPs</p>
          </div>
        </div>

        {/* Total Accounts Receivable Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 space-y-3 h-full flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Accounts Receivable</span>
            <div className="p-2.5 bg-emerald-100/90 text-emerald-800 rounded-xl shadow-2xs">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-950">
                ₱{totalArBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-bold mt-1">{(soaRows || []).length} Active SOA Client Invoices</p>
          </div>
        </div>

        {/* Low Stock SKUs Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 space-y-3 h-full flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Low Stock SKUs</span>
            <div className="p-2.5 bg-red-100/90 text-red-700 rounded-xl shadow-2xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900">{lowStockSkus.length}</span>
              <span className="text-xs font-black text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">Items &lt; 50 units</span>
            </div>
            <p className="text-xs text-slate-600 font-bold mt-1">QC &amp; Pampanga Warehouses</p>
          </div>
        </div>

        {/* Unverified POs Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 space-y-3 h-full flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Unverified POs</span>
            <div className="p-2.5 bg-indigo-100/90 text-indigo-800 rounded-xl shadow-2xs">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900">{(poList || []).length}</span>
              <span className="text-xs font-black text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">Pending Match</span>
            </div>
            <p className="text-xs text-slate-600 font-bold mt-1">Supplier PO &harr; RR &harr; Invoice</p>
          </div>
        </div>
      </div>

      {/* COSO 4-Layer Approval Pipeline Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-3">
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-base font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-800" />
              COSO 4-Layer Approval Chain Pipeline
            </h2>
            <p className="text-xs text-slate-600 font-semibold mt-0.5">
              Maker &rarr; Reviewer (Marketing) &rarr; GM &rarr; DCS (Chairman)
            </p>
          </div>

          <button
            onClick={() => {
              if (onOpenCreateQuotationModal) {
                onOpenCreateQuotationModal();
              } else {
                onSelectTab('quotations');
              }
            }}
            className="px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs rounded-xl transition shadow-sm flex items-center gap-1.5 active:scale-95"
          >
            <Send className="w-4 h-4 text-blue-200" />
            <span>+ Create New Quotation</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200 uppercase text-xs tracking-wider">
              <tr>
                <th className="p-4">Document QRN / ID</th>
                <th className="p-4">Type</th>
                <th className="p-4">Maker</th>
                <th className="p-4 text-center">Reviewer Stage</th>
                <th className="p-4 text-center">GM Approval Stage</th>
                <th className="p-4 text-center">DCS (Chairman) Stage</th>
                <th className="p-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-semibold text-slate-800">
              {approvalsList.map((item) => {
                const isReviewerApproved = item.reviewerStatus === 'APPROVED';
                const isGmApproved = item.gmStatus === 'APPROVED';
                const isDcsApproved = item.dcsStatus === 'APPROVED';

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => setSelectedDocModal(item)}
                        className="font-extrabold font-mono text-blue-950 bg-blue-50/90 border border-blue-200/90 hover:bg-blue-900 hover:text-white px-3 py-1.5 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-2xs group cursor-pointer"
                        title="Click to inspect complete document breakdown & approval status"
                      >
                        <FileText className="w-4 h-4 text-blue-700 group-hover:text-blue-200 shrink-0" />
                        <span>{item.qrn}</span>
                        <Eye className="w-3.5 h-3.5 text-blue-600 group-hover:text-white shrink-0 ml-0.5 opacity-80 group-hover:opacity-100" />
                      </button>
                    </td>
                    <td className="p-4 text-xs font-bold text-slate-600">{item.type}</td>
                    <td className="p-4 text-xs text-slate-700">{item.maker}</td>

                    {/* Stage 1: Reviewer */}
                    <td className="p-4 text-center">
                      {isReviewerApproved ? (
                        <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-bold text-xs shadow-2xs w-full max-w-[130px] mx-auto">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Approved</span>
                        </span>
                      ) : canApproveReviewer ? (
                        <button
                          onClick={() => onApproveItem(item.id, 'reviewer')}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 active:scale-[0.97] text-white font-bold text-xs rounded-lg shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-1.5 border border-amber-600/80 w-full max-w-[130px] mx-auto"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Approve Reviewer</span>
                        </button>
                      ) : (
                        <span
                          onClick={() => onApproveItem(item.id, 'reviewer')}
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-400 border border-slate-200 font-medium text-xs w-full max-w-[130px] mx-auto cursor-pointer hover:bg-slate-200/60 transition"
                          title={`Role [${viewAsRole}] cannot execute Reviewer Approval`}
                        >
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Role Locked</span>
                        </span>
                      )}
                    </td>

                    {/* Stage 2: GM */}
                    <td className="p-4 text-center">
                      {isGmApproved ? (
                        <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-bold text-xs shadow-2xs w-full max-w-[130px] mx-auto">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Approved</span>
                        </span>
                      ) : !isReviewerApproved ? (
                        <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-500 border border-slate-200 font-medium text-xs w-full max-w-[130px] mx-auto cursor-not-allowed">
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Awaiting Reviewer</span>
                        </span>
                      ) : canApproveGM ? (
                        <button
                          onClick={() => onApproveItem(item.id, 'gm')}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.97] text-white font-bold text-xs rounded-lg shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-1.5 border border-blue-700/80 w-full max-w-[130px] mx-auto"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Approve GM</span>
                        </button>
                      ) : (
                        <span
                          onClick={() => onApproveItem(item.id, 'gm')}
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-400 border border-slate-200 font-medium text-xs w-full max-w-[130px] mx-auto cursor-pointer hover:bg-slate-200/60 transition"
                          title={`Role [${viewAsRole}] cannot execute GM Approval`}
                        >
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Role Locked</span>
                        </span>
                      )}
                    </td>

                    {/* Stage 3: DCS Chairman */}
                    <td className="p-4 text-center">
                      {isDcsApproved ? (
                        <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-bold text-xs shadow-2xs w-full max-w-[130px] mx-auto">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Approved</span>
                        </span>
                      ) : !isGmApproved ? (
                        <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-500 border border-slate-200 font-medium text-xs w-full max-w-[130px] mx-auto cursor-not-allowed">
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Awaiting GM</span>
                        </span>
                      ) : canApproveDCS ? (
                        <button
                          onClick={() => onApproveItem(item.id, 'dcs')}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.97] text-white font-bold text-xs rounded-lg shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-1.5 border border-indigo-700/80 w-full max-w-[130px] mx-auto"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Approve DCS</span>
                        </button>
                      ) : (
                        <span
                          onClick={() => onApproveItem(item.id, 'dcs')}
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-400 border border-slate-200 font-medium text-xs w-full max-w-[130px] mx-auto cursor-pointer hover:bg-slate-200/60 transition"
                          title={`Role [${viewAsRole}] cannot execute DCS Chairman Approval`}
                        >
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Role Locked</span>
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-right font-mono font-bold text-slate-900">
                      ₱{item.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Inspector Modal Overlay */}
      {selectedDocModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto text-slate-900 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 border border-slate-300 animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200 ease-out text-slate-900 text-sm">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-900 text-white rounded-2xl shadow-sm">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <span>Document Inspector: {selectedDocModal.qrn}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">{selectedDocModal.type} &bull; Originator: {selectedDocModal.maker}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDocModal(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Document Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold">
              <div>
                <span className="text-slate-500 font-bold block text-xs uppercase tracking-wider">Document Type</span>
                <span className="font-extrabold text-blue-950 text-base">{selectedDocModal.type}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block text-xs uppercase tracking-wider">Total Transaction Value</span>
                <span className="font-mono font-black text-emerald-800 text-lg">
                  ₱{Number(selectedDocModal.totalAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block text-xs uppercase tracking-wider">Maker / Originator</span>
                <span className="font-extrabold text-slate-900 text-sm sm:text-base">{selectedDocModal.maker}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block text-xs uppercase tracking-wider">COSO Internal Control Status</span>
                <span className="font-extrabold text-amber-900 text-sm sm:text-base">
                  {selectedDocModal.dcsStatus === 'APPROVED'
                    ? '✓ Fully Approved (DCS Chairman)'
                    : selectedDocModal.gmStatus === 'APPROVED'
                    ? 'Awaiting DCS Chairman Approval'
                    : selectedDocModal.reviewerStatus === 'APPROVED'
                    ? 'Awaiting GM Approval'
                    : 'Awaiting Reviewer (Marketing) Approval'}
                </span>
              </div>
            </div>

            {/* Step-by-Step Approval Pipeline Progress */}
            <div className="space-y-3 border-t border-slate-200 pt-4">
              <span className="font-black uppercase text-xs text-slate-700 tracking-wider block">
                COSO 4-Layer Approval Pipeline Status Tracker
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs font-bold">
                {/* Step 1 */}
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                  <p className="font-extrabold text-sm">1. Maker</p>
                  <p className="text-xs text-emerald-700 font-bold">Created</p>
                </div>

                {/* Step 2 */}
                <div className={`p-3.5 rounded-2xl border space-y-1 ${selectedDocModal.reviewerStatus === 'APPROVED' ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-amber-50 border-amber-300 text-amber-950'}`}>
                  {selectedDocModal.reviewerStatus === 'APPROVED' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                  ) : (
                    <Clock className="w-5 h-5 text-amber-600 mx-auto animate-pulse" />
                  )}
                  <p className="font-extrabold text-sm">2. Reviewer</p>
                  <p className="text-xs font-bold">{selectedDocModal.reviewerStatus}</p>
                </div>

                {/* Step 3 */}
                <div className={`p-3.5 rounded-2xl border space-y-1 ${selectedDocModal.gmStatus === 'APPROVED' ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : selectedDocModal.reviewerStatus === 'APPROVED' ? 'bg-amber-50 border-amber-300 text-amber-950' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                  {selectedDocModal.gmStatus === 'APPROVED' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                  ) : (
                    <Clock className="w-5 h-5 text-slate-400 mx-auto" />
                  )}
                  <p className="font-extrabold text-sm">3. GM</p>
                  <p className="text-xs font-bold">{selectedDocModal.gmStatus}</p>
                </div>

                {/* Step 4 */}
                <div className={`p-3.5 rounded-2xl border space-y-1 ${selectedDocModal.dcsStatus === 'APPROVED' ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : selectedDocModal.gmStatus === 'APPROVED' ? 'bg-amber-50 border-amber-300 text-amber-950' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                  {selectedDocModal.dcsStatus === 'APPROVED' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                  ) : (
                    <Clock className="w-5 h-5 text-slate-400 mx-auto" />
                  )}
                  <p className="font-extrabold text-sm">4. DCS</p>
                  <p className="text-xs font-bold">{selectedDocModal.dcsStatus}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-4 flex justify-between items-center border-t border-slate-200 gap-3">
              <button
                type="button"
                onClick={() => {
                  const targetTab = selectedDocModal.type.includes('Quotation') ? 'quotations' : selectedDocModal.type.includes('Purchase') ? 'purchasing' : 'rfp';
                  setSelectedDocModal(null);
                  onSelectTab(targetTab);
                }}
                className="px-5 py-3 bg-blue-900 hover:bg-blue-800 text-white font-black text-xs sm:text-sm rounded-2xl transition flex items-center gap-2 shadow-md active:scale-95 cursor-pointer"
              >
                <ExternalLink className="w-4 h-4 text-blue-200" />
                <span>Open Module Workspace</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedDocModal(null)}
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
