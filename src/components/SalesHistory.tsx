import React from 'react';
import { Sale } from '../types';
import { dateTime, money } from '../lib/format';

export const SalesHistory: React.FC<{ sales: Sale[]; loading: boolean }> = ({ sales, loading }) => (
  <div className="stack-lg">
    <div className="panel">
      <h1>Sales history</h1>
      <p>All transactions are stored in the backend and inventory deductions are applied atomically.</p>
    </div>
    <div className="panel table-panel">
      {loading ? <p>Loading sales...</p> : (
        <table className="data-table">
          <thead><tr><th>Reference</th><th>Date</th><th>Cashier</th><th>Items</th><th>Method</th><th>Total</th></tr></thead>
          <tbody>
            {sales.map((sale) => <tr key={sale.id}><td>{sale.reference}</td><td>{dateTime(sale.created_at)}</td><td>{sale.cashier_name}</td><td>{sale.items.map((item) => `${item.product_name} × ${item.quantity}`).join(', ')}</td><td>{sale.payment_method}</td><td>{money(sale.total_amount)}</td></tr>)}
          </tbody>
        </table>
      )}
    </div>
  </div>
);
