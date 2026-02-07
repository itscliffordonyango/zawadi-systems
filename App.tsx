import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Inventory } from './components/Inventory';
import { POS } from './components/POS';
import { Reports } from './components/Reports';
import { Product, Sale, ViewState, CartItem } from './types';
import { INITIAL_PRODUCTS, INITIAL_SALES } from './constants';

const App: React.FC = () => {
  // --- State Management ---
  // In a real app, these would come from an API/Database
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [sales, setSales] = useState<Sale[]>(INITIAL_SALES);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');

  // --- Effects ---
  // Simple persistence for demo purposes (resets on full reload if not saved to localStorage, 
  // but let's keep it in-memory for this clean demo to avoid stale state issues)

  // --- Actions ---

  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [...prev, newProduct]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleCompleteSale = (cartItems: CartItem[], total: number, method: 'Cash' | 'Mobile Money' | 'Card') => {
    // 1. Create Sale Record
    const newSale: Sale = {
      id: `SALE-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      items: cartItems,
      totalAmount: total,
      paymentMethod: method,
    };

    // 2. Update Inventory
    const updatedProducts = products.map(product => {
      const soldItem = cartItems.find(item => item.id === product.id);
      if (soldItem) {
        return { ...product, stock: Math.max(0, product.stock - soldItem.quantity) };
      }
      return product;
    });

    setSales(prev => [...prev, newSale]);
    setProducts(updatedProducts);
  };

  // --- Derived State ---
  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;
  const stats = {
    totalSales: sales.length,
    lowStockCount,
    totalProducts: products.length,
    revenue: sales.reduce((acc, s) => acc + s.totalAmount, 0)
  };

  // --- Render ---
  return (
    <Layout 
      currentView={currentView} 
      onNavigate={setCurrentView}
      lowStockCount={lowStockCount}
    >
      {currentView === 'dashboard' && (
        <Dashboard 
          products={products} 
          sales={sales} 
          stats={stats}
          onNavigate={setCurrentView}
        />
      )}

      {currentView === 'inventory' && (
        <Inventory 
          products={products}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
        />
      )}

      {currentView === 'pos' && (
        <POS 
          products={products}
          onCompleteSale={handleCompleteSale}
        />
      )}

      {(currentView === 'sales' || currentView === 'reports') && (
        <Reports sales={sales} />
      )}
    </Layout>
  );
};

export default App;