import { Category, WorkItem } from '../types';

const STORAGE_KEYS = {
  CATEGORIES: 'worklog_categories',
  WORK_ITEMS: 'worklog_items',
};

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Development', color: '#3b82f6' }, // blue-500
  { id: '2', name: 'Meetings', color: '#eab308' }, // yellow-500
  { id: '3', name: 'Support', color: '#ef4444' }, // red-500
  { id: '4', name: 'Research', color: '#10b981' }, // green-500
];

export const getCategories = (): Category[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  return stored ? JSON.parse(stored) : DEFAULT_CATEGORIES;
};

export const saveCategories = (categories: Category[]): void => {
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
};

export const getWorkItems = (): WorkItem[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.WORK_ITEMS);
  return stored ? JSON.parse(stored) : [];
};

export const saveWorkItems = (items: WorkItem[]): void => {
  localStorage.setItem(STORAGE_KEYS.WORK_ITEMS, JSON.stringify(items));
};
