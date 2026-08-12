'use client';

import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  FileText,
  Lock,
  ShieldCheck,
  X,
} from 'lucide-react';
import { RoleActionCenter } from '@/components/features/overview/RoleActionCenter';

interface ExecutiveOverviewProps {
  approvalsList: any[];
  inventoryList: any[];
  soaRows: any[];
  poList: any[];
  rfpList: any[];
  rfqList?: any[];
  qboQueue?: any[];
  quotationsList?: any[];
  collectionsList?: any[];
  viewAsRole: string;
  onApproveItem: (id: string, stage: string) => void;
  onSelectTab: (tabKey: string) => void;
  onOpenQBOQueue?: () => void;
  onOpenCreateQuotationModal?: () => void;
}

type ApprovalStage = 'reviewer' | 'gm' | 'dcs';

const stageLabel: Record<ApprovalStage, string> = {
  reviewer: 'Reviewer',
  gm: 'GM',
  dcs: 'DCS',
};

const getNextApprovalStage = (item: any): ApprovalStage | null => {
  if (item.reviewerStatus === 'PENDING') return 'reviewer';
  if (item.gmStatus === 'PENDING') return 'gm';
  if (item.type !== 'Sales Quotation' && item.dcsStatus === 'PENDING') return 'dcs';
  return null;
};

const canApproveStage = (role: string, stage: ApprovalStage, item: any) => {
  if (stage === 'reviewer') return ['Admin', 'Marketing'].includes(role) || (role === 'Bookkeeper' && item.type === 'Purchase Order');
  if (stage === 'gm') return ['Admin', 'General Manager'].includes(role);
  return ['Admin', 'Chairman (DCS)'].includes(role) && item.type !== 'Sales Quotation';
};

const getApprovalStatus = (item: any) => {
  if (item.type === 'Sales Quotation' && item.gmStatus === 'APPROVED') return 'Awaiting client acceptance';
  if (item.dcsStatus === 'APPROVED' || item.dcsStatus === 'NOT_REQUIRED') return 'Approved';
  if (item.gmStatus === 'APPROVED') return 'Pending';
  if (item.reviewerStatus === 'APPROVED') return 'Pending';
  return 'Pending';
};

const statusStyles = (status: string) => status === 'Approved'
  ? 'border-emerald-200 bg-emerald-600 text-white shadow-sm'
  : 'border-amber-200 bg-amber-500 text-white shadow-sm';

