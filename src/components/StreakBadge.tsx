import { useGoalsStore } from '../store/goalsStore.js';
import { useStatsStore } from '../store/statsStore.js';
import { useGamificationStore } from '../store/gamificationStore.js';
import { getTodayKey } from '../utils/dateUtils.js';
import { getPlanningStreak } from '../utils/streakUtils.js';

export function StreakBadge() {
  const goalsByDate = useGoalsStore((s) => s.goalsByDate);
  const statsByDate = useStatsStore((s) => s.statsByDate);
  const freezeUsedForDates = useGamificationStore((s) => s.freezeUsedForDates);
  const today = getTodayKey();
  const streak = getPlanningStreak(today, goalsByDate, statsByDate, freezeUsedForDates);

  if (streak === 0) return null;

  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-full bg-[var(--hover)] px-3 py-1.5 text-sm text-[var(--text)]"
      title="Days in a row you’ve planned or focused"
    >
      <span className="text-[var(--warning)]" aria-hidden>🔥</span>
      <span>
        {streak} day{streak !== 1 ? 's' : ''} streak
      </span>
    </div>
  );
}
