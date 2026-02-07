import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, Package, ShoppingCart, TrendingUp, BarChart3, Menu, X, Bell } from 'lucide-react';

interface LayoutProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  children: React.ReactNode;
  lowStockCount: number;
}

export const Layout: React.FC<LayoutProps> = ({ currentView, onNavigate, children, lowStockCount }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pos', label: 'Point of Sale', icon: ShoppingCart },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'sales', label: 'Sales History', icon: TrendingUp },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out
        lg:relative lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Zawadi</h1>
            <p className="text-xs text-slate-400">Sales & Inventory</p>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
                {item.id === 'inventory' && lowStockCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {lowStockCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
        
        <div className="absolute bottom-0 w-full p-6 border-t border-slate-800">
           <div className="flex items-center space-x-3">
             <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold">
               JS
             </div>
             <div>
               <p className="text-sm font-medium text-white">John Smith</p>
               <p className="text-xs text-slate-400">Administrator</p>
             </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden text-slate-500 hover:text-slate-700"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex-1 px-4 lg:px-0">
             <h2 className="text-lg font-semibold text-slate-800 capitalize">
               {navItems.find(i => i.id === currentView)?.label}
             </h2>
          </div>

          <div className="flex items-center space-x-4">
             {lowStockCount > 0 && (
               <div className="hidden md:flex items-center px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm border border-red-100 animate-pulse">
                 <Bell size={16} className="mr-2" />
                 <span>{lowStockCount} Items Low Stock</span>
               </div>
             )}
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};