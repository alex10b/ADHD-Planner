import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStatsStore } from '../store/statsStore.js';
import { formatDisplayDate } from '../utils/dateUtils.js';

export function History() {
  const hydrate = useStatsStore((s) => s.hydrate);
  const getAllDates = useStatsStore((s) => s.getAllDates);
  const getStatsForDate = useStatsStore((s) => s.getStatsForDate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const dates = getAllDates();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <header className="mb-8">
        <Link
          to="/"
          className="text-sm text-[var(--primary)] hover:underline"
        >
          ← Back to today
        </Link>
        <h1 className="mt-4 text-2xl font-semibold text-[var(--text)]">
          History
        </h1>
        <p className="mt-1 text-[var(--muted)]">
          Past days and your progress.
        </p>
      </header>

      <ul className="space-y-3">
        {dates.length === 0 ? (
          <li className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center text-[var(--muted)]">
            No history yet. Complete goals and focus sessions to see stats here.
          </li>
        ) : (
          dates.map((dateKey) => {
            const stats = getStatsForDate(dateKey);
            return (
              <li
                key={dateKey}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:flex-nowrap"
              >
                <p className="font-medium text-[var(--text)]">
                  {formatDisplayDate(dateKey)}
                </p>
                <div className="flex gap-6 text-sm">
                  <span className="text-[var(--muted)]">
                    Focus: <strong className="text-[var(--text)]">{stats.focusMinutes} min</strong>
                  </span>
                  <span className="text-[var(--muted)]">
                    Goals: <strong className="text-[var(--success)]">{stats.completedGoals}</strong>
                  </span>
                  <span className="text-[var(--muted)]">
                    Tasks: <strong className="text-[var(--text)]">{stats.completedTasks}</strong>
                  </span>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
