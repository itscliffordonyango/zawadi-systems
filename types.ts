export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Sale {
  id: string;
  date: string; // ISO String
  items: CartItem[];
  totalAmount: number;
  paymentMethod: 'Cash' | 'Mobile Money' | 'Card';
}

export interface DashboardStats {
  totalSales: number;
  lowStockCount: number;
  totalProducts: number;
  revenue: number;
}

export type ViewState = 'dashboard' | 'inventory' | 'pos' | 'sales' | 'reports';