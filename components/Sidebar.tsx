import React from 'react';
import { LayoutDashboard, List, PieChart, Briefcase } from 'lucide-react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, isMobileOpen, setIsMobileOpen }) => {
  const navItems = [
    { id: 'daily' as View, label: 'Daily Tracker', icon: LayoutDashboard },
    { id: 'weekly' as View, label: 'Weekly Report', icon: PieChart },
    { id: 'categories' as View, label: 'Manage Categories', icon: List },
  ];

  const handleNav = (view: View) => {
    onNavigate(view);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 bottom-0 w-64 bg-slate-900 text-white z-30 transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static
      `}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-700">
          <div className="bg-blue-500 p-2 rounded-lg">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">WorkLog AI</span>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                `}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-slate-700">
          <div className="text-xs text-slate-500">
            Powered by Gemini 2.0
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
