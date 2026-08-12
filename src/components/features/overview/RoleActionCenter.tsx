'use client';

import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileSignature,
  PackageCheck,
  Receipt,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react';

interface RoleActionCenterProps {
  viewAsRole: string;
  approvalsList: any[];
  inventoryList: any[];
  rfqList: any[];
  quotationsList: any[];
  poList: any[];
  soaRows: any[];
  collectionsList: any[];
  qboQueue: any[];
  onSelectTab: (tabKey: string) => void;
  onApproveItem: (id: string, stage: string) => void;
  onOpenQBOQueue?: () => void;
  onOpenCreateQuotationModal?: () => void;
}

interface ActionCard {
  label: string;
  count: number;
  detail: string;
  icon: React.ElementType;
  tone: 'blue' | 'amber' | 'emerald' | 'rose';
  onOpen: () => void;
  actionLabel: string;
}

const toneStyles = {
  blue: 'border-blue-200 bg-blue-50 text-blue-950',
  amber: 'border-amber-200 bg-amber-50 text-amber-950',
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-950',
  rose: 'border-rose-200 bg-rose-50 text-rose-950',
};

const getApprovalStage = (item: any, role: string) => {
  if (role === 'Chairman (DCS)') return 'dcs';
  if (role === 'General Manager') return 'gm';
  if (item.reviewerStatus === 'PENDING') return 'reviewer';
  if (item.gmStatus === 'PENDING') return 'gm';
  return 'dcs';
};

