import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStatsStore } from '../store/statsStore.js';
import { useGoalsStore } from '../store/goalsStore.js';
import { formatDisplayDate } from '../utils/dateUtils.js';
import type { Goal, Priority } from '../types/goal.js';
import type { Task } from '../types/task.js';

function priorityColor(priority: Priority): string {
  return priority === 'high'
    ? 'var(--warning)'
    : priority === 'medium'
      ? 'var(--primary)'
      : 'var(--muted)';
}

function PastGoal({ goal }: { goal: Goal }) {
  const completedTasks = goal.tasks.filter((t) => t.completed).length;
  const totalTasks = goal.tasks.length;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3">
      <div className="flex items-center gap-2">
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: priorityColor(goal.priority) }}
          aria-hidden
        />
        <h4
          className={`text-sm font-medium text-[var(--text)] ${
            goal.completed ? 'line-through text-[var(--muted)]' : ''
          }`}
        >
          {goal.title || 'Untitled goal'}
        </h4>
        {goal.completed && (
          <span className="text-xs text-[var(--success)]">✓</span>
        )}
      </div>
      {goal.description && (
        <p className="mt-1 text-xs text-[var(--muted)]">{goal.description}</p>
      )}
      {goal.tasks.length > 0 && (
        <ul className="mt-2 space-y-1 pl-3 text-sm">
          {goal.tasks.map((task: Task) => (
            <li
              key={task.id}
              className={`flex items-center gap-2 ${
                task.completed ? 'text-[var(--muted)]' : 'text-[var(--text)]'
              }`}
            >
              <span className="shrink-0">
                {task.completed ? '✓' : '○'}
              </span>
              <span className={task.completed ? 'line-through' : ''}>
                {task.title || 'Untitled task'}
              </span>
            </li>
          ))}
        </ul>
      )}
      {totalTasks > 0 && (
        <p className="mt-2 text-xs text-[var(--muted)]">
          Tasks {completedTasks}/{totalTasks}
        </p>
      )}
    </div>
  );
}

interface HistoryProps {
  /** When true, hide the back link (used when embedded in Dashboard tab) */
  embedded?: boolean;
}

export function History({ embedded = false }: HistoryProps = {}) {
  const statsByDate = useStatsStore((s) => s.statsByDate);
  const hydrateStats = useStatsStore((s) => s.hydrate);
  const getStatsForDate = useStatsStore((s) => s.getStatsForDate);

  const goalsByDate = useGoalsStore((s) => s.goalsByDate);
  const hydrateGoals = useGoalsStore((s) => s.hydrate);
  const getGoalsForDate = useGoalsStore((s) => s.getGoalsForDate);

  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());

  useEffect(() => {
    hydrateStats();
    hydrateGoals();
  }, [hydrateStats, hydrateGoals]);

  const dates = useMemo(() => {
    const fromStats = Object.keys(statsByDate);
    const fromGoals = Object.keys(goalsByDate);
    const merged = [...new Set([...fromStats, ...fromGoals])];
    return merged.sort((a, b) => b.localeCompare(a));
  }, [statsByDate, goalsByDate]);

  const toggleDate = (dateKey: string) => {
    setExpandedDates((prev) => {
      const next = new Set(prev);
      if (next.has(dateKey)) next.delete(dateKey);
      else next.add(dateKey);
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-4">
      <header className="mb-6">
        {!embedded && (
          <Link
            to="/"
            className="text-sm text-[var(--primary)] hover:underline"
          >
            ← Back to today
          </Link>
        )}
        <h1 className={embedded ? 'text-xl font-semibold text-[var(--text)]' : 'mt-4 text-2xl font-semibold text-[var(--text)]'}>
          History
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Past days, goals, and tasks. Tap a day to see details.
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
            const goals = getGoalsForDate(dateKey);
            const hasGoals = goals.length > 0;
            const isExpanded = expandedDates.has(dateKey);

            return (
              <li
                key={dateKey}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => hasGoals && toggleDate(dateKey)}
                  className={`flex w-full flex-wrap items-center justify-between gap-4 p-4 text-left sm:flex-nowrap ${
                    hasGoals ? 'cursor-pointer hover:bg-[var(--hover)]' : ''
                  }`}
                  aria-expanded={hasGoals ? isExpanded : undefined}
                >
                  <p className="font-medium text-[var(--text)]">
                    {formatDisplayDate(dateKey)}
                  </p>
                  <div className="flex gap-6 text-sm">
                    <span className="text-[var(--muted)]">
                      Focus:{' '}
                      <strong className="text-[var(--text)]">
                        {stats.focusMinutes} min
                      </strong>
                    </span>
                    <span className="text-[var(--muted)]">
                      Goals:{' '}
                      <strong className="text-[var(--success)]">
                        {stats.completedGoals}
                      </strong>
                    </span>
                    <span className="text-[var(--muted)]">
                      Tasks:{' '}
                      <strong className="text-[var(--text)]">
                        {stats.completedTasks}
                      </strong>
                    </span>
                  </div>
                  {hasGoals && (
                    <span
                      className={`shrink-0 text-[var(--muted)] transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                      aria-hidden
                    >
                      ▼
                    </span>
                  )}
                </button>

                {hasGoals && isExpanded && (
                  <div className="border-t border-[var(--border)] bg-[var(--bg)] p-4">
                    <p className="mb-3 text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
                      Goals & tasks
                    </p>
                    <div className="space-y-3">
                      {goals.map((goal) => (
                        <PastGoal key={goal.id} goal={goal} />
                      ))}
                    </div>
                  </div>
                )}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
