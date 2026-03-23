import React, { useMemo, useState } from 'react';
import { PaymentMethod, Product } from '../types';
import { money } from '../lib/format';

interface Props {
  products: Product[];
  onCheckout: (payload: { payment_method: PaymentMethod; items: { product_id: number; quantity: number }[] }) => Promise<void>;
}

export const POS: React.FC<Props> = ({ products, onCheckout }) => {
  const [cart, setCart] = useState<Record<number, number>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => products.filter((product) => product.stock_quantity > 0 && product.name.toLowerCase().includes(search.toLowerCase())), [products, search]);
  const cartProducts = Object.entries(cart).map(([id, quantity]) => ({ product: products.find((item) => item.id === Number(id))!, quantity })).filter((item) => item.product);
  const total = cartProducts.reduce((sum, line) => sum + line.product.selling_price * Number(line.quantity), 0);

  return (
    <div className="two-col pos-layout">
      <section className="panel stack-md">
        <div>
          <h1>Point of sale</h1>
          <p>Build a transaction from live inventory and submit it as a persistent sale.</p>
        </div>
        <input placeholder="Search sellable products" value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="product-grid">
          {filtered.map((product) => (
            <button key={product.id} className="product-card" onClick={() => setCart((prev) => ({ ...prev, [product.id]: Math.min((prev[product.id] || 0) + 1, product.stock_quantity) }))}>
              <strong>{product.name}</strong>
              <span>{product.stock_quantity} in stock</span>
              <em>{money(product.selling_price)}</em>
            </button>
          ))}
        </div>
      </section>
      <section className="panel stack-md">
        <h3>Current sale</h3>
        <div className="stack-sm">
          {cartProducts.length === 0 ? <p className="muted">Add products to the cart to begin.</p> : cartProducts.map(({ product, quantity }) => (
            <div key={product.id} className="list-row">
              <span>{product.name} × {quantity}</span>
              <div className="actions-inline">
                <button className="ghost-btn" onClick={() => setCart((prev) => ({ ...prev, [product.id]: Math.max((prev[product.id] || 0) - 1, 0) }))}>-</button>
                <button className="ghost-btn" onClick={() => setCart((prev) => ({ ...prev, [product.id]: Math.min((prev[product.id] || 0) + 1, product.stock_quantity) }))}>+</button>
              </div>
            </div>
          ))}
        </div>
        <div className="stack-sm">
          <label><span>Payment method</span><select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}><option>Cash</option><option>Card</option><option>Mobile Money</option></select></label>
          <div className="list-row total-row"><strong>Total</strong><strong>{money(total)}</strong></div>
          <button className="primary-btn" disabled={cartProducts.length === 0} onClick={async () => {
            await onCheckout({ payment_method: paymentMethod, items: cartProducts.filter((line) => Number(line.quantity) > 0).map((line) => ({ product_id: line.product.id, quantity: Number(line.quantity) })) });
            setCart({});
          }}>Complete sale</button>
        </div>
      </section>
    </div>
  );
};
