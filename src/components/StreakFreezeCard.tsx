import { useGamificationStore } from '../store/gamificationStore.js';
import { getTodayKey, getYesterdayKey } from '../utils/dateUtils.js';

export function StreakFreezeCard() {
  const streakFreezesRemaining = useGamificationStore((s) => s.streakFreezesRemaining);
  const useStreakFreeze = useGamificationStore((s) => s.useStreakFreeze);
  const freezeUsedForDates = useGamificationStore((s) => s.freezeUsedForDates);
  const today = getTodayKey();
  const yesterday = getYesterdayKey();
  const canFreezeToday = !freezeUsedForDates.includes(today);
  const canFreezeYesterday = !freezeUsedForDates.includes(yesterday);

  if (streakFreezesRemaining <= 0) return null;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
      <p className="mb-1 font-medium text-[var(--text)]">Streak freeze</p>
      <p className="mb-3 text-sm text-[var(--muted)]">
        You have {streakFreezesRemaining} freeze{streakFreezesRemaining !== 1 ? 's' : ''}. Use one to protect your streak on a missed day.
      </p>
      <div className="flex gap-2">
        {canFreezeToday && (
          <button
            type="button"
            onClick={() => useStreakFreeze(today)}
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm text-[var(--text)] hover:bg-[var(--hover)]"
          >
            Freeze today
          </button>
        )}
        {canFreezeYesterday && (
          <button
            type="button"
            onClick={() => useStreakFreeze(yesterday)}
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm text-[var(--text)] hover:bg-[var(--hover)]"
          >
            Freeze yesterday
          </button>
        )}
      </div>
    </div>
  );
}
