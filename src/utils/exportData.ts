import type { Goal } from '../types/goal.js';
import type { DailyStats } from '../types/stats.js';

type GoalsByDate = Record<string, Goal[]>;

export function exportAsJson(goalsByDate: GoalsByDate, statsByDate: Record<string, DailyStats>): string {
  const data = {
    exportedAt: new Date().toISOString(),
    goals: goalsByDate,
    stats: statsByDate,
  };
  return JSON.stringify(data, null, 2);
}

export function exportAsCsv(goalsByDate: GoalsByDate, statsByDate: Record<string, DailyStats>): string {
  const rows: string[][] = [
    ['Date', 'Focus (min)', 'Goals done', 'Tasks done', 'Distraction (min)', 'Goals summary'],
  ];
  const allDates = new Set([...Object.keys(goalsByDate), ...Object.keys(statsByDate)]);
  const sorted = [...allDates].sort((a, b) => b.localeCompare(a));
  for (const date of sorted) {
    const stats = statsByDate[date];
    const goals = goalsByDate[date] ?? [];
    const goalsSummary = goals.map((g) => g.title).join('; ');
    rows.push([
      date,
      String(stats?.focusMinutes ?? 0),
      String(stats?.completedGoals ?? 0),
      String(stats?.completedTasks ?? 0),
      String(stats?.distractionMinutes ?? 0),
      `"${goalsSummary.replace(/"/g, '""')}"`,
    ]);
  }
  return rows.map((r) => r.join(',')).join('\n');
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
