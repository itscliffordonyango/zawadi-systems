import { Product, Sale } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Super Gro Maize Flour (2kg)',
    category: 'Grains',
    price: 2.50,
    costPrice: 1.80,
    stock: 45,
    minStock: 10,
  },
  {
    id: '2',
    name: 'Fresh Dairy Milk (500ml)',
    category: 'Dairy',
    price: 0.60,
    costPrice: 0.40,
    stock: 8,
    minStock: 15, // Low stock example
  },
  {
    id: '3',
    name: 'Blue Band Margarine (500g)',
    category: 'Pantry',
    price: 3.00,
    costPrice: 2.20,
    stock: 30,
    minStock: 5,
  },
  {
    id: '4',
    name: 'Sugar (1kg)',
    category: 'Pantry',
    price: 1.50,
    costPrice: 1.10,
    stock: 3,
    minStock: 20, // Critical low stock
  },
  {
    id: '5',
    name: 'Bar Soap (1kg)',
    category: 'Cleaning',
    price: 1.20,
    costPrice: 0.80,
    stock: 100,
    minStock: 10,
  }
];

export const INITIAL_SALES: Sale[] = [
  {
    id: 'SALE-1001',
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    items: [
      { ...INITIAL_PRODUCTS[0], quantity: 2 },
      { ...INITIAL_PRODUCTS[1], quantity: 1 }
    ],
    totalAmount: 5.60,
    paymentMethod: 'Cash'
  },
  {
    id: 'SALE-1002',
    date: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    items: [
      { ...INITIAL_PRODUCTS[3], quantity: 1 }
    ],
    totalAmount: 1.50,
    paymentMethod: 'Mobile Money'
  }
];

export const CATEGORIES = ['Grains', 'Dairy', 'Pantry', 'Cleaning', 'Beverages', 'Snacks'];