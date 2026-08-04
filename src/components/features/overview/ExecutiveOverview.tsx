'use client';

import React from 'react';
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Package,
  FileText,
  CreditCard,
  Building2,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

interface ExecutiveOverviewProps {
  approvalsList: any[];
  inventoryList: any[];
  soaRows: any[];
  poList: any[];
  rfpList: any[];
  viewAsRole: string;
  onApproveItem: (id: string, stage: string) => void;
  onSelectTab: (tabKey: string) => void;
  onOpenScanner: () => void;
}

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({
  approvalsList,
  inventoryList,
  soaRows,
  poList,
  rfpList,
  viewAsRole,
  onApproveItem,
  onSelectTab,
  onOpenScanner,
}) => {
  // Compute Key Metrics
  const pendingApprovalsCount = approvalsList.filter(
    (a) => a.reviewerStatus === 'PENDING' || a.gmStatus === 'PENDING' || a.dcsStatus === 'PENDING'
  ).length;

  const lowStockCount = inventoryList.filter((i) => i.onHand <= 50).length;
  const totalSOABalance = soaRows.reduce((acc, r) => acc + (r.invoiceBalance || 0), 0);
  const unverifiedPOCount = poList.filter((p) => p.status !== 'VERIFIED_3WAY').length;

  return (
    <div className="space-y-6">
      {/* COSO Control & Role Status Banner */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-900 via-slate-900 to-slate-900 rounded-2xl border border-blue-800/80 shadow-lg text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-blue-600/80 text-blue-100 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-blue-400/40">
              COSO Internal Control System
            </span>
            <span className="text-xs text-slate-300 font-semibold">• Active Role: <strong className="text-white">{viewAsRole}</strong></span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white">Executive Control &amp; Operations Pipeline</h2>
          <p className="text-xs text-slate-300">
            Enforcing Segregation of Duties (Maker → Reviewer → GM → DCS Chairman) across Accustandard RxD operations.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto">
          <button
            onClick={() => onSelectTab('inventory')}
            className="flex-1 md:flex-initial px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl transition shadow-md flex items-center justify-center gap-1.5"
          >
            <span>View Warehouses</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2 hover:border-blue-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Approvals</span>
            <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{pendingApprovalsCount}</span>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Awaiting Action</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Across Sales Quotes, POs &amp; RFPs</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2 hover:border-emerald-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Accounts Receivable</span>
            <div className="p-2 bg-purple-50 text-purple-700 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">₱{totalSOABalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">{soaRows.length} Active SOA Client Invoices</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2 hover:border-amber-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Low Stock SKUs</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{lowStockCount}</span>
            <span className="text-xs font-bold text-slate-600">Items &le; 50 units</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">QC &amp; Pampanga Warehouses</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2 hover:border-red-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Unverified POs</span>
            <div className="p-2 bg-red-50 text-red-700 rounded-xl">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{unverifiedPOCount}</span>
            <span className="text-xs font-bold text-slate-600">Pending 3-Way Match</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Supplier PO ↔ RR ↔ Invoice</p>
        </div>
      </div>

      {/* COSO 4-Layer Approval Pipeline Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-0">
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-700" />
              COSO 4-Layer Approval Chain Pipeline
            </h3>
            <p className="text-xs text-slate-500 font-medium">Maker &rarr; Reviewer (Marketing) &rarr; GM &rarr; DCS (Chairman)</p>
          </div>

          <button
            onClick={() => onSelectTab('quotations')}
            className="px-3.5 py-1.5 bg-blue-900 text-white font-bold rounded-xl text-xs hover:bg-blue-800 transition"
          >
            + Create New Quotation
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3">Document QRN / ID</th>
                <th className="p-3">Type</th>
                <th className="p-3">Maker</th>
                <th className="p-3 text-center">Reviewer</th>
                <th className="p-3 text-center">GM Approval</th>
                <th className="p-3 text-center">DCS (Chairman)</th>
                <th className="p-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
              {approvalsList.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-3 font-mono font-bold text-blue-900 whitespace-nowrap">{app.qrn}</td>
                  <td className="p-3 whitespace-nowrap">{app.type}</td>
                  <td className="p-3 font-semibold whitespace-nowrap">{app.maker}</td>

                  {/* Stage 1: Reviewer */}
                  <td className="p-3 text-center whitespace-nowrap">
                    {app.reviewerStatus === 'APPROVED' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Approved
                      </span>
                    ) : (
                      <button
                        onClick={() => onApproveItem(app.id, 'reviewer')}
                        className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold text-[10px] rounded-lg transition"
                      >
                        Approve (Reviewer)
                      </button>
                    )}
                  </td>

                  {/* Stage 2: GM */}
                  <td className="p-3 text-center whitespace-nowrap">
                    {app.gmStatus === 'APPROVED' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Approved
                      </span>
                    ) : (
                      <button
                        onClick={() => onApproveItem(app.id, 'gm')}
                        className="px-2.5 py-1 bg-blue-100 hover:bg-blue-200 text-blue-900 font-extrabold text-[10px] rounded-lg transition"
                      >
                        Approve (GM)
                      </button>
                    )}
                  </td>

                  {/* Stage 3: DCS Chairman */}
                  <td className="p-3 text-center whitespace-nowrap">
                    {app.dcsStatus === 'APPROVED' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Approved
                      </span>
                    ) : (
                      <button
                        onClick={() => onApproveItem(app.id, 'dcs')}
                        className="px-2.5 py-1 bg-purple-100 hover:bg-purple-200 text-purple-900 font-extrabold text-[10px] rounded-lg transition"
                      >
                        Approve (DCS)
                      </button>
                    )}
                  </td>

                  <td className="p-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                    ₱{app.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