const formatDate = (value: unknown) => {
  if (!value) return '—';
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString('en-US');
};

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({
  approvalsList,
  inventoryList,
  soaRows,
  poList,
  rfpList,
  rfqList = [],
  qboQueue = [],
  quotationsList = [],
  collectionsList = [],
  viewAsRole,
  onApproveItem,
  onSelectTab,
  onOpenQBOQueue,
  onOpenCreateQuotationModal,
}) => {
  const [selectedDocModal, setSelectedDocModal] = useState<any | null>(null);
  const recentQueue = useMemo(() => poList.slice(0, 8).map((purchaseOrder) => {
    const approval = approvalsList.find((item) => item.qrn === purchaseOrder.poNumber);
    return {
      ...(approval || {}),
      ...purchaseOrder,
      id: approval?.id || '',
      qrn: purchaseOrder.poNumber,
      type: 'Purchase Order',
      maker: approval?.maker || purchaseOrder.ownerRole || 'Purchasing Officer',
      reviewerStatus: approval?.reviewerStatus || (purchaseOrder.accountingApproved ? 'APPROVED' : 'PENDING'),
      gmStatus: approval?.gmStatus || (purchaseOrder.gmApproved ? 'APPROVED' : 'PENDING'),
      dcsStatus: approval?.dcsStatus || (purchaseOrder.dcsApproved ? 'APPROVED' : 'PENDING'),
    };
  }), [approvalsList, poList]);
  const selectedStage = selectedDocModal ? getNextApprovalStage(selectedDocModal) : null;
  const selectedStageCanApprove = selectedDocModal && selectedStage
    ? canApproveStage(viewAsRole, selectedStage, selectedDocModal)
    : false;

  const reviewApprovals = () => {
    const firstActionable = recentQueue.find((item) => {
      const nextStage = getNextApprovalStage(item);
      return nextStage && canApproveStage(viewAsRole, nextStage, item);
    });
    if (firstActionable) {
      setSelectedDocModal(firstActionable);
      return;
    }
    document.getElementById('approval-activity-table')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const getVendor = (item: any) => item.vendorName || item.ownerRole || item.maker || '—';

  const getDate = (item: any) => formatDate(item.orderDate || item.createdAt || item.date || item.quotationDate);

  return (
    <div className="space-y-8">
      <RoleActionCenter
        viewAsRole={viewAsRole}
        approvalsList={approvalsList}
        inventoryList={inventoryList}
        rfqList={rfqList}
        quotationsList={quotationsList}
        poList={poList}
        soaRows={soaRows}
        collectionsList={collectionsList}
        qboQueue={qboQueue}
        onSelectTab={onSelectTab}
        onOpenApprovals={reviewApprovals}
        onOpenQBOQueue={onOpenQBOQueue}
        onOpenCreateQuotationModal={onOpenCreateQuotationModal}
      />

      <section id="approval-activity-table" tabIndex={-1} aria-labelledby="approval-table-title" className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-700">
        <div className="sr-only">
          <h2 id="approval-table-title">Purchase order approval activity</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <caption className="sr-only">Recent purchase orders and approval status</caption>
            <thead className="border-b border-slate-200 bg-white text-base text-slate-950">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">PO Number <span className="ml-1 text-slate-400">↕</span></th>
                <th scope="col" className="px-6 py-4 font-medium">Vendor</th>
                <th scope="col" className="px-6 py-4 font-medium">Amount (PHP)</th>
                <th scope="col" className="px-6 py-4 font-medium">Date <span className="ml-1 text-slate-400">↕</span></th>
                <th scope="col" className="px-6 py-4 font-medium">Status <span className="ml-1 inline-flex align-middle text-slate-500"><ShieldCheck className="h-4 w-4" /></span></th>
              </tr>
            </thead>
            <tbody className="text-base text-slate-950">
              {recentQueue.map((item) => {
                const nextStage = getNextApprovalStage(item);
                const status = getApprovalStatus(item);
                const canApprove = Boolean(item.id) && nextStage ? canApproveStage(viewAsRole, nextStage, item) : false;
                return (
                  <tr key={item.id} className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.qrn || '—'}</span>
                        <button type="button" onClick={() => setSelectedDocModal(item)} className="inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-slate-700" aria-label={`Inspect ${item.qrn || 'document'}`}>
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getVendor(item)}</td>
                    <td className="px-6 py-4 font-medium tabular-nums">₱{Number(item.totalAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-6 py-4 text-slate-700">{getDate(item)}</td>
                    <td className="px-6 py-4">
                      {canApprove && nextStage ? (
                        <button type="button" onClick={() => onApproveItem(item.id, nextStage)} className={`inline-flex min-h-[36px] items-center rounded-full border px-3.5 py-1 text-sm font-medium transition hover:brightness-95 focus-visible:ring-2 focus-visible:ring-slate-700 focus-visible:ring-offset-2 ${statusStyles(status)}`}>
                          {status}
                          <span className="sr-only">, approve {stageLabel[nextStage]}</span>
                        </button>
                      ) : (
                        <span className={`inline-flex min-h-[36px] items-center rounded-full border px-3.5 py-1 text-sm font-medium ${statusStyles(status)}`}>{status}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {recentQueue.length === 0 && <p className="p-6 text-sm font-semibold text-slate-600">No approval activity is available yet.</p>}
      </section>

      {selectedDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/80 p-4 text-slate-900 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="document-inspector-title">
          <div className="w-full max-w-3xl space-y-6 rounded-2xl border border-slate-300 bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3"><div className="rounded-xl bg-slate-900 p-3 text-white"><FileText className="h-5 w-5" /></div><div><h2 id="document-inspector-title" className="text-base font-semibold sm:text-lg">Document inspector: {selectedDocModal.qrn}</h2><p className="text-xs text-slate-600 sm:text-sm">{selectedDocModal.type} · Originator: {selectedDocModal.maker}</p></div></div>
              <button type="button" onClick={() => setSelectedDocModal(null)} aria-label="Close document inspector" className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-700"><X className="h-5 w-5" /></button>
            </div>
            <div className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold sm:grid-cols-2"><div><span className="block text-xs font-bold uppercase tracking-wider text-slate-500">Document type</span><span className="font-semibold text-slate-950">{selectedDocModal.type}</span></div><div><span className="block text-xs font-bold uppercase tracking-wider text-slate-500">Total transaction value</span><span className="font-mono text-lg font-semibold text-slate-950">₱{Number(selectedDocModal.totalAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></div><div><span className="block text-xs font-bold uppercase tracking-wider text-slate-500">Maker / originator</span><span className="font-semibold text-slate-900">{selectedDocModal.maker || '—'}</span></div><div><span className="block text-xs font-bold uppercase tracking-wider text-slate-500">Current status</span><span className="font-semibold text-amber-900">{getApprovalStatus(selectedDocModal)}</span></div></div>
            <div className="space-y-3 border-t border-slate-200 pt-4"><span className="block text-xs font-bold uppercase tracking-wider text-slate-700">COSO approval timeline</span><div className="grid gap-3 sm:grid-cols-4">{(['Maker', 'Reviewer', 'GM', 'DCS'] as const).map((label, index) => { const status = index === 0 ? 'APPROVED' : index === 1 ? selectedDocModal.reviewerStatus : index === 2 ? selectedDocModal.gmStatus : selectedDocModal.type === 'Sales Quotation' ? 'NOT_REQUIRED' : selectedDocModal.dcsStatus; const complete = status === 'APPROVED' || status === 'NOT_REQUIRED'; return <div key={label} className={`rounded-xl border p-3 text-center ${complete ? 'border-emerald-200 bg-emerald-50 text-emerald-950' : status === 'PENDING' ? 'border-amber-200 bg-amber-50 text-amber-950' : 'border-slate-200 bg-slate-100 text-slate-500'}`}><span className="mx-auto flex w-fit rounded-full bg-white/70 p-2">{complete ? <CheckCircle2 className="h-5 w-5 text-emerald-700" /> : status === 'PENDING' ? <Clock className="h-5 w-5 text-amber-700" /> : <Lock className="h-5 w-5 text-slate-400" />}</span><p className="mt-1 text-sm font-semibold">{index + 1}. {label}</p><p className="text-xs font-bold">{status}</p></div>; })}</div></div>
            <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex flex-wrap gap-2">{selectedStage && selectedStageCanApprove && <button type="button" onClick={() => { onApproveItem(selectedDocModal.id, selectedStage); setSelectedDocModal(null); }} className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:ring-2 focus-visible:ring-slate-700 focus-visible:ring-offset-2"><ShieldCheck className="h-4 w-4" /> Approve {stageLabel[selectedStage]}</button>}{selectedStage && !selectedStageCanApprove && <span className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-600"><Lock className="h-4 w-4" /> {stageLabel[selectedStage]} action locked for {viewAsRole}</span>}<button type="button" onClick={() => { const targetTab = selectedDocModal.type.includes('Quotation') ? 'quotations' : selectedDocModal.type.includes('Purchase') ? 'purchasing' : 'rfp'; setSelectedDocModal(null); onSelectTab(targetTab); }} className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-slate-700 focus-visible:ring-offset-2"><ExternalLink className="h-4 w-4" /> Open module</button></div><button type="button" onClick={() => setSelectedDocModal(null)} className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-slate-200 px-5 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-300 focus-visible:ring-2 focus-visible:ring-slate-700 focus-visible:ring-offset-2">Close inspector</button></div>
          </div>
        </div>
      )}
    </div>
  );
};
