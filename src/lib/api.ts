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
