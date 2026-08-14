// REST API Client for Accustandard Go Backend

import { DEFAULT_ROLE, isRole, type Role } from '@/lib/permissions';

const API_BASE_URL = '/accustandard/demo/api/v1';
let activeDemoRole: Role = DEFAULT_ROLE;

export function setDemoRole(role: Role) {
  if (isRole(role)) activeDemoRole = role;
}

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit,
  config: { strict?: boolean } = {},
): Promise<T | null> {
  try {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
        'X-Demo-Role': activeDemoRole,
      },
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null) as { error?: string } | null;
      const message = errorBody?.error || `Request failed with status ${response.status}`;
      if (config.strict) throw new ApiRequestError(message, response.status);
      console.warn(`[API] Fetch failed for ${url}: ${message}`);
      return null;
    }

    if (response.status === 204) return null;
    return (await response.json()) as T;
  } catch (error) {
    if (config.strict && error instanceof ApiRequestError) throw error;
    console.warn(`[API] Network error for ${endpoint}:`, error);
    return null;
  }
}

export async function getInventory() {
  return fetchApi<any[]>('/inventory');
}

export async function getReadiness() {
  return fetchApi<{ status?: string; db?: string }>('/readiness');
}

export async function getReplenishment() {
  return fetchApi<any[]>('/replenishment');
}

export async function getRFQs() {
  return fetchApi<any[]>('/rfqs');
}

export async function createRFQ(rfqData: any) {
  return fetchApi<any>('/rfqs', {
    method: 'POST',
    body: JSON.stringify(rfqData),
  }, { strict: true });
}

export async function getApprovals() {
  return fetchApi<any[]>('/approvals');
}

export async function updateApproval(id: string, action: 'approve' | 'reject', remarks?: string) {
  return fetchApi<any>(`/approvals/${id}/${action}`, {
    method: 'POST',
    body: JSON.stringify({ remarks }),
  }, { strict: true });
}

export async function getSOA() {
  return fetchApi<any[]>('/soa');
}

export async function allocateCollection(allocationData: any) {
  return fetchApi<any>('/soa/allocate-collection', {
    method: 'POST',
    body: JSON.stringify(allocationData),
  }, { strict: true });
}

export async function getPurchaseOrders() {
  return fetchApi<any[]>('/purchase-orders');
}

export async function createPurchaseOrder(poData: any) {
  return fetchApi<any>('/purchase-orders', {
    method: 'POST',
    body: JSON.stringify(poData),
  }, { strict: true });
}

export async function receiveGoods(goodsReceiptData: any) {
  return fetchApi<any>('/inventory/receive', {
    method: 'POST',
    body: JSON.stringify(goodsReceiptData),
  }, { strict: true });
}

export async function getRFPs() {
  return fetchApi<any[]>('/rfps');
}

export async function createRFP(rfpData: any) {
  return fetchApi<any>('/rfps', {
    method: 'POST',
    body: JSON.stringify(rfpData),
  }, { strict: true });
}

export async function releaseRFP(id: string, releaseData: any) {
  return fetchApi<any>(`/rfps/${id}/release`, {
    method: 'POST',
    body: JSON.stringify(releaseData),
  }, { strict: true });
}

export async function getQBOQueue() {
  return fetchApi<any[]>('/qbo-queue');
}

export async function syncQBOItem(id: string) {
  return fetchApi<any>(`/qbo-queue/${id}/sync`, {
    method: 'POST',
  }, { strict: true });
}

export async function getAuditLogs() {
  return fetchApi<any[]>('/audit-logs');
}
