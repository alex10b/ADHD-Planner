import { useStatsStore } from '../store/statsStore.js';
import { getTodayKey, getPreviousDayKey, formatDisplayDate } from '../utils/dateUtils.js';

export function WeeklySummary() {
  const statsByDate = useStatsStore((s) => s.statsByDate);

  const days: { dateKey: string; focusMin: number; goals: number; tasks: number }[] = [];
  let current = getTodayKey();
  for (let i = 0; i < 7; i++) {
    const stats = statsByDate[current];
    const completedGoals = stats?.completedGoals ?? 0;
    const completedTasks = stats?.completedTasks ?? 0;
    days.push({
      dateKey: current,
      focusMin: stats?.focusMinutes ?? 0,
      goals: completedGoals,
      tasks: completedTasks,
    });
    current = getPreviousDayKey(current);
  }

  const totalFocus = days.reduce((s, d) => s + d.focusMin, 0);
  const totalTasks = days.reduce((s, d) => s + d.tasks, 0);
  const daysWithFocus = days.filter((d) => d.focusMin > 0).length;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
      <h3 className="mb-3 font-medium text-[var(--text)]">Weekly summary</h3>
      <div className="mb-4 flex gap-4 text-sm">
        <div>
          <p className="text-[var(--muted)]">Focus</p>
          <p className="font-semibold text-[var(--text)]">{totalFocus} min</p>
        </div>
        <div>
          <p className="text-[var(--muted)]">Tasks</p>
          <p className="font-semibold text-[var(--text)]">{totalTasks}</p>
        </div>
        <div>
          <p className="text-[var(--muted)]">Active days</p>
          <p className="font-semibold text-[var(--text)]">{daysWithFocus}/7</p>
        </div>
      </div>
      <div className="space-y-1.5">
        {days.map((d) => (
          <div
            key={d.dateKey}
            className="flex items-center justify-between rounded-lg bg-[var(--hover)]/50 px-3 py-2 text-sm"
          >
            <span className="text-[var(--muted)]">{formatDisplayDate(d.dateKey).split(',')[0]}</span>
            <span className="text-[var(--text)]">
              {d.focusMin} min · {d.tasks} tasks
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
