'use client';

import React from 'react';
import {
  ArrowRight,
  ClipboardCheck,
  FileSearch,
  PackageCheck,
  type LucideIcon,
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
  onOpenApprovals?: () => void;
  onOpenQBOQueue?: () => void;
  onOpenCreateQuotationModal?: () => void;
}

interface ActionCard {
  label: string;
  count: number;
  detail: string;
  actionLabel: string;
  tone: 'primary' | 'attention' | 'quiet';
  onOpen: () => void;
  icon: LucideIcon;
}

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
  onOpenApprovals,
  onOpenQBOQueue,
  onOpenCreateQuotationModal,
}) => {
  const pendingApprovals = approvalsList.filter((item) => {
    if (viewAsRole === 'Chairman (DCS)') return item.gmStatus === 'APPROVED' && item.dcsStatus === 'PENDING' && item.type !== 'Sales Quotation';
    if (viewAsRole === 'General Manager') return item.reviewerStatus === 'APPROVED' && item.gmStatus === 'PENDING';
    if (viewAsRole === 'Marketing') return item.reviewerStatus === 'PENDING';
    if (viewAsRole === 'Bookkeeper') return item.type === 'Purchase Order' && item.reviewerStatus === 'PENDING';
    return item.reviewerStatus === 'PENDING' || item.gmStatus === 'PENDING' || (item.dcsStatus === 'PENDING' && item.type !== 'Sales Quotation');
  });
  const pendingPOApprovals = pendingApprovals.filter((item) => item.type === 'Purchase Order');
  const activeRfqs = rfqList.filter((rfq) => !['CLOSED', 'CONVERTED'].includes(rfq.currentStage));
  const waitingQuotes = quotationsList.filter((quote) => ['AWAITING_CLIENT_APPROVAL', 'PENDING_CLIENT_SIGNATURE', 'CLIENT_APPROVAL_PENDING'].includes(quote.status));
  const incomingPOs = poList.filter((po) => Number(po.rrQtyReceived || 0) < Number(po.poQty || 0));
  const criticalStock = inventoryList.filter((item) => Number(item.available ?? item.onHand ?? 0) < 50);
  const openReceivables = soaRows.filter((row) => Number(row.invoiceBalance ?? row.balance ?? 0) > 0);
  const receivingAlertCount = incomingPOs.length + criticalStock.length;
  const queuedQboItems = qboQueue.filter((item) => item.syncStatus !== 'SYNCED');

  const reviewApprovals = () => {
    if (onOpenApprovals) {
      onOpenApprovals();
      return;
    }
    onSelectTab('overview');
  };

  const firstCard: ActionCard = viewAsRole === 'Sales' || viewAsRole === 'Marketing'
    ? { label: 'Active RFQs', count: activeRfqs.length, detail: 'Manage RFQs for current sourcing activity.', actionLabel: 'Manage RFQs', tone: 'primary', onOpen: () => onSelectTab('quotations'), icon: FileSearch }
    : viewAsRole === 'Warehouse'
      ? { label: 'Pending PO Receipts', count: incomingPOs.length, detail: 'Receive against approved purchase orders.', actionLabel: 'Review Receiving', tone: 'primary', onOpen: () => onSelectTab('purchasing'), icon: PackageCheck }
      : { label: 'Pending PO Approvals', count: pendingPOApprovals.length, detail: 'Purchase orders waiting for the next approval stage.', actionLabel: 'Review Approvals', tone: 'primary', onOpen: reviewApprovals, icon: ClipboardCheck };

  const secondCard: ActionCard = viewAsRole === 'Sales' || viewAsRole === 'Marketing'
    ? { label: 'Customer approvals', count: waitingQuotes.length, detail: 'Quotes awaiting customer acceptance before fulfillment.', actionLabel: 'Open Quotes', tone: 'attention', onOpen: () => onSelectTab('quotations'), icon: FileSearch }
    : viewAsRole === 'Warehouse'
      ? { label: 'Low-stock exceptions', count: criticalStock.length, detail: 'Items below the operational stock threshold.', actionLabel: 'Review Inventory', tone: 'attention', onOpen: () => onSelectTab('inventory'), icon: PackageCheck }
      : viewAsRole === 'Bookkeeper'
        ? { label: 'Open receivables', count: openReceivables.length, detail: 'Outstanding balances and collection activity to reconcile.', actionLabel: 'Open SOA', tone: 'quiet', onOpen: () => onSelectTab('soa'), icon: FileSearch }
        : { label: 'Active RFQs', count: activeRfqs.length, detail: 'Manage RFQs for current sourcing activity.', actionLabel: 'Manage RFQs', tone: 'quiet', onOpen: () => onSelectTab('quotations'), icon: FileSearch };

  const thirdCard: ActionCard = {
    label: 'Receiving Alerts',
    count: receivingAlertCount,
    detail: `${incomingPOs.length} open receipts and ${criticalStock.length} low-stock exceptions.`,
    actionLabel: 'View Alerts',
    tone: 'attention',
    onOpen: () => onSelectTab(incomingPOs.length ? 'purchasing' : 'inventory'),
    icon: PackageCheck,
  };

  return (
    <section aria-labelledby="role-action-center-title">
      <div className="mb-7 flex flex-col justify-between gap-5 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="section-kicker mb-2">Role action center</p>
          <h1 id="role-action-center-title" className="max-w-2xl text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.045em] text-slate-950">Needs your attention today</h1>
          <p className="mt-3 max-w-2xl text-base text-slate-600">A prioritized work queue for your current role.</p>
        </div>
        <div className="flex w-fit items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/70 px-3.5 py-2 text-sm">
          <span className="h-2 w-2 rounded-full bg-[var(--brand-red)]" aria-hidden="true" />
          <span className="text-slate-500">Viewing as</span>
          <span className="font-medium text-[var(--brand-navy)]">{viewAsRole}</span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.22fr)_minmax(18rem,0.78fr)]">
        {[firstCard, secondCard, thirdCard].map((card, index) => {
          const Icon = card.icon;
          return (
          <article key={card.label} data-tone={card.tone} className={`wayfinding-card action-center-card flex flex-col ${index === 0 ? 'min-h-[270px] p-7 sm:p-8 lg:row-span-2' : 'min-h-[185px] p-5 sm:p-6'}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${card.tone === 'attention' ? 'bg-rose-50 text-[var(--brand-red)]' : 'bg-blue-50 text-[var(--brand-navy)]'}`}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="max-w-[15rem] pt-1 text-xl font-semibold leading-tight tracking-[-0.025em] text-slate-950">{card.label}</h2>
              </div>
              <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xl font-semibold tabular-nums text-slate-700" aria-label={`${card.count} open items`}>{card.count}</span>
            </div>
            <p className="mt-4 max-w-[30rem] text-[15px] leading-6 text-slate-600">{card.detail}</p>
            <button type="button" onClick={card.onOpen} data-tone={card.tone} className="action-center-action mt-auto inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-royal)] focus-visible:ring-offset-2">
              {card.actionLabel}
              <ArrowRight className="h-4 w-4" />
            </button>
          </article>
          );
        })}
      </div>

      {viewAsRole === 'Sales' && onOpenCreateQuotationModal && <button type="button" onClick={onOpenCreateQuotationModal} className="mt-4 text-sm font-medium text-blue-800 underline decoration-blue-300 underline-offset-4 hover:text-blue-700">Create a new quotation</button>}
      {viewAsRole === 'Bookkeeper' && onOpenQBOQueue && queuedQboItems.length > 0 && <button type="button" onClick={onOpenQBOQueue} className="sr-only">Open QBO queue ({queuedQboItems.length})</button>}
      <span className="sr-only">{soaRows.length} active SOA rows and {collectionsList.length} collections.</span>
    </section>
  );
};
