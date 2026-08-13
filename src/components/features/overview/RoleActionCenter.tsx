'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

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
    ? { label: 'Active RFQs', count: activeRfqs.length, detail: 'Manage RFQs for current sourcing activity.', actionLabel: 'Manage RFQs', tone: 'primary', onOpen: () => onSelectTab('quotations') }
    : viewAsRole === 'Warehouse'
      ? { label: 'Pending PO Receipts', count: incomingPOs.length, detail: 'Receive against approved purchase orders.', actionLabel: 'Review Receiving', tone: 'primary', onOpen: () => onSelectTab('purchasing') }
      : { label: 'Pending PO Approvals', count: pendingPOApprovals.length, detail: 'Purchase orders waiting for the next approval stage.', actionLabel: 'Review Approvals', tone: 'primary', onOpen: reviewApprovals };

  const secondCard: ActionCard = viewAsRole === 'Sales' || viewAsRole === 'Marketing'
    ? { label: 'Customer approvals', count: waitingQuotes.length, detail: 'Quotes awaiting customer acceptance before fulfillment.', actionLabel: 'Open Quotes', tone: 'attention', onOpen: () => onSelectTab('quotations') }
    : viewAsRole === 'Warehouse'
      ? { label: 'Low-stock exceptions', count: criticalStock.length, detail: 'Items below the operational stock threshold.', actionLabel: 'Review Inventory', tone: 'attention', onOpen: () => onSelectTab('inventory') }
      : viewAsRole === 'Bookkeeper'
        ? { label: 'Open receivables', count: openReceivables.length, detail: 'Outstanding balances and collection activity to reconcile.', actionLabel: 'Open SOA', tone: 'quiet', onOpen: () => onSelectTab('soa') }
        : { label: 'Active RFQs', count: activeRfqs.length, detail: 'Manage RFQs for current sourcing activity.', actionLabel: 'Manage RFQs', tone: 'quiet', onOpen: () => onSelectTab('quotations') };

  const thirdCard: ActionCard = {
    label: 'Receiving Alerts',
    count: receivingAlertCount,
    detail: `${incomingPOs.length} open receipts and ${criticalStock.length} low-stock exceptions.`,
    actionLabel: 'View Alerts',
    tone: 'attention',
    onOpen: () => onSelectTab(incomingPOs.length ? 'purchasing' : 'inventory'),
  };

  return (
    <section aria-labelledby="role-action-center-title">
      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-slate-200/80 pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--brand-red)]">Role action center</p>
          <h1 id="role-action-center-title" className="max-w-2xl text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-[36px] sm:leading-10">Needs your attention today</h1>
          <p className="mt-2 max-w-2xl text-base font-medium text-slate-600">A prioritized work queue for your current role.</p>
        </div>
        <div className="flex w-fit items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm">
          <span className="text-slate-500">Viewing as</span>
          <span className="font-semibold text-[var(--brand-navy)]">{viewAsRole}</span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr_1fr]">
        {[firstCard, secondCard, thirdCard].map((card) => (
          <article key={card.label} data-tone={card.tone} className="wayfinding-card action-center-card flex min-h-[210px] flex-col p-6">
            <div className="flex items-start justify-between gap-4">
              <h2 className="max-w-[14rem] text-xl font-semibold leading-tight tracking-[-0.02em] text-slate-950">{card.label}</h2>
              <span className="shrink-0 rounded-md bg-slate-100 px-2.5 py-1 text-xl font-semibold tabular-nums text-slate-700" aria-label={`${card.count} open items`}>{card.count}</span>
            </div>
            <p className="mt-3 max-w-[30rem] text-[15px] leading-6 text-slate-700">{card.detail}</p>
            <button type="button" onClick={card.onOpen} data-tone={card.tone} className="action-center-action mt-auto inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-royal)] focus-visible:ring-offset-2">
              {card.actionLabel}
              <ArrowRight className="h-4 w-4" />
            </button>
          </article>
        ))}
      </div>

      {viewAsRole === 'Sales' && onOpenCreateQuotationModal && <button type="button" onClick={onOpenCreateQuotationModal} className="mt-4 text-sm font-semibold text-blue-800 underline decoration-blue-300 underline-offset-4 hover:text-blue-700">Create a new quotation</button>}
      {viewAsRole === 'Bookkeeper' && onOpenQBOQueue && queuedQboItems.length > 0 && <button type="button" onClick={onOpenQBOQueue} className="sr-only">Open QBO queue ({queuedQboItems.length})</button>}
      <span className="sr-only">{soaRows.length} active SOA rows and {collectionsList.length} collections.</span>
    </section>
  );
};
