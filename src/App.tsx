import React, { useEffect, useMemo, useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { Inventory } from './components/Inventory';
import { Layout } from './components/Layout';
import { LoginPage } from './components/LoginPage';
import { POS } from './components/POS';
import { SalesHistory } from './components/SalesHistory';
import { UsersPanel } from './components/UsersPanel';
import { useLocalStorage } from './hooks/useLocalStorage';
import { api } from './services/api';
import { AppView, DashboardSummary, InventoryLog, Product, Sale, User } from './types';

const App: React.FC = () => {
  const [token, setToken] = useLocalStorage<string | null>('zawadi-token', null);
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<Record<number, InventoryLog[]>>({});
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const refreshAll = async (activeToken: string, activeUser?: User | null) => {
    const [dashboardData, productData, salesData] = await Promise.all([
      api.getDashboard(activeToken),
      api.listProducts(activeToken),
      api.listSales(activeToken),
    ]);
    setSummary(dashboardData);
    setProducts(productData);
    setSales(salesData);
    if ((activeUser || user)?.role === 'admin') {
      setUsers(await api.listUsers(activeToken));
    }
  };

  useEffect(() => {
    const boot = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const me = await api.me(token);
        setUser(me);
        await refreshAll(token, me);
      } catch (error: any) {
        setToken(null);
        setAuthError(error.message);
      } finally {
        setLoading(false);
      }
    };
    boot();
  }, [token]);

  const handleAction = async (action: () => Promise<void>) => {
    if (!token) return;
    setGlobalError(null);
    try {
      await action();
      await refreshAll(token);
    } catch (error: any) {
      setGlobalError(error.message);
    }
  };

  const lowStockCount = useMemo(() => products.filter((item) => item.stock_quantity <= item.min_stock_level).length, [products]);

  if (!token || !user) {
    return <LoginPage loading={loading} error={authError} onLogin={async (email, password) => {
      setAuthError(null);
      try {
        const response = await api.login(email, password);
        setToken(response.access_token);
        setUser(response.user);
        await refreshAll(response.access_token, response.user);
      } catch (error: any) {
        setAuthError(error.message);
      }
    }} />;
  }

  return (
    <Layout view={view} setView={setView} user={user} onLogout={() => { setToken(null); setUser(null); }}>
      <div className="stack-lg">
        {globalError ? <div className="error-banner">{globalError}</div> : null}
        <div className="status-bar panel"><strong>Connected user:</strong> {user.email} • <strong>Low stock:</strong> {lowStockCount}</div>
        {view === 'dashboard' && <Dashboard summary={summary} loading={loading} />}
        {view === 'inventory' && <Inventory products={products} logs={logs} role={user.role} loading={loading} onLoadLogs={async (id) => { if (!token) return; const productLogs = await api.getProductLogs(token, id); setLogs((prev) => ({ ...prev, [id]: productLogs })); }} onSave={(payload, id) => handleAction(async () => { if (!token) return; if (id) { await api.updateProduct(token, id, payload); } else { await api.createProduct(token, payload); } })} onDelete={(id) => handleAction(async () => { if (!token) return; await api.deleteProduct(token, id); })} onAdjust={(id, qty, note) => handleAction(async () => { if (!token) return; await api.adjustProduct(token, id, qty, note); const productLogs = await api.getProductLogs(token, id); setLogs((prev) => ({ ...prev, [id]: productLogs })); })} />}
        {view === 'pos' && <POS products={products} onCheckout={(payload) => handleAction(async () => { if (!token) return; await api.createSale(token, payload); setView('sales'); })} />}
        {view === 'sales' && <SalesHistory sales={sales} loading={loading} />}
        {view === 'users' && user.role === 'admin' && <UsersPanel users={users} onCreate={(payload) => handleAction(async () => { if (!token) return; await api.createUser(token, payload); })} onToggleActive={(target) => handleAction(async () => { if (!token) return; await api.updateUser(token, target.id, { is_active: !target.is_active }); })} />}
      </div>
    </Layout>
  );
};

export default App;
