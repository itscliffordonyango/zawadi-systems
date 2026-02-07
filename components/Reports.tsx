import React from 'react';
import { Sale } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';

interface ReportsProps {
  sales: Sale[];
}

export const Reports: React.FC<ReportsProps> = ({ sales }) => {
  // Sort sales by date descending
  const sortedSales = [...sales].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Aggregate sales by date for the chart
  const salesByDate = sales.reduce((acc, sale) => {
    const date = new Date(sale.date).toLocaleDateString();
    acc[date] = (acc[date] || 0) + sale.totalAmount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(salesByDate).map(([date, amount]) => ({
    date,
    amount
  })).slice(-10); // Last 10 days

  const totalRevenue = sales.reduce((acc, s) => acc + s.totalAmount, 0);
  const averageSale = sales.length > 0 ? totalRevenue / sales.length : 0;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Sales Reports</h2>
        <button className="flex items-center space-x-2 text-slate-600 hover:text-brand-600 bg-white border border-slate-200 px-4 py-2 rounded-lg shadow-sm transition-colors">
          <Download size={18} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Sales Count</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-2">{sales.length}</h3>
         </div>
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Revenue</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-2">${totalRevenue.toFixed(2)}</h3>
         </div>
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Average Transaction</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-2">${averageSale.toFixed(2)}</h3>
         </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Revenue Trend</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="amount" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorAmount)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
           <h3 className="text-lg font-bold text-slate-800">Transaction History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedSales.map(sale => (
                <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-slate-500">{sale.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-800">
                    {new Date(sale.date).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {sale.items.length} items ({sale.items.map(i => i.name).join(', ').substring(0, 30)}...)
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="bg-slate-100 px-2 py-1 rounded text-slate-600 text-xs font-medium">
                      {sale.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-slate-900">
                    ${sale.totalAmount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};