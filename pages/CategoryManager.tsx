import React, { useState } from 'react';
import { Plus, Tag, X } from 'lucide-react';
import { Category } from '../types';

interface CategoryManagerProps {
  categories: Category[];
  onAddCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
}

const COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#eab308', // yellow
  '#8b5cf6', // purple
  '#f97316', // orange
  '#ec4899', // pink
  '#6366f1', // indigo
];

const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  onAddCategory,
  onDeleteCategory
}) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: name.trim(),
      color: selectedColor,
    };

    onAddCategory(newCategory);
    setName('');
    setSelectedColor(COLORS[0]);
  };

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
        <p className="text-slate-500">Manage the types of work you track.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-6">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add New Category
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maintenance"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Color Label</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${selectedColor === color ? 'border-slate-600 scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
              >
                Create Category
              </button>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((category) => (
            <div 
              key={category.id} 
              className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between group hover:border-blue-300 transition-all"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: category.color }}
                >
                  {category.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-medium text-slate-800">{category.name}</h4>
                  <p className="text-xs text-slate-400">ID: {category.id.slice(0, 8)}...</p>
                </div>
              </div>
              <button
                onClick={() => onDeleteCategory(category.id)}
                className="text-slate-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                title="Delete Category"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}

          {categories.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              No categories defined.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;
