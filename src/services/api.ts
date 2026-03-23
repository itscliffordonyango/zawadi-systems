import { AuthResponse, DashboardSummary, InventoryLog, Product, Sale, User } from '../types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000/api';

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let message = 'Request failed';
    try {
      const error = await response.json();
      message = error.detail || message;
    } catch {
      message = response.statusText || message;
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  login: (email: string, password: string) => request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  me: (token: string) => request<User>('/auth/me', {}, token),
  getDashboard: (token: string) => request<DashboardSummary>('/dashboard/summary', {}, token),
  listProducts: (token: string) => request<Product[]>('/products', {}, token),
  createProduct: (token: string, payload: Partial<Product>) => request<Product>('/products', { method: 'POST', body: JSON.stringify(payload) }, token),
  updateProduct: (token: string, id: number, payload: Partial<Product>) => request<Product>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) }, token),
  deleteProduct: (token: string, id: number) => request<void>(`/products/${id}`, { method: 'DELETE' }, token),
  adjustProduct: (token: string, id: number, quantity_change: number, note?: string) => request<Product>(`/products/${id}/adjust`, { method: 'POST', body: JSON.stringify({ quantity_change, note }) }, token),
  getProductLogs: (token: string, id: number) => request<InventoryLog[]>(`/products/${id}/logs`, {}, token),
  listSales: (token: string) => request<Sale[]>('/sales', {}, token),
  createSale: (token: string, payload: { payment_method: string; items: { product_id: number; quantity: number }[] }) => request<Sale>('/sales', { method: 'POST', body: JSON.stringify(payload) }, token),
  listUsers: (token: string) => request<User[]>('/users', {}, token),
  createUser: (token: string, payload: { full_name: string; email: string; password: string; role: string }) => request<User>('/users', { method: 'POST', body: JSON.stringify(payload) }, token),
  updateUser: (token: string, id: number, payload: Partial<User> & { password?: string }) => request<User>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(payload) }, token),
};
