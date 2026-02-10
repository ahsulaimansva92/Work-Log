import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import DailyTracker from './pages/DailyTracker';
import CategoryManager from './pages/CategoryManager';
import WeeklyReport from './pages/WeeklyReport';
import { View, Category, WorkItem } from './types';
import { getCategories, saveCategories, getWorkItems, saveWorkItems } from './services/storage';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('daily');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // App State
  const [categories, setCategories] = useState<Category[]>([]);
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);

  // Load Data on Mount
  useEffect(() => {
    setCategories(getCategories());
    setWorkItems(getWorkItems());
  }, []);

  // Handlers
  const handleAddCategory = (category: Category) => {
    const updated = [...categories, category];
    setCategories(updated);
    saveCategories(updated);
  };

  const handleDeleteCategory = (id: string) => {
    const updated = categories.filter(c => c.id !== id);
    setCategories(updated);
    saveCategories(updated);
  };

  const handleAddWorkItem = (item: WorkItem) => {
    const updated = [...workItems, item];
    setWorkItems(updated);
    saveWorkItems(updated);
  };

  const handleDeleteWorkItem = (id: string) => {
    const updated = workItems.filter(i => i.id !== id);
    setWorkItems(updated);
    saveWorkItems(updated);
  };

  // Render View
  const renderContent = () => {
    switch (currentView) {
      case 'daily':
        return (
          <DailyTracker 
            categories={categories} 
            workItems={workItems} 
            onAddWorkItem={handleAddWorkItem}
            onDeleteWorkItem={handleDeleteWorkItem}
          />
        );
      case 'categories':
        return (
          <CategoryManager 
            categories={categories} 
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        );
      case 'weekly':
        return (
          <WeeklyReport 
            workItems={workItems}
            categories={categories}
          />
        );
      default:
        return <DailyTracker categories={categories} workItems={workItems} onAddWorkItem={handleAddWorkItem} onDeleteWorkItem={handleDeleteWorkItem} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar 
        currentView={currentView} 
        onNavigate={setCurrentView}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between md:hidden">
          <div className="font-bold text-slate-800">WorkLog AI</div>
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
