export interface DailyStats {
  date: string;
  focusMinutes: number;
  distractionMinutes: number;
  completedGoals: number;
  completedTasks: number;
  reflectionNote?: string;
}
