export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface WorkItem {
  id: string;
  caseId: string;
  description: string;
  categoryId: string;
  timestamp: number; // Unix timestamp in milliseconds
}

export type View = 'daily' | 'categories' | 'weekly';

export interface WeeklySummary {
  totalItems: number;
  categoryBreakdown: Record<string, number>;
  aiSummary?: string;
}
