import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Sparkles, Loader2, Calendar, FileText } from 'lucide-react';
import { Category, WorkItem } from '../types';
import { getWeekRange, formatDate } from '../utils/dateUtils';
import { generateWeeklySummary } from '../services/geminiService';

interface WeeklyReportProps {
  workItems: WorkItem[];
  categories: Category[];
}

const WeeklyReport: React.FC<WeeklyReportProps> = ({ workItems, categories }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { weeklyItems, chartData, rangeDisplay } = useMemo(() => {
    // getWeekRange(0) returns the current week (Monday to Sunday)
    const { start, end } = getWeekRange(0);
    
    // Filter items for current week
    const items = workItems.filter(item => item.timestamp >= start && item.timestamp <= end);
    
    // Group by category for chart
    const grouped = items.reduce((acc, item) => {
      acc[item.categoryId] = (acc[item.categoryId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const data = Object.keys(grouped).map(catId => {
      const category = categories.find(c => c.id === catId);
      return {
        name: category ? category.name : 'Unknown',
        count: grouped[catId],
        color: category ? category.color : '#94a3b8'
      };
    });

    const rangeStr = `${formatDate(start)} - ${formatDate(end)}`;

    return { weeklyItems: items, chartData: data, rangeDisplay: rangeStr };
  }, [workItems, categories]);

  const handleGenerateSummary = async () => {
    if (weeklyItems.length === 0) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateWeeklySummary(weeklyItems, categories);
      setSummary(result);
    } catch (err) {
      setError("Failed to generate summary. Please check your API key or try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Weekly Report</h1>
        <p className="text-slate-500">Review work completed during the current week.</p>
        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
          <Calendar className="w-4 h-4" />
          {rangeDisplay}
        </div>
      </header>

      {weeklyItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-200">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No Data Yet</h3>
          <p className="text-slate-500">Log work in the Daily Tracker to see it appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-6">Work Distribution by Category</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Summary Section */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-indigo-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                AI Executive Summary
              </h3>
              {!summary && (
                <button
                  onClick={handleGenerateSummary}
                  disabled={isLoading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate'}
                </button>
              )}
            </div>
            
            <div className="flex-1 bg-white/60 rounded-lg p-4 text-slate-700 text-sm leading-relaxed overflow-y-auto max-h-[300px] border border-white/50">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-indigo-400 gap-2">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <span>Analyzing work logs...</span>
                </div>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : summary ? (
                <div className="whitespace-pre-line">{summary}</div>
              ) : (
                <p className="text-slate-400 italic text-center mt-8">
                  Click generate to get an AI-powered summary of this week's performance using Gemini.
                </p>
              )}
            </div>
          </div>

          {/* Detailed List */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">Detailed Logs</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Case ID</th>
                    <th className="px-6 py-3 font-medium">Category</th>
                    <th className="px-6 py-3 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {weeklyItems.map((item) => {
                    const category = categories.find(c => c.id === item.categoryId);
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-3 text-slate-500 whitespace-nowrap">
                          {formatDate(item.timestamp)}
                        </td>
                        <td className="px-6 py-3 font-mono text-slate-600 font-medium">
                          {item.caseId}
                        </td>
                        <td className="px-6 py-3">
                          {category && (
                            <span 
                              className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                              style={{ backgroundColor: `${category.color}20`, color: category.color }}
                            >
                              {category.name}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-3 text-slate-700 max-w-md truncate">
                          {item.description}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyReport;
