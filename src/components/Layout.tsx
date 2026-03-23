import React from 'react';
import { AppView, User } from '../types';

const navItems: { id: AppView; label: string; adminOnly?: boolean }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'inventory', label: 'Inventory' },
  { id: 'pos', label: 'Point of Sale' },
  { id: 'sales', label: 'Sales History' },
  { id: 'users', label: 'Users', adminOnly: true },
];

interface Props {
  view: AppView;
  setView: (view: AppView) => void;
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<Props> = ({ view, setView, user, onLogout, children }) => (
  <div className="app-shell">
    <aside className="sidebar">
      <div>
        <div className="brand-card">
          <h2>Zawadi Systems</h2>
          <p>Sales & warehouse operations</p>
        </div>
        <nav className="nav-list">
          {navItems.filter((item) => !item.adminOnly || user.role === 'admin').map((item) => (
            <button key={item.id} className={view === item.id ? 'nav-item active' : 'nav-item'} onClick={() => setView(item.id)}>
              {item.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="profile-card">
        <div>
          <strong>{user.full_name}</strong>
          <p>{user.role.replace('_', ' ')}</p>
        </div>
        <button className="secondary-btn" onClick={onLogout}>Logout</button>
      </div>
    </aside>
    <main className="content-shell">{children}</main>
  </div>
);