export const RoleActionCenter: React.FC<RoleActionCenterProps> = ({
  viewAsRole,
  approvalsList,
  inventoryList,
  rfqList,
  quotationsList,
  poList,
  soaRows,
  collectionsList,
  qboQueue,
  onSelectTab,
  onApproveItem,
  onOpenQBOQueue,
  onOpenCreateQuotationModal,
}) => {
  const pendingApprovals = approvalsList.filter((item) => {
    if (viewAsRole === 'Chairman (DCS)') return item.dcsStatus === 'PENDING';
    if (viewAsRole === 'General Manager') return item.gmStatus === 'PENDING';
    return item.reviewerStatus === 'PENDING' || item.gmStatus === 'PENDING' || item.dcsStatus === 'PENDING';
  });
  const activeRfqs = rfqList.filter((rfq) => !['CLOSED', 'CONVERTED'].includes(rfq.currentStage));
  const waitingQuotes = quotationsList.filter((quote) =>
    ['AWAITING_CLIENT_APPROVAL', 'PENDING_CLIENT_SIGNATURE', 'CLIENT_APPROVAL_PENDING'].includes(quote.status),
  );
  const incomingPOs = poList.filter((po) => Number(po.rrQtyReceived || 0) < Number(po.poQty || 0));
  const criticalStock = inventoryList.filter((item) => Number(item.available ?? item.onHand ?? 0) < 50);
  const unallocatedCollections = collectionsList.filter((collection) => Number(collection.unappliedCredit || 0) > 0);
  const queuedQboItems = qboQueue.filter((item) => item.syncStatus !== 'SYNCED');

  const approveFirst = () => {
    const item = pendingApprovals[0];
    if (item) onApproveItem(item.id, getApprovalStage(item, viewAsRole));
    else onSelectTab('overview');
  };

  const roleCards: ActionCard[] = (() => {
    switch (viewAsRole) {
      case 'General Manager':
      case 'Chairman (DCS)':
        return [
          {
            label: 'Pending approvals',
            count: pendingApprovals.length,
            detail: viewAsRole === 'Chairman (DCS)' ? 'Purchase and payment controls need your decision.' : 'Sales, purchasing, and payment controls need your decision.',
            icon: ClipboardCheck,
            tone: 'amber',
            onOpen: approveFirst,
            actionLabel: 'Review & approve',
          },
          {
            label: 'Approval chain status',
            count: approvalsList.length,
            detail: 'Review the full COSO approval chain and evidence.',
            icon: ShieldCheck,
            tone: 'blue',
            onOpen: () => onSelectTab('overview'),
            actionLabel: 'Open control center',
          },
        ];
      case 'Sales':
        return [
          {
            label: 'Active RFQs',
            count: activeRfqs.length,
            detail: 'Demand requests are ready for qualification or pricing.',
            icon: Receipt,
            tone: 'blue',
            onOpen: () => onSelectTab('quotations'),
            actionLabel: 'Open RFQs',
          },
          {
            label: 'Awaiting customer signature',
            count: waitingQuotes.length,
            detail: 'Quotes need customer acceptance before fulfillment.',
            icon: FileSignature,
            tone: 'amber',
            onOpen: () => onSelectTab('quotations'),
            actionLabel: 'Open quotes',
          },
        ];
      case 'Warehouse':
        return [
          {
            label: 'Incoming PO receipts',
            count: incomingPOs.length,
            detail: 'Receive only within each approved PO quantity.',
            icon: PackageCheck,
            tone: 'blue',
            onOpen: () => onSelectTab('purchasing'),
            actionLabel: 'Open receiving',
          },
          {
            label: 'Critical stock alerts',
            count: criticalStock.length,
            detail: 'Available stock is below the 50-unit control threshold.',
            icon: TriangleAlert,
            tone: 'rose',
            onOpen: () => onSelectTab('inventory'),
            actionLabel: 'Open inventory',
          },
        ];
      case 'Bookkeeper':
        return [
          {
            label: 'Unallocated collections',
            count: unallocatedCollections.length,
            detail: `${unallocatedCollections.reduce((sum, item) => sum + Number(item.unappliedCredit || 0), 0).toLocaleString('en-US', { style: 'currency', currency: 'PHP' })} remains unallocated.`,
            icon: Receipt,
            tone: 'amber',
            onOpen: () => onSelectTab('soa'),
            actionLabel: 'Allocate collections',
          },
          {
            label: 'QBO queue items',
            count: queuedQboItems.length,
            detail: 'Review queued accounting sync items and retry when ready.',
            icon: CheckCircle2,
            tone: 'blue',
            onOpen: onOpenQBOQueue || (() => onSelectTab('soa')),
            actionLabel: 'Open QBO queue',
          },
        ];
      case 'Marketing':
        return [
          {
            label: 'RFQs for review',
            count: rfqList.filter((rfq) => rfq.marketingRoiStatus !== 'ROI_COMPLETED').length,
            detail: 'Complete qualification and ROI evidence before pricing.',
            icon: ClipboardCheck,
            tone: 'amber',
            onOpen: () => onSelectTab('quotations'),
            actionLabel: 'Review RFQs',
          },
          {
            label: 'Quotes in pipeline',
            count: quotationsList.length,
            detail: 'Keep reviewer decisions and customer handoff moving.',
            icon: FileSignature,
            tone: 'blue',
            onOpen: () => onSelectTab('quotations'),
            actionLabel: 'Open quotations',
          },
        ];
      default:
        return [
          {
            label: 'Pending control actions',
            count: pendingApprovals.length,
            detail: 'Review the next approval or exception in the control queue.',
            icon: ShieldCheck,
            tone: 'amber',
            onOpen: approveFirst,
            actionLabel: 'Review next action',
          },
          {
            label: 'Inventory exceptions',
            count: criticalStock.length,
            detail: `${soaRows.length} active SOA rows and ${criticalStock.length} stock exceptions are visible.`,
            icon: TriangleAlert,
            tone: 'rose',
            onOpen: () => onSelectTab('inventory'),
            actionLabel: 'Open exceptions',
          },
        ];
    }
  })();

  const primaryCard = roleCards[0];

  return (
    <section aria-labelledby="role-action-center-title" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">Role action center</p>
          <h1 id="role-action-center-title" className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
            Welcome back.
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-600">Here is what needs your attention today.</p>
          <p className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">Viewing as {viewAsRole}</p>
        </div>
        <button
          type="button"
          onClick={primaryCard.onOpen}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-blue-900 px-5 py-3 text-sm font-black text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-blue-800 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          {primaryCard.actionLabel}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {roleCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <article key={card.label} className={`rounded-2xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-sm ${toneStyles[card.tone]}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="rounded-xl bg-white/80 p-2.5 shadow-xs"><Icon className="h-5 w-5" /></span>
                  <div>
                    <h2 className="text-sm font-black">{card.label}</h2>
                    <p className="mt-1 text-xs font-medium opacity-80">{card.detail}</p>
                  </div>
                </div>
                <span className="text-2xl font-black tabular-nums">{card.count}</span>
              </div>
              <button
                type="button"
                onClick={card.onOpen}
                className={`mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-black transition-all focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${index === 0 ? 'bg-white text-slate-950 shadow-xs hover:bg-slate-50' : 'text-current hover:bg-white/70'}`}
              >
                {index === 0 ? primaryCard.actionLabel : card.actionLabel}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </article>
          );
        })}
      </div>

      {viewAsRole === 'Sales' && onOpenCreateQuotationModal && (
        <button type="button" onClick={onOpenCreateQuotationModal} className="mt-4 text-xs font-black text-blue-900 underline decoration-blue-300 underline-offset-4 hover:text-blue-700">
          Create a new quotation
        </button>
      )}
    </section>
  );
};
