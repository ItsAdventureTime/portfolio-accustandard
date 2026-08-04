'use client';

import React from 'react';
import {
  ShieldCheck,
  Building2,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  FileCheck,
  Camera,
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
  const pendingApprovalsCount = approvalsList.filter(
    (item) =>
      item.reviewerStatus === 'PENDING' ||
      item.gmStatus === 'PENDING' ||
      item.dcsStatus === 'PENDING'
  ).length;

  const totalArBalance = soaRows.reduce((acc, row) => acc + row.totalBalance, 0);
  const lowStockSkus = inventoryList.filter((item) => item.available < 50);

  return (
    <div className="space-y-6 text-slate-900">
      {/* Banner / Overview Title */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-6 rounded-2xl shadow-md border border-blue-950 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
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

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onSelectTab('inventory')}
            className="px-4 py-2.5 bg-white text-blue-950 hover:bg-slate-100 font-extrabold text-sm rounded-xl transition flex items-center gap-2 shadow-sm"
          >
            <span>View Warehouses</span>
            <ArrowRight className="w-4 h-4 text-blue-700" />
          </button>
        </div>
      </div>

      {/* KPI Metric Cards (Large Readable Typography) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Approvals Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Pending Approvals</span>
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{pendingApprovalsCount}</span>
            <span className="text-xs font-extrabold text-amber-700">Awaiting Action</span>
          </div>
          <p className="text-xs text-slate-600 font-medium">Across Sales Quotes, POs &amp; RFPs</p>
        </div>

        {/* Total Accounts Receivable Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Accounts Receivable</span>
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-900">
              ₱{totalArBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-xs text-slate-600 font-medium">{soaRows.length} Active SOA Client Invoices</p>
        </div>

        {/* Low Stock SKUs Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Low Stock SKUs</span>
            <div className="p-2 bg-red-100 text-red-700 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{lowStockSkus.length}</span>
            <span className="text-xs font-extrabold text-red-700">Items &lt; 50 units</span>
          </div>
          <p className="text-xs text-slate-600 font-medium">QC &amp; Pampanga Warehouses</p>
        </div>

        {/* Unverified POs Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Unverified POs</span>
            <div className="p-2 bg-indigo-100 text-indigo-800 rounded-xl">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{poList.length}</span>
            <span className="text-xs font-extrabold text-indigo-800">Pending 3-Way Match</span>
          </div>
          <p className="text-xs text-slate-600 font-medium">Supplier PO &harr; RR &harr; Invoice</p>
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
            onClick={() => onSelectTab('quotations')}
            className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs rounded-xl transition shadow-sm"
          >
            + Create New Quotation
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-xs">
              <tr>
                <th className="p-4">Document QRN / ID</th>
                <th className="p-4">Type</th>
                <th className="p-4">Maker</th>
                <th className="p-4 text-center">Reviewer</th>
                <th className="p-4 text-center">GM Approval</th>
                <th className="p-4 text-center">DCS (Chairman)</th>
                <th className="p-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-semibold text-slate-800">
              {approvalsList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="p-4 font-extrabold font-mono text-blue-900">{item.qrn}</td>
                  <td className="p-4 text-xs font-bold text-slate-600">{item.type}</td>
                  <td className="p-4 text-xs text-slate-700">{item.maker}</td>

                  {/* Stage 1: Reviewer */}
                  <td className="p-4 text-center">
                    {item.reviewerStatus === 'APPROVED' ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-extrabold flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                      </span>
                    ) : (
                      <button
                        onClick={() => onApproveItem(item.id, 'reviewer')}
                        className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-full text-xs font-extrabold transition"
                      >
                        Approve (Reviewer)
                      </button>
                    )}
                  </td>

                  {/* Stage 2: GM */}
                  <td className="p-4 text-center">
                    {item.gmStatus === 'APPROVED' ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-extrabold flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                      </span>
                    ) : (
                      <button
                        onClick={() => onApproveItem(item.id, 'gm')}
                        className="px-2.5 py-1 bg-blue-100 hover:bg-blue-200 text-blue-950 rounded-full text-xs font-extrabold transition"
                      >
                        Approve (GM)
                      </button>
                    )}
                  </td>

                  {/* Stage 3: DCS Chairman */}
                  <td className="p-4 text-center">
                    {item.dcsStatus === 'APPROVED' ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-extrabold flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                      </span>
                    ) : (
                      <button
                        onClick={() => onApproveItem(item.id, 'dcs')}
                        className="px-2.5 py-1 bg-purple-100 hover:bg-purple-200 text-purple-950 rounded-full text-xs font-extrabold transition"
                      >
                        Approve (DCS)
                      </button>
                    )}
                  </td>

                  <td className="p-4 text-right font-mono font-bold text-slate-900">
                    ₱{item.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
