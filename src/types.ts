export type UserRole = 'admin' | 'warehouse_manager' | 'salesperson';
export type PaymentMethod = 'Cash' | 'Card' | 'Mobile Money';
export type AppView = 'dashboard' | 'inventory' | 'pos' | 'sales' | 'users';

export interface User {
  id: number;
  full_name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  description?: string | null;
  selling_price: number;
  cost_price: number;
  stock_quantity: number;
  min_stock_level: number;
  created_at: string;
  updated_at: string;
}

export interface InventoryLog {
  id: number;
  product_id: number;
  actor_id: number;
  change_type: string;
  quantity_change: number;
  previous_stock: number;
  new_stock: number;
  note?: string | null;
  created_at: string;
}

export interface SaleItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export interface Sale {
  id: number;
  reference: string;
  payment_method: string;
  total_amount: number;
  created_at: string;
  cashier_name: string;
  items: SaleItem[];
}

export interface DashboardSummary {
  total_revenue: number;
  total_sales: number;
  total_products: number;
  low_stock_count: number;
  top_products: { name: string; units_sold: number }[];
  revenue_trend: { date: string; amount: number }[];
  low_stock_products: { id: number; name: string; stock_quantity: number; min_stock_level: number }[];
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}
