import { useStatsStore } from '../store/statsStore.js';
import { useGamificationStore } from '../store/gamificationStore.js';
import { getTodayKey } from '../utils/dateUtils.js';
import { getFocusStreak } from '../utils/streakUtils.js';

export function FocusStreakBadge() {
  const statsByDate = useStatsStore((s) => s.statsByDate);
  const freezeUsedForDates = useGamificationStore((s) => s.freezeUsedForDates);
  const today = getTodayKey();
  const streak = getFocusStreak(today, statsByDate, freezeUsedForDates);

  if (streak === 0) return null;

  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-full bg-[var(--hover)] px-2.5 py-1 text-xs text-[var(--text)]"
      title="Days in a row you’ve done a focus session"
    >
      <span aria-hidden>⏱</span>
      <span>{streak} focus</span>
    </div>
  );
}
