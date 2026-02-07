import React from 'react';
import { Product, Sale, DashboardStats } from '../types';
import { DollarSign, Package, AlertTriangle, TrendingUp, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  products: Product[];
  sales: Sale[];
  stats: DashboardStats;
  onNavigate: (view: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ products, sales, stats, onNavigate }) => {
  const lowStockItems = products.filter(p => p.stock <= p.minStock);
  
  // Prepare data for the chart (last 7 sales or grouped by day - simplified here to recent sales)
  const chartData = sales.slice(0, 7).map(sale => ({
    name: new Date(sale.date).toLocaleDateString(undefined, { weekday: 'short', hour: 'numeric' }),
    amount: sale.totalAmount
  })).reverse();

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Total Revenue" 
          value={`$${stats.revenue.toFixed(2)}`} 
          icon={DollarSign} 
          trend="+12% vs last week"
          color="blue"
        />
        <MetricCard 
          title="Total Sales" 
          value={stats.totalSales.toString()} 
          icon={TrendingUp} 
          trend="+5 new today"
          color="green"
        />
        <MetricCard 
          title="Products in Stock" 
          value={stats.totalProducts.toString()} 
          icon={Package} 
          color="purple"
        />
        <MetricCard 
          title="Low Stock Alerts" 
          value={stats.lowStockCount.toString()} 
          icon={AlertTriangle} 
          isAlert={stats.lowStockCount > 0}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity / Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Sales Performance</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f1f5f9' }}
                />
                <Bar dataKey="amount" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low Stock Alerts List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-800">Low Stock Alerts</h3>
            <button 
              onClick={() => onNavigate('inventory')}
              className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center"
            >
              Manage <ArrowRight size={16} className="ml-1" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {lowStockItems.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Package size={32} className="mx-auto mb-2 opacity-50" />
                <p>All stock levels are optimal.</p>
              </div>
            ) : (
              lowStockItems.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-800">{item.name}</p>
                    <p className="text-sm text-red-600 font-medium">
                      {item.stock} remaining
                    </p>
                  </div>
                  <div className="text-xs text-slate-500">
                     Min: {item.minStock}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, icon: Icon, trend, isAlert, color }: any) => {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-6 transition-all hover:shadow-md ${isAlert ? 'border-red-200 ring-2 ring-red-50' : 'border-slate-200'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
        {trend && <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{trend}</span>}
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
      </div>
    </div>
  );
};