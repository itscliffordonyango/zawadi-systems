import React from 'react';
import { DashboardSummary } from '../types';
import { money } from '../lib/format';

export const Dashboard: React.FC<{ summary: DashboardSummary | null; loading: boolean }> = ({ summary, loading }) => {
  if (loading) return <div className="panel">Loading dashboard...</div>;
  if (!summary) return <div className="panel">No dashboard data available.</div>;

  return (
    <div className="stack-lg">
      <section className="hero panel">
        <div>
          <span className="badge">Operational overview</span>
          <h1>Business performance at a glance</h1>
          <p>Monitor live revenue, stock risk, and product performance from one workspace.</p>
        </div>
      </section>
      <section className="stats-grid">
        <div className="panel stat-card"><span>Revenue</span><strong>{money(summary.total_revenue)}</strong></div>
        <div className="panel stat-card"><span>Sales</span><strong>{summary.total_sales}</strong></div>
        <div className="panel stat-card"><span>Products</span><strong>{summary.total_products}</strong></div>
        <div className="panel stat-card danger"><span>Low stock alerts</span><strong>{summary.low_stock_count}</strong></div>
      </section>
      <section className="two-col">
        <div className="panel">
          <h3>Revenue trend</h3>
          <div className="simple-chart">
            {summary.revenue_trend.length === 0 ? <p className="muted">No sales yet.</p> : summary.revenue_trend.map((entry) => (
              <div key={entry.date} className="chart-row">
                <span>{entry.date}</span>
                <div><i style={{ width: `${Math.max(12, Number(entry.amount) * 12)}px` }} /> <strong>{money(Number(entry.amount))}</strong></div>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <h3>Low stock warnings</h3>
          <div className="stack-sm">
            {summary.low_stock_products.length === 0 ? <p className="muted">No low stock products.</p> : summary.low_stock_products.map((item) => (
              <div key={item.id} className="list-row alert-row"><span>{item.name}</span><strong>{item.stock_quantity} / min {item.min_stock_level}</strong></div>
            ))}
          </div>
        </div>
      </section>
      <section className="panel">
        <h3>Top selling products</h3>
        <div className="stack-sm">
          {summary.top_products.map((item) => <div key={item.name} className="list-row"><span>{item.name}</span><strong>{item.units_sold} units</strong></div>)}
        </div>
      </section>
    </div>
  );
};
