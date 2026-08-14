export const ROLES = [
  'Admin',
  'Chairman (DCS)',
  'General Manager',
  'Bookkeeper',
  'Warehouse',
  'Marketing',
  'Sales',
] as const;

export type Role = (typeof ROLES)[number];
export const DEFAULT_ROLE: Role = 'General Manager';

export const ROLE_OPTIONS: ReadonlyArray<{ value: Role; label: string }> = [
  { value: 'Admin', label: 'Admin' },
  { value: 'Chairman (DCS)', label: 'Chairman (DCS)' },
  { value: 'General Manager', label: 'General Manager' },
  { value: 'Bookkeeper', label: 'Bookkeeper' },
  { value: 'Warehouse', label: 'Warehouse' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Sales', label: 'Sales Officer' },
];

export const ROLE_ALLOWED_TABS: Readonly<Record<Role, readonly string[]>> = {
  Admin: ['overview', 'inventory', 'quotations', 'soa', 'purchasing', 'rfp', 'admin'],
  'Chairman (DCS)': ['overview', 'inventory', 'quotations', 'soa', 'purchasing', 'rfp', 'admin'],
  'General Manager': ['overview', 'inventory', 'quotations', 'soa', 'purchasing', 'rfp', 'admin'],
  Bookkeeper: ['overview', 'soa', 'purchasing', 'rfp'],
  Warehouse: ['overview', 'inventory', 'purchasing'],
  Marketing: ['overview', 'quotations'],
  Sales: ['overview', 'quotations', 'inventory'],
};

export const TAB_LABELS: Readonly<Record<string, string>> = {
  overview: 'Executive Overview',
  inventory: 'Inventory',
  quotations: 'Sales',
  soa: 'SOA',
  purchasing: 'Purchasing',
  rfp: 'RFP',
  admin: 'User & Audit Logs',
};

export type Operation = 'create' | 'export' | 'import' | 'qbo' | 'barcode' | 'scanner' | 'pwa' | 'admin';

const ROLE_OPERATION_PERMISSIONS: Readonly<Record<Role, readonly Operation[]>> = {
  Admin: ['create', 'export', 'import', 'qbo', 'barcode', 'scanner', 'pwa', 'admin'],
  'Chairman (DCS)': ['create', 'export', 'import', 'qbo', 'barcode', 'scanner', 'pwa', 'admin'],
  'General Manager': ['create', 'export', 'import', 'qbo', 'barcode', 'scanner', 'pwa', 'admin'],
  Bookkeeper: ['create', 'export', 'qbo', 'pwa'],
  Warehouse: ['create', 'export', 'barcode', 'scanner', 'pwa'],
  Marketing: ['create', 'export', 'pwa'],
  Sales: ['create', 'export', 'pwa'],
};

export const isRole = (value: string): value is Role => ROLES.includes(value as Role);

export const normalizeRole = (value: string): Role => (isRole(value) ? value : DEFAULT_ROLE);

export const getAllowedTabs = (role: string): readonly string[] => ROLE_ALLOWED_TABS[normalizeRole(role)];

export const getAllowedModuleViews = (role: string): string[] =>
  getAllowedTabs(role).map((tab) => TAB_LABELS[tab]).filter((label): label is string => Boolean(label));

export const canUseOperation = (role: string, operation: Operation): boolean =>
  ROLE_OPERATION_PERMISSIONS[normalizeRole(role)].includes(operation);

/** Only Admin and the DCS Chairman may change user access assignments. */
export const canManageUsers = (role: string): boolean =>
  ['Admin', 'Chairman (DCS)'].includes(normalizeRole(role));

export type ApprovalStage = 'reviewer' | 'gm' | 'dcs';

export interface ApprovalRecord {
  id?: string | number;
  qrn?: string;
  type?: string;
  maker?: string;
  reviewerStatus?: string;
  gmStatus?: string;
  dcsStatus?: string;
  ownerRole?: string;
  totalAmount?: number | string;
  [key: string]: unknown;
}

export interface InventoryRecord {
  available?: number | string;
  onHand?: number | string;
  [key: string]: unknown;
}

export interface RfqRecord {
  currentStage?: string;
  [key: string]: unknown;
}

export interface QuotationRecord {
  status?: string;
  [key: string]: unknown;
}

export interface PurchaseOrderRecord {
  id?: string | number;
  poNumber?: string;
  rrQtyReceived?: number | string;
  poQty?: number | string;
  accountingApproved?: boolean;
  gmApproved?: boolean;
  dcsApproved?: boolean;
  vendorName?: string;
  orderDate?: string;
  createdAt?: string;
  date?: string;
  [key: string]: unknown;
}

export interface SoaRecord {
  invoiceBalance?: number | string;
  balance?: number | string;
  [key: string]: unknown;
}

export interface QboQueueRecord {
  syncStatus?: string;
  [key: string]: unknown;
}

export type ReviewablePurchaseOrder = PurchaseOrderRecord & ApprovalRecord & {
  id: string;
  approvalId: string;
  qrn: string;
  type: 'Purchase Order';
  maker: string;
  reviewerStatus: string;
  gmStatus: string;
  dcsStatus: string;
};

export const getNextApprovalStage = (item: ApprovalRecord): ApprovalStage | null => {
  if (item.reviewerStatus === 'PENDING') return 'reviewer';
  if (item.gmStatus === 'PENDING') return 'gm';
  if (item.type !== 'Sales Quotation' && item.dcsStatus === 'PENDING') return 'dcs';
  return null;
};

export const canApproveApprovalStage = (role: string, stage: ApprovalStage, item: ApprovalRecord): boolean => {
  if (stage === 'reviewer') return ['Admin', 'Marketing'].includes(normalizeRole(role)) || (normalizeRole(role) === 'Bookkeeper' && item.type === 'Purchase Order');
  if (stage === 'gm') return ['Admin', 'General Manager'].includes(normalizeRole(role));
  return ['Admin', 'Chairman (DCS)'].includes(normalizeRole(role)) && item.type !== 'Sales Quotation';
};

export const selectPendingApprovals = <T extends ApprovalRecord>(
  approvals: readonly T[],
  role: string,
): T[] => approvals.filter((item) => {
  const nextStage = getNextApprovalStage(item);
  return Boolean(nextStage && canApproveApprovalStage(role, nextStage, item));
});

export const selectPendingPOApprovals = <T extends ApprovalRecord>(
  approvals: readonly T[],
  role: string,
): T[] => selectPendingApprovals(approvals, role).filter((item) => item.type === 'Purchase Order');

export const selectPendingRfpApprovals = <T extends ApprovalRecord>(
  approvals: readonly T[],
  role: string,
): T[] => selectPendingApprovals(approvals, role).filter((item) => item.type === 'Request for Payment');

const asNumber = (value: unknown): number => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
};

export const selectActiveRfqs = <T extends RfqRecord>(rfqs: readonly T[]): T[] =>
  rfqs.filter((rfq) => !['CLOSED', 'CONVERTED'].includes(rfq.currentStage || ''));

export const selectWaitingQuotes = <T extends QuotationRecord>(quotations: readonly T[]): T[] =>
  quotations.filter((quote) => ['AWAITING_CLIENT_APPROVAL', 'PENDING_CLIENT_SIGNATURE', 'CLIENT_APPROVAL_PENDING'].includes(quote.status || ''));

export const selectIncomingPOs = <T extends PurchaseOrderRecord>(purchaseOrders: readonly T[]): T[] =>
  purchaseOrders.filter((purchaseOrder) => asNumber(purchaseOrder.rrQtyReceived) < asNumber(purchaseOrder.poQty));

export const selectCriticalStock = <T extends InventoryRecord>(inventory: readonly T[]): T[] =>
  inventory.filter((item) => asNumber(item.available ?? item.onHand) < 50);

export const selectOpenReceivables = <T extends SoaRecord>(rows: readonly T[]): T[] =>
  rows.filter((row) => asNumber(row.invoiceBalance ?? row.balance) > 0);

export const selectQueuedQboItems = <T extends QboQueueRecord>(queue: readonly T[]): T[] =>
  queue.filter((item) => item.syncStatus !== 'SYNCED');

export const selectReviewablePurchaseOrders = (
  approvals: readonly ApprovalRecord[],
  purchaseOrders: readonly PurchaseOrderRecord[],
  role: string,
): ReviewablePurchaseOrder[] => purchaseOrders.flatMap((purchaseOrder) => {
  const approval = approvals.find((item) => item.qrn === purchaseOrder.poNumber);
  if (!approval?.id) return [];

  const item: ReviewablePurchaseOrder = {
    ...approval,
    ...purchaseOrder,
    id: String(approval.id),
    approvalId: String(approval.id),
    qrn: purchaseOrder.poNumber || String(approval.qrn || purchaseOrder.id || 'unknown'),
    type: 'Purchase Order',
    maker: typeof approval.maker === 'string'
      ? approval.maker
      : typeof purchaseOrder.ownerRole === 'string'
        ? purchaseOrder.ownerRole
        : 'Purchasing Officer',
    reviewerStatus: approval.reviewerStatus || (purchaseOrder.accountingApproved ? 'APPROVED' : 'PENDING'),
    gmStatus: approval.gmStatus || (purchaseOrder.gmApproved ? 'APPROVED' : 'PENDING'),
    dcsStatus: approval.dcsStatus || (purchaseOrder.dcsApproved ? 'APPROVED' : 'PENDING'),
  };
  const nextStage = getNextApprovalStage(item);
  return nextStage && canApproveApprovalStage(role, nextStage, item) ? [item] : [];
});

export interface RoleScopedDashboardData {
  pendingApprovals: ApprovalRecord[];
  pendingPOApprovals: ApprovalRecord[];
  pendingRfpApprovals: ApprovalRecord[];
  activeRfqs: RfqRecord[];
  waitingQuotes: QuotationRecord[];
  incomingPOs: PurchaseOrderRecord[];
  criticalStock: InventoryRecord[];
  openReceivables: SoaRecord[];
  queuedQboItems: QboQueueRecord[];
  reviewablePurchaseOrders: ReviewablePurchaseOrder[];
}

export const selectRoleScopedDashboardData = ({
  role,
  approvals,
  inventory,
  rfqs,
  quotations,
  purchaseOrders,
  soaRows,
  qboQueue,
}: {
  role: string;
  approvals: readonly ApprovalRecord[];
  inventory: readonly InventoryRecord[];
  rfqs: readonly RfqRecord[];
  quotations: readonly QuotationRecord[];
  purchaseOrders: readonly PurchaseOrderRecord[];
  soaRows: readonly SoaRecord[];
  qboQueue: readonly QboQueueRecord[];
}): RoleScopedDashboardData => {
  const normalizedRole = normalizeRole(role);
  const allowedTabs = getAllowedTabs(normalizedRole);
  const canView = (tab: string) => allowedTabs.includes(tab);
  const pendingApprovals = selectPendingApprovals(approvals, normalizedRole);

  return {
    pendingApprovals,
    pendingPOApprovals: selectPendingPOApprovals(approvals, normalizedRole),
    pendingRfpApprovals: selectPendingRfpApprovals(approvals, normalizedRole),
    activeRfqs: canView('quotations') ? selectActiveRfqs(rfqs) : [],
    waitingQuotes: canView('quotations') ? selectWaitingQuotes(quotations) : [],
    incomingPOs: canView('purchasing') ? selectIncomingPOs(purchaseOrders) : [],
    criticalStock: canView('inventory') ? selectCriticalStock(inventory) : [],
    openReceivables: canView('soa') ? selectOpenReceivables(soaRows) : [],
    queuedQboItems: canUseOperation(normalizedRole, 'qbo') ? selectQueuedQboItems(qboQueue) : [],
    reviewablePurchaseOrders: selectReviewablePurchaseOrders(approvals, purchaseOrders, normalizedRole),
  };
};
