import { useStatsStore } from '../store/statsStore.js';
import { getTodayKey } from '../utils/dateUtils.js';

export function ProgressStats() {
  const today = getTodayKey();
  const stats = useStatsStore((s) => s.statsByDate[today] ?? {
    date: today,
    focusMinutes: 0,
    distractionMinutes: 0,
    completedGoals: 0,
    completedTasks: 0,
  });

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
        <p className="text-sm text-[var(--muted)]">Focus today</p>
        <p className="mt-1 text-2xl font-semibold text-[var(--text)]">
          {stats.focusMinutes}
          <span className="ml-1 text-lg font-normal text-[var(--muted)]">min</span>
        </p>
      </div>
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
        <p className="text-sm text-[var(--muted)]">Goals done</p>
        <p className="mt-1 text-2xl font-semibold text-[var(--success)]">
          {stats.completedGoals}
        </p>
      </div>
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:col-span-2 sm:col-span-1">
        <p className="text-sm text-[var(--muted)]">Tasks done</p>
        <p className="mt-1 text-2xl font-semibold text-[var(--text)]">
          {stats.completedTasks}
        </p>
      </div>
    </div>
  );
}
