export const getStartOfToday = (): number => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.getTime();
};

export const getEndOfToday = (): number => {
  const now = new Date();
  now.setHours(23, 59, 59, 999);
  return now.getTime();
};

export const getWeekRange = (weekOffset: number = 0): { start: number; end: number } => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 is Sunday
  
  // Calculate start of current week (Monday)
  // If today is Sunday (0), subtract 6 days. If Monday (1), subtract 0 days.
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  
  const currentWeekStart = new Date(now);
  currentWeekStart.setDate(now.getDate() - daysToSubtract);
  currentWeekStart.setHours(0, 0, 0, 0);

  const start = new Date(currentWeekStart);
  start.setDate(currentWeekStart.getDate() + (weekOffset * 7));

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return {
    start: start.getTime(),
    end: end.getTime()
  };
};

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
