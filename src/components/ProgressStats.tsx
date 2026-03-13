import { useStatsStore } from '../store/statsStore.js';
import { useGoalsStore } from '../store/goalsStore.js';
import { getTodayKey } from '../utils/dateUtils.js';

export function ProgressStats() {
  const today = getTodayKey();
  const statsByDate = useStatsStore((s) => s.statsByDate);
  const goalsByDate = useGoalsStore((s) => s.goalsByDate);
  const goals = goalsByDate[today] ?? [];
  const totalTasks = goals.reduce((acc, g) => acc + g.tasks.length, 0);

  const stats =
    statsByDate[today] ??
    {
      date: today,
      focusMinutes: 0,
      distractionMinutes: 0,
      completedGoals: 0,
      completedTasks: 0,
    };

  let summary: React.ReactNode;
  if (stats.focusMinutes > 0 || goals.length > 0) {
    summary = (
      <>
        {stats.focusMinutes > 0 && <>{stats.focusMinutes} min focus</>}
        {stats.focusMinutes > 0 && goals.length > 0 && ' · '}
        {goals.length > 0 && (
          <>
            {stats.completedGoals}/{goals.length} goals
            {totalTasks > 0 && <> · {stats.completedTasks}/{totalTasks} tasks</>}
          </>
        )}
      </>
    );
  } else {
    summary = <span className="italic">No activity yet today</span>;
  }

  return (
    <div className="flex flex-wrap items-center rounded-xl bg-[var(--hover)]/60 px-3 py-2.5 text-sm text-[var(--muted)]">
      {summary}
    </div>
  );
}
