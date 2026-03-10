import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoalsStore } from '../store/goalsStore.js';
import { useStatsStore } from '../store/statsStore.js';
import { useTimerStore } from '../store/timerStore.js';
import type { Goal } from '../types/goal.js';
import { GoalCard } from '../components/GoalCard.jsx';
import { GoalInput } from '../components/GoalInput.jsx';
import { ProgressStats } from '../components/ProgressStats.jsx';
import { ProgressRing } from '../components/ProgressRing.jsx';
import { StreakBadge } from '../components/StreakBadge.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { DailyReview } from '../components/DailyReview.jsx';
import { Settings } from '../components/Settings.jsx';
import { getTodayKey, getYesterdayKey } from '../utils/dateUtils.js';
import { getTimeBasedGreeting, getEncouragement } from '../utils/copy.js';
import { FocusStreakBadge } from '../components/FocusStreakBadge.jsx';
import { Logo } from '../components/Logo.jsx';
import { AnimatePresence } from 'framer-motion';

type Tab = 'focus' | 'goals' | 'more';

const EMPTY_GOALS: Goal[] = [];

export function Dashboard() {
  const [tab, setTab] = useState<Tab>('goals');
  const navigate = useNavigate();
  const hydrateGoals = useGoalsStore((s) => s.hydrate);
  const hydrateStats = useStatsStore((s) => s.hydrate);
  useGoalsStore((s) => s._version);
  const goalsByDate = useGoalsStore((s) => s.goalsByDate);
  const todayKey = getTodayKey();
  const goals = goalsByDate[todayKey] ?? EMPTY_GOALS;
  const setCompletedGoals = useStatsStore((s) => s.setCompletedGoals);
  const setCompletedTasks = useStatsStore((s) => s.setCompletedTasks);
  const prepareSession = useTimerStore((s) => s.prepareSession);
  const preset = useTimerStore((s) => s.preset);
  const customMinutes = useTimerStore((s) => s.customMinutes);
  const setPreset = useTimerStore((s) => s.setPreset);
  const setCustomMinutes = useTimerStore((s) => s.setCustomMinutes);
  const copyYesterdayGoals = useGoalsStore((s) => s.copyYesterdayGoals);
  const statsByDate = useStatsStore((s) => s.statsByDate);

  useEffect(() => {
    hydrateGoals();
    hydrateStats();
  }, [hydrateGoals, hydrateStats]);

  useEffect(() => {
    const completedGoals = goals.filter((g) => g.completed).length;
    const completedTasks = goals.reduce(
      (acc, g) => acc + g.tasks.filter((t) => t.completed).length,
      0
    );
    setCompletedGoals(completedGoals);
    setCompletedTasks(completedTasks);
  }, [goals, setCompletedGoals, setCompletedTasks]);

  const hasIncompleteTask = goals.some((g) =>
    g.tasks.some((t) => !t.completed)
  );

  const totalTasks = goals.reduce((acc, g) => acc + g.tasks.length, 0);
  const completedTasks = goals.reduce(
    (acc, g) => acc + g.tasks.filter((t) => t.completed).length,
    0
  );

  const handleStartFocus = () => {
    for (const goal of goals) {
      const task = goal.tasks.find((t) => !t.completed);
      if (task) {
        prepareSession(goal.id, task.id);
        navigate('/focus');
        return;
      }
    }
  };

  const yesterdayKey = getYesterdayKey();
  const yesterdayGoals = goalsByDate[yesterdayKey] ?? [];
  const todayStats = statsByDate[todayKey];
  const focusMin = todayStats?.focusMinutes ?? 0;
  const completedGoalsCount = goals.filter((g) => g.completed).length;
  const canCopyYesterday =
    yesterdayGoals.length > 0 && goals.length < 5;

  const tabs: { id: Tab; label: string }[] = [
    { id: 'goals', label: 'Goals' },
    { id: 'focus', label: 'Focus' },
    { id: 'more', label: 'More' },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-4">
      {/* Minimal header + tabs */}
      <header className="mb-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Logo size={28} className="shrink-0" />
            <p className="text-sm text-[var(--muted)]">{getTimeBasedGreeting()}</p>
          </div>
          <div className="flex items-center gap-2">
            <StreakBadge />
            <FocusStreakBadge />
            {totalTasks > 0 && (
              <ProgressRing completed={completedTasks} total={totalTasks} size={36} strokeWidth={3} />
            )}
          </div>
        </div>
        <nav className="mt-3 flex gap-1 rounded-xl bg-[var(--hover)] p-1" role="tablist">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition ${
                tab === id ? 'bg-[var(--card)] text-[var(--text)] shadow-sm' : 'text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      {/* Tab content — one view at a time */}
      {tab === 'focus' && (
        <div className="space-y-6">
          <p className="text-sm italic text-[var(--muted)]">{getEncouragement()}</p>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
            <p className="mb-4 text-sm font-medium text-[var(--muted)]">Session length</p>
            <div className="mb-6 flex flex-wrap gap-2">
              {([25, 35, 'custom'] as const).map((value) => (
                <button
                  key={String(value)}
                  type="button"
                  onClick={() => setPreset(value)}
                  className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                    preset === value ? 'bg-[var(--primary)] text-white' : 'bg-[var(--hover)] text-[var(--text)]'
                  }`}
                >
                  {value === 'custom' ? 'Custom' : `${value} min`}
                </button>
              ))}
              {preset === 'custom' && (
                <span className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(Number(e.target.value) || 25)}
                    className="w-14 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2 py-2 text-center text-sm text-[var(--text)]"
                  />
                  <span className="text-sm text-[var(--muted)]">min</span>
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={handleStartFocus}
              disabled={!hasIncompleteTask}
              className={`w-full rounded-xl py-4 text-base font-medium transition ${
                hasIncompleteTask
                  ? 'bg-[var(--primary)] text-white hover:opacity-90'
                  : 'cursor-not-allowed bg-[var(--hover)] text-[var(--muted)]'
              }`}
            >
              Start focus
            </button>
          </div>
          <ProgressStats />
          <Link
            to="/history"
            className="block rounded-xl border border-[var(--border)] py-3 text-center text-sm font-medium text-[var(--text)] hover:bg-[var(--hover)]"
          >
            History
          </Link>
        </div>
      )}

      {tab === 'goals' && (
        <div className="space-y-4">
          <p className="text-sm italic text-[var(--muted)]">{getEncouragement()}</p>
          {/* Quick stats line on Goals tab */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[var(--hover)]/60 px-3 py-2 text-sm text-[var(--muted)]">
            <span>
              {focusMin > 0 && <>{focusMin} min focus</>}
              {focusMin > 0 && goals.length > 0 && ' · '}
              {goals.length > 0 && (
                <>
                  {completedGoalsCount}/{goals.length} goals
                  {totalTasks > 0 && <> · {completedTasks}/{totalTasks} tasks</>}
                </>
              )}
              {focusMin === 0 && goals.length === 0 && (
                <span className="italic">No activity yet today</span>
              )}
            </span>
          </div>
          {canCopyYesterday && (
            <button
              type="button"
              onClick={() => copyYesterdayGoals()}
              className="w-full rounded-xl border border-dashed border-[var(--border)] py-3 text-sm font-medium text-[var(--primary)] hover:bg-[var(--hover)]"
            >
              {goals.length === 0 ? "Start from yesterday's goals" : "Add yesterday's goals"}
            </button>
          )}
          <EmptyState />
          <AnimatePresence mode="popLayout">
            {goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </AnimatePresence>
          <GoalInput />
        </div>
      )}

      {tab === 'more' && (
        <div className="space-y-4">
          <DailyReview />
          <Settings />
        </div>
      )}
    </div>
  );
}
