import React, { useMemo, useState } from 'react';
import { InventoryLog, Product, UserRole } from '../types';
import { money } from '../lib/format';

interface Props {
  products: Product[];
  logs: Record<number, InventoryLog[]>;
  role: UserRole;
  loading: boolean;
  onSave: (product: Partial<Product>, id?: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onAdjust: (id: number, qty: number, note: string) => Promise<void>;
  onLoadLogs: (id: number) => Promise<void>;
}

const emptyForm = { name: '', sku: '', category: '', description: '', selling_price: 0, cost_price: 0, stock_quantity: 0, min_stock_level: 5 };

export const Inventory: React.FC<Props> = ({ products, logs, role, loading, onSave, onDelete, onAdjust, onLoadLogs }) => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Product | null>(null);
  const [form, setForm] = useState<any>(emptyForm);
  const [adjustQty, setAdjustQty] = useState(0);
  const [adjustNote, setAdjustNote] = useState('');

  const canManage = role === 'admin' || role === 'warehouse_manager';
  const filtered = useMemo(() => products.filter((product) => `${product.name} ${product.sku} ${product.category}`.toLowerCase().includes(search.toLowerCase())), [products, search]);

  const startCreate = () => { setSelected(null); setForm(emptyForm); };
  const startEdit = async (product: Product) => { setSelected(product); setForm(product); await onLoadLogs(product.id); };

  return (
    <div className="stack-lg">
      <div className="toolbar panel">
        <div>
          <h1>Inventory management</h1>
          <p>Maintain product master data, stock thresholds, and stock movement history.</p>
        </div>
        {canManage ? <button className="primary-btn" onClick={startCreate}>Add product</button> : null}
      </div>
      <div className="panel">
        <input placeholder="Search by name, SKU, or category" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="two-col inventory-layout">
        <section className="panel table-panel">
          {loading ? <p>Loading products...</p> : (
            <table className="data-table">
              <thead><tr><th>Name</th><th>SKU</th><th>Stock</th><th>Price</th><th>Status</th><th /></tr></thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}<small>{product.category}</small></td>
                    <td>{product.sku}</td>
                    <td>{product.stock_quantity}</td>
                    <td>{money(product.selling_price)}</td>
                    <td><span className={product.stock_quantity <= product.min_stock_level ? 'pill danger' : 'pill success'}>{product.stock_quantity <= product.min_stock_level ? 'Low stock' : 'Healthy'}</span></td>
                    <td><button className="ghost-btn" onClick={() => startEdit(product)}>View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
        <section className="panel stack-md">
          <div>
            <h3>{selected ? 'Edit product' : 'Create product'}</h3>
            <p className="muted">{canManage ? 'Changes persist to the backend immediately when saved.' : 'Read-only for your role.'}</p>
          </div>
          <div className="form-grid">
            {['name','sku','category','description','selling_price','cost_price','stock_quantity','min_stock_level'].map((field) => (
              <label key={field} className={field === 'description' ? 'span-2' : ''}>
                <span>{field.replaceAll('_', ' ')}</span>
                <input disabled={!canManage} value={form[field] ?? ''} onChange={(e) => setForm({ ...form, [field]: ['selling_price','cost_price','stock_quantity','min_stock_level'].includes(field) ? Number(e.target.value) : e.target.value })} />
              </label>
            ))}
          </div>
          {canManage ? <button className="primary-btn" onClick={() => onSave(form, selected?.id)}>{selected ? 'Update product' : 'Create product'}</button> : null}
          {selected && canManage ? <button className="secondary-btn" onClick={() => onDelete(selected.id)}>Delete product</button> : null}
          {selected && canManage ? (
            <div className="panel muted-card stack-sm">
              <h4>Stock adjustment</h4>
              <label><span>Quantity delta</span><input type="number" value={adjustQty} onChange={(e) => setAdjustQty(Number(e.target.value))} /></label>
              <label><span>Note</span><input value={adjustNote} onChange={(e) => setAdjustNote(e.target.value)} /></label>
              <button className="primary-btn" onClick={() => onAdjust(selected.id, adjustQty, adjustNote)}>Apply stock change</button>
            </div>
          ) : null}
          {selected ? (
            <div>
              <h4>Inventory log</h4>
              <div className="stack-sm">
                {(logs[selected.id] || []).map((log) => <div key={log.id} className="list-row"><span>{log.change_type} ({log.quantity_change})</span><small>{log.note || 'No note'} • {new Date(log.created_at).toLocaleString()}</small></div>)}
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
};
