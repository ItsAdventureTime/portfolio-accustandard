'use client';

import React, { useState } from 'react';
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
import { AccessibleModal } from '@/components/common/AccessibleModal';
import {
  canApproveApprovalStage,
  getNextApprovalStage,
  type ApprovalRecord,
  type ApprovalStage,
  type Role,
  type RoleScopedDashboardData,
  type ReviewablePurchaseOrder,
} from '@/lib/permissions';

interface ExecutiveOverviewProps {
  approvalsList: readonly ApprovalRecord[];
  reviewablePOItems: readonly ReviewablePurchaseOrder[];
  roleScopedData: RoleScopedDashboardData;
  viewAsRole: Role;
  onApproveItem: (id: string, stage: ApprovalStage) => void;
  onSelectTab: (tabKey: string) => void;
  onOpenQBOQueue?: () => void;
  onOpenCreateQuotationModal?: () => void;
}

const stageLabel: Record<ApprovalStage, string> = {
  reviewer: 'Reviewer',
  gm: 'GM',
  dcs: 'DCS',
};

const getApprovalStatus = (item: any) => {
  if (item.type === 'Sales Quotation' && item.gmStatus === 'APPROVED') return 'Awaiting client acceptance';
  if (item.dcsStatus === 'APPROVED' || item.dcsStatus === 'NOT_REQUIRED') return 'Approved';
  if (item.gmStatus === 'APPROVED') return 'Pending';
  if (item.reviewerStatus === 'APPROVED') return 'Pending';
  return 'Pending';
};

const statusStyles = (status: string) => status === 'Approved'
  ? 'badge-status-approved'
  : 'badge-status-pending';

const formatDate = (value: unknown) => {
  if (!value) return '—';
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString('en-US');
};

const formatCurrency = (value: unknown) => {
  if (value === null || value === undefined || value === '') return '—';
  const amount = Number(value);
  if (!Number.isFinite(amount)) return '—';
  return `₱${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
};

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({
  approvalsList,
  reviewablePOItems,
  roleScopedData,
  viewAsRole,
  onApproveItem,
  onSelectTab,
  onOpenQBOQueue,
  onOpenCreateQuotationModal,
}) => {
  const [selectedDocModal, setSelectedDocModal] = useState<any | null>(null);

  const recentQueue = reviewablePOItems;
  const selectedStage = selectedDocModal ? getNextApprovalStage(selectedDocModal) : null;
  const selectedStageCanApprove = selectedDocModal?.approvalId && selectedStage
    ? canApproveApprovalStage(viewAsRole, selectedStage, selectedDocModal)
    : false;

  const reviewApprovals = () => {
    const firstActionable = recentQueue.find((item) => {
      const nextStage = getNextApprovalStage(item);
      return Boolean(item.approvalId) && nextStage && canApproveApprovalStage(viewAsRole, nextStage, item);
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
    <div className="space-y-7">
      <RoleActionCenter
        viewAsRole={viewAsRole}
        roleScopedData={roleScopedData}
        onSelectTab={onSelectTab}
        onOpenApprovals={reviewApprovals}
        onOpenQBOQueue={onOpenQBOQueue}
        onOpenCreateQuotationModal={onOpenCreateQuotationModal}
      />

      <section id="approval-activity-table" tabIndex={-1} aria-labelledby="approval-table-title" className="wayfinding-card overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-700">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-200/80 px-5 py-5 sm:flex-row sm:items-end sm:px-6">
          <div>
            <p className="section-kicker">Control trail</p>
            <h2 id="approval-table-title" className="mt-1 text-xl font-semibold tracking-[-0.02em] text-slate-950">Reviewable purchase orders</h2>
            <p className="mt-1 text-sm text-slate-600">{approvalsList.length} pending approval items; purchase orders assigned to the active demo role appear below.</p>
          </div>
          <span className="w-fit rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium tabular-nums text-slate-600">{recentQueue.length} records</span>
        </div>
        <div className="table-responsive-wrapper">
          <table className="wayfinding-grid w-full min-w-[760px] border-collapse text-left">
            <caption className="sr-only">Reviewable purchase orders and approval status</caption>
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
                const canApprove = Boolean(item.approvalId) && nextStage ? canApproveApprovalStage(viewAsRole, nextStage, item) : false;
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
                    <td className="px-6 py-4 font-medium tabular-nums">{formatCurrency(item.totalAmount)}</td>
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
        {recentQueue.length === 0 && <p className="p-6 text-sm text-slate-600">No approval activity is available yet.</p>}
      </section>

      <AccessibleModal
        isOpen={Boolean(selectedDocModal)}
        onClose={() => setSelectedDocModal(null)}
        title={selectedDocModal ? `Document inspector: ${selectedDocModal.qrn}` : 'Document inspector'}
        description={selectedDocModal ? `${selectedDocModal.type} · Originator: ${selectedDocModal.maker}` : undefined}
        size="lg"
        contentClassName="text-slate-900"
      >
          {selectedDocModal && <div className="modal-panel space-y-6 p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3"><div className="rounded-xl bg-blue-50 p-3 text-blue-900"><FileText className="h-5 w-5" /></div><div><h2 className="text-base font-semibold sm:text-lg">Document inspector: {selectedDocModal.qrn}</h2><p className="text-xs text-slate-600 sm:text-sm">{selectedDocModal.type} · Originator: {selectedDocModal.maker}</p></div></div>
              <button type="button" onClick={() => setSelectedDocModal(null)} aria-label="Close document inspector" className="modal-close"><X className="h-5 w-5" /></button>
            </div>
            <div className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm sm:grid-cols-2"><div><span className="block text-xs font-medium uppercase tracking-wider text-slate-500">Document type</span><span className="font-medium text-slate-950">{selectedDocModal.type}</span></div><div><span className="block text-xs font-medium uppercase tracking-wider text-slate-500">Total transaction value</span><span className="font-mono text-lg font-semibold text-slate-950">{formatCurrency(selectedDocModal.totalAmount)}</span></div><div><span className="block text-xs font-medium uppercase tracking-wider text-slate-500">Maker / originator</span><span className="font-medium text-slate-900">{selectedDocModal.maker || '—'}</span></div><div><span className="block text-xs font-medium uppercase tracking-wider text-slate-500">Current status</span><span className="font-medium text-amber-900">{getApprovalStatus(selectedDocModal)}</span></div></div>
            <div className="space-y-3 border-t border-slate-200 pt-4"><span className="block text-xs font-medium uppercase tracking-wider text-slate-700">COSO approval timeline</span><div className="grid gap-3 sm:grid-cols-4">{(['Maker', 'Reviewer', 'GM', 'DCS'] as const).map((label, index) => { const status = index === 0 ? 'APPROVED' : index === 1 ? selectedDocModal.reviewerStatus : index === 2 ? selectedDocModal.gmStatus : selectedDocModal.type === 'Sales Quotation' ? 'NOT_REQUIRED' : selectedDocModal.dcsStatus; const complete = status === 'APPROVED' || status === 'NOT_REQUIRED'; return <div key={label} className={`rounded-xl border p-3 text-center ${complete ? 'border-emerald-200 bg-emerald-50 text-emerald-950' : status === 'PENDING' ? 'border-amber-200 bg-amber-50 text-amber-950' : 'border-slate-200 bg-slate-100 text-slate-500'}`}><span className="mx-auto flex w-fit rounded-full bg-white/70 p-2">{complete ? <CheckCircle2 className="h-5 w-5 text-emerald-700" /> : status === 'PENDING' ? <Clock className="h-5 w-5 text-amber-700" /> : <Lock className="h-5 w-5 text-slate-400" />}</span><p className="mt-1 text-sm font-medium">{index + 1}. {label}</p><p className="text-xs font-medium">{status}</p></div>; })}</div></div>
            <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex flex-wrap gap-2">{selectedStage && selectedStageCanApprove && <button type="button" onClick={() => { onApproveItem(selectedDocModal.approvalId, selectedStage); setSelectedDocModal(null); }} className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[var(--brand-navy)] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--brand-royal)] focus-visible:ring-2 focus-visible:ring-slate-700 focus-visible:ring-offset-2"><ShieldCheck className="h-4 w-4" /> Approve {stageLabel[selectedStage]}</button>}{selectedStage && !selectedStageCanApprove && <span className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-600"><Lock className="h-4 w-4" /> {stageLabel[selectedStage]} action locked for {viewAsRole}</span>}<button type="button" onClick={() => { const targetTab = selectedDocModal.type.includes('Quotation') ? 'quotations' : selectedDocModal.type.includes('Purchase') ? 'purchasing' : 'rfp'; setSelectedDocModal(null); onSelectTab(targetTab); }} className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-slate-700 focus-visible:ring-offset-2"><ExternalLink className="h-4 w-4" /> Open module</button></div><button type="button" onClick={() => setSelectedDocModal(null)} className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-slate-200 px-5 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-300 focus-visible:ring-2 focus-visible:ring-slate-700 focus-visible:ring-offset-2">Close inspector</button></div>
          </div>}
      </AccessibleModal>
    </div>
  );
};
