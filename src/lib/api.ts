// REST API Client for Accustandard Go Backend

const API_BASE_URL = '/accustandard/demo/api/v1';

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      console.warn(`[API] Fetch failed for ${url}: status ${response.status}`);
      return null;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.warn(`[API] Network error for ${endpoint}:`, error);
    return null;
  }
}

export async function getInventory() {
  return fetchApi<any[]>('/inventory');
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
  });
}

export async function getApprovals() {
  return fetchApi<any[]>('/approvals');
}

export async function updateApproval(id: string, action: 'approve' | 'reject', role: string, remarks?: string) {
  return fetchApi<any>(`/approvals/${id}/${action}`, {
    method: 'POST',
    body: JSON.stringify({ role, remarks }),
  });
}

export async function getSOA() {
  return fetchApi<any[]>('/soa');
}

export async function allocateCollection(allocationData: any) {
  return fetchApi<any>('/soa/allocate-collection', {
    method: 'POST',
    body: JSON.stringify(allocationData),
  });
}

export async function getPurchaseOrders() {
  return fetchApi<any[]>('/purchase-orders');
}

export async function createPurchaseOrder(poData: any) {
  return fetchApi<any>('/purchase-orders', {
    method: 'POST',
    body: JSON.stringify(poData),
  });
}

export async function receiveGoods(goodsReceiptData: any) {
  return fetchApi<any>('/inventory/receive', {
    method: 'POST',
    body: JSON.stringify(goodsReceiptData),
  });
}

export async function getRFPs() {
  return fetchApi<any[]>('/rfps');
}

export async function createRFP(rfpData: any) {
  return fetchApi<any>('/rfps', {
    method: 'POST',
    body: JSON.stringify(rfpData),
  });
}

export async function releaseRFP(id: string, releaseData: any) {
  return fetchApi<any>(`/rfps/${id}/release`, {
    method: 'POST',
    body: JSON.stringify(releaseData),
  });
}

export async function getQBOQueue() {
  return fetchApi<any[]>('/qbo-queue');
}

export async function syncQBOItem(id: string) {
  return fetchApi<any>(`/qbo-queue/${id}/sync`, {
    method: 'POST',
  });
}

export async function getAuditLogs() {
  return fetchApi<any[]>('/audit-logs');
}

