import React, { useState } from 'react';
import { Product, CartItem } from '../types';
import { Search, ShoppingCart, Plus, Minus, Trash2, CheckCircle, CreditCard, Banknote } from 'lucide-react';

interface POSProps {
  products: Product[];
  onCompleteSale: (items: CartItem[], total: number, method: 'Cash' | 'Mobile Money' | 'Card') => void;
}

export const POS: React.FC<POSProps> = ({ products, onCompleteSale }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Mobile Money' | 'Card'>('Cash');
  const [isSuccess, setIsSuccess] = useState(false);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;
    
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev; // Cannot exceed stock
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const product = products.find(p => p.id === id);
          if (!product) return item;
          
          const newQty = item.quantity + delta;
          if (newQty > product.stock) return item; // Stock check
          if (newQty <= 0) return item;
          return { ...item, quantity: newQty };
        }
        return item;
      });
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    onCompleteSale(cart, cartTotal, paymentMethod);
    setCart([]);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] gap-6">
      {/* Product Selection Area */}
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Search & Filter */}
        <div className="p-4 border-b border-slate-200 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat 
                    ? 'bg-brand-600 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
                className={`
                  flex flex-col items-start p-4 bg-white rounded-lg border text-left transition-all
                  ${product.stock === 0 
                    ? 'opacity-50 cursor-not-allowed border-slate-200' 
                    : 'hover:border-brand-300 hover:shadow-md cursor-pointer border-slate-200 active:scale-95'
                  }
                `}
              >
                <div className="w-full mb-2 flex justify-between items-start">
                   <div className="h-10 w-10 rounded bg-brand-50 flex items-center justify-center text-brand-600 font-bold">
                     {product.name.charAt(0)}
                   </div>
                   <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                     Qty: {product.stock}
                   </span>
                </div>
                <h4 className="font-semibold text-slate-800 text-sm line-clamp-2 min-h-[2.5rem]">{product.name}</h4>
                <p className="text-brand-600 font-bold mt-1">${product.price.toFixed(2)}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Area */}
      <div className="w-full lg:w-96 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-xl">
          <h3 className="font-bold text-slate-800 flex items-center">
            <ShoppingCart size={20} className="mr-2" /> Current Sale
          </h3>
          <span className="bg-brand-100 text-brand-700 text-xs font-bold px-2 py-1 rounded-full">
            {cart.reduce((acc, i) => acc + i.quantity, 0)} Items
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
              <ShoppingCart size={48} className="opacity-20" />
              <p>Cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
                <div className="flex-1">
                  <p className="font-medium text-slate-800 text-sm line-clamp-1">{item.name}</p>
                  <p className="text-xs text-slate-500">${item.price.toFixed(2)} / unit</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-slate-100 rounded-lg">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1 hover:text-red-600 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1 hover:text-green-600 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-4 rounded-b-xl">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-slate-900">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>

          <div>
             <label className="block text-xs font-medium text-slate-500 uppercase mb-2">Payment Method</label>
             <div className="grid grid-cols-3 gap-2">
                {['Cash', 'Mobile Money', 'Card'].map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method as any)}
                    className={`text-xs py-2 rounded border text-center transition-all ${
                      paymentMethod === method 
                      ? 'bg-brand-600 text-white border-brand-600' 
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {method === 'Cash' && <Banknote className="w-4 h-4 mx-auto mb-1"/>}
                    {method === 'Card' && <CreditCard className="w-4 h-4 mx-auto mb-1"/>}
                    {method === 'Mobile Money' && <span className="block text-[10px] font-bold mb-1">MPESA</span>}
                    {method}
                  </button>
                ))}
             </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className={`
              w-full py-3 rounded-lg font-bold text-white shadow-lg transition-all flex items-center justify-center
              ${cart.length === 0 
                ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                : 'bg-brand-600 hover:bg-brand-700 hover:shadow-brand-500/30'
              }
            `}
          >
            {isSuccess ? <CheckCircle className="mr-2 animate-bounce" /> : 'Complete Sale'}
          </button>
        </div>
      </div>
    </div>
  );
};