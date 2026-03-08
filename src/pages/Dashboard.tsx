import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoalsStore } from '../store/goalsStore.js';
import { useStatsStore } from '../store/statsStore.js';
import { useTimerStore } from '../store/timerStore.js';
import { GoalCard } from '../components/GoalCard.jsx';
import { GoalInput } from '../components/GoalInput.jsx';
import { ProgressStats } from '../components/ProgressStats.jsx';
import { DailyReview } from '../components/DailyReview.jsx';
import { getTodayKey } from '../utils/dateUtils.js';
import { AnimatePresence } from 'framer-motion';

const MAX_GOALS = 5;

export function Dashboard() {
  const navigate = useNavigate();
  const hydrateGoals = useGoalsStore((s) => s.hydrate);
  const hydrateStats = useStatsStore((s) => s.hydrate);
  useGoalsStore((s) => s._version);
  const goalsByDate = useGoalsStore((s) => s.goalsByDate);
  const goals = goalsByDate[getTodayKey()] ?? [];
  const setCompletedGoals = useStatsStore((s) => s.setCompletedGoals);
  const setCompletedTasks = useStatsStore((s) => s.setCompletedTasks);
  const startSession = useTimerStore((s) => s.startSession);

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

  const handleStartFocus = () => {
    for (const goal of goals) {
      const task = goal.tasks.find((t) => !t.completed);
      if (task) {
        startSession(goal.id, task.id);
        navigate('/focus');
        return;
      }
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-10 px-4 py-8">
      <header>
        <h1 className="text-2xl font-semibold text-[var(--text)]">
          Today&apos;s goals
        </h1>
        <p className="mt-1 text-[var(--muted)]">
          Up to {MAX_GOALS} goals. Keep it simple.
        </p>
      </header>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </AnimatePresence>
        <GoalInput />
      </div>

      <ProgressStats />

      <DailyReview />

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleStartFocus}
          disabled={!hasIncompleteTask}
          className={`flex flex-1 items-center justify-center rounded-2xl py-4 font-medium transition ${
            hasIncompleteTask
              ? 'bg-[var(--primary)] text-white hover:opacity-90'
              : 'cursor-not-allowed bg-[var(--hover)] text-[var(--muted)]'
          }`}
        >
          Start focus mode
        </button>
        <Link
          to="/history"
          className="flex flex-1 items-center justify-center rounded-2xl border border-[var(--border)] py-4 font-medium text-[var(--text)] hover:bg-[var(--hover)]"
        >
          History
        </Link>
      </div>
    </div>
  );
}
