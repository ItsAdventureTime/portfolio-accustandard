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
  tone: 'green' | 'gold' | 'blue';
  onOpen: () => void;
}

const cardToneStyles = {
  green: 'bg-emerald-600 text-white hover:bg-emerald-700',
  gold: 'bg-amber-500 text-white hover:bg-amber-600',
  blue: 'border border-slate-300 bg-blue-50 text-slate-800 hover:bg-blue-100',
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
    ? { label: 'Active RFQs', count: activeRfqs.length, detail: 'Manage RFQs for current sourcing activity.', actionLabel: 'Manage RFQs', tone: 'green', onOpen: () => onSelectTab('quotations') }
    : viewAsRole === 'Warehouse'
      ? { label: 'Pending PO Receipts', count: incomingPOs.length, detail: 'Receive against approved purchase orders.', actionLabel: 'Review Receiving', tone: 'green', onOpen: () => onSelectTab('purchasing') }
      : { label: 'Pending PO Approvals', count: pendingPOApprovals.length, detail: 'Pending PO approvals for completed primary action cards.', actionLabel: 'Review Approvals', tone: 'green', onOpen: reviewApprovals };

  const secondCard: ActionCard = viewAsRole === 'Sales' || viewAsRole === 'Marketing'
    ? { label: 'Customer approvals', count: waitingQuotes.length, detail: 'Quotes awaiting customer acceptance before fulfillment.', actionLabel: 'Open Quotes', tone: 'gold', onOpen: () => onSelectTab('quotations') }
    : { label: 'Active RFQs', count: activeRfqs.length, detail: 'Manage RFQs for current sourcing activity.', actionLabel: 'Manage RFQs', tone: 'gold', onOpen: () => onSelectTab('quotations') };

  const thirdCard: ActionCard = {
    label: 'Receiving Alerts',
    count: receivingAlertCount,
    detail: `${incomingPOs.length} open receipts and ${criticalStock.length} low-stock exceptions.`,
    actionLabel: 'View Alerts',
    tone: 'blue',
    onOpen: () => onSelectTab(incomingPOs.length ? 'purchasing' : 'inventory'),
  };

  return (
    <section aria-labelledby="role-action-center-title">
      <div className="mb-7">
        <h1 id="role-action-center-title" className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-[32px] sm:leading-10">Needs Your Attention Today</h1>
        <p className="mt-1 text-lg font-medium text-slate-800">Role Action Center <span className="sr-only">for {viewAsRole}</span></p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {[firstCard, secondCard, thirdCard].map((card) => (
          <article key={card.label} className="flex min-h-[195px] flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-[0_2px_8px_rgba(15,23,42,0.09)]">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-xl font-semibold leading-tight text-slate-950">{card.label}</h2>
              <span className="rounded-md bg-slate-100 px-2.5 py-1 text-lg font-semibold tabular-nums text-slate-700">{card.count}</span>
            </div>
            <p className="mt-3 min-h-[48px] text-base leading-6 text-slate-800">{card.detail}</p>
            <button type="button" onClick={card.onOpen} className={`mt-auto inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-base font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-700 focus-visible:ring-offset-2 ${cardToneStyles[card.tone]}`}>
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
