import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Hash, Tag, AlignLeft } from 'lucide-react';
import { Category, WorkItem } from '../types';
import { getStartOfToday, getEndOfToday, formatDateTime } from '../utils/dateUtils';

interface DailyTrackerProps {
  categories: Category[];
  workItems: WorkItem[];
  onAddWorkItem: (item: WorkItem) => void;
  onDeleteWorkItem: (id: string) => void;
}

const DailyTracker: React.FC<DailyTrackerProps> = ({
  categories,
  workItems,
  onAddWorkItem,
  onDeleteWorkItem
}) => {
  const [caseId, setCaseId] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');

  // Set default category when categories load or change
  useEffect(() => {
    if (categories.length > 0) {
      // If currently selected category doesn't exist anymore, or none selected, select first
      if (!categoryId || !categories.find(c => c.id === categoryId)) {
        setCategoryId(categories[0].id);
      }
    } else {
        setCategoryId('');
    }
  }, [categories, categoryId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) return;
    if (!description.trim()) return;

    const newItem: WorkItem = {
      id: crypto.randomUUID(),
      caseId: caseId.trim(),
      description: description.trim(),
      categoryId,
      timestamp: Date.now(),
    };

    onAddWorkItem(newItem);
    setCaseId('');
    setDescription('');
  };

  const todayStart = getStartOfToday();
  const todayEnd = getEndOfToday();
  
  const todayItems = workItems
    .filter(item => item.timestamp >= todayStart && item.timestamp <= todayEnd)
    .sort((a, b) => b.timestamp - a.timestamp); // Newest first

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Daily Tracker</h1>
            <p className="text-slate-500">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
        </div>
        
        {/* Count Badge */}
        <div className="bg-white border border-slate-200 px-4 py-2 rounded-lg shadow-sm flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-slate-900">{todayItems.length}</span> entries
            </div>
        </div>
      </header>

      <div className="space-y-3">
        {/* Inline Entry Row */}
        <div className="bg-white p-2 rounded-xl shadow-md border border-blue-200 ring-4 ring-blue-50/50 transition-all">
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2">
            
            {/* Case ID */}
            <div className="relative w-full md:w-40 group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Hash className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500" />
                </div>
                <input
                    type="text"
                    value={caseId}
                    onChange={(e) => setCaseId(e.target.value)}
                    placeholder="Case ID"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400"
                />
            </div>

            {/* Description */}
            <div className="relative flex-1 group">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AlignLeft className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500" />
                </div>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What are you working on?"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
            </div>

            {/* Category */}
            <div className="relative w-full md:w-48 group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500" />
                </div>
                <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none cursor-pointer text-slate-700"
                >
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                    {categories.length === 0 && <option value="">No categories</option>}
                </select>
                {/* Custom arrow using CSS/Borders */}
                 <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-slate-400"></div>
                </div>
            </div>

            {/* Add Button */}
            <button
                type="submit"
                disabled={!description.trim()}
                className="w-full md:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg font-medium shadow-sm transition-all flex items-center justify-center gap-2 min-w-[100px]"
            >
                <Plus className="w-4 h-4" />
                <span>Add</span>
            </button>
          </form>
        </div>

        {/* List of Items */}
        <div className="space-y-2 mt-6">
            {todayItems.length === 0 ? (
                <div className="text-center py-12 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50">
                    <p className="text-slate-400 text-sm">No work logged yet today.</p>
                </div>
            ) : (
                todayItems.map(item => {
                    const category = categories.find(c => c.id === item.categoryId);
                    return (
                        <div key={item.id} className="group bg-white p-3 md:px-4 md:py-3 rounded-xl shadow-sm border border-slate-200 hover:border-blue-300 transition-colors flex flex-col md:flex-row md:items-center gap-3">
                            
                            {/* Meta Info Section (Mobile: Top, Desktop: Left) */}
                            <div className="flex items-center gap-3 min-w-[200px]">
                                {item.caseId && (
                                    <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                                        {item.caseId}
                                    </span>
                                )}
                                {category && (
                                    <span 
                                        className="text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1.5"
                                        style={{ backgroundColor: `${category.color}15`, color: category.color }}
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: category.color }}></span>
                                        {category.name}
                                    </span>
                                )}
                            </div>

                            {/* Description (Flex Grow) */}
                            <div className="flex-1 text-sm text-slate-700 font-medium">
                                {item.description}
                            </div>

                             {/* Time & Actions (Right) */}
                            <div className="flex items-center justify-between md:justify-end gap-4 min-w-[120px]">
                                <span className="text-xs text-slate-400 tabular-nums">
                                    {formatDateTime(item.timestamp).split(',')[1]?.trim() || ''}
                                </span>
                                <button
                                    onClick={() => onDeleteWorkItem(item.id)}
                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100"
                                    title="Delete Entry"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
      </div>
    </div>
  );
};

export default DailyTracker;