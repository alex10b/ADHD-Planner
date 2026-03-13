import { useState, useEffect } from 'react';
import { useGoalsStore } from '../store/goalsStore.js';
import { useStatsStore } from '../store/statsStore.js';
import { useSettingsStore } from '../store/settingsStore.js';
import { TIP_URL } from '../config.js';
import { getTodayKey } from '../utils/dateUtils.js';
import { getPlanningStreak } from '../utils/streakUtils.js';

function getDaysOfUse(goalsByDate: Record<string, unknown[]>, statsByDate: Record<string, { focusMinutes?: number; completedTasks?: number; completedGoals?: number }>): number {
  const fromGoals = Object.keys(goalsByDate).filter((k) => (goalsByDate[k]?.length ?? 0) > 0);
  const fromStats = Object.keys(statsByDate).filter(
    (k) =>
      (statsByDate[k]?.focusMinutes ?? 0) > 0 ||
      (statsByDate[k]?.completedTasks ?? 0) > 0 ||
      (statsByDate[k]?.completedGoals ?? 0) > 0
  );
  return new Set([...fromGoals, ...fromStats]).size;
}

export function TipPopup() {
  const [visible, setVisible] = useState(false);
  const goalsByDate = useGoalsStore((s) => s.goalsByDate);
  const statsByDate = useStatsStore((s) => s.statsByDate);
  const tipPopupMilestonesShown = useSettingsStore((s) => s.tipPopupMilestonesShown);
  const markTipPopupShown = useSettingsStore((s) => s.markTipPopupShown);

  const todayKey = getTodayKey();
  const daysOfUse = getDaysOfUse(goalsByDate, statsByDate);
  const streak = getPlanningStreak(todayKey, goalsByDate, statsByDate);

  const milestone = (() => {
    if (daysOfUse >= 2 && !tipPopupMilestonesShown.includes(2)) return 2;
    if (streak >= 5 && streak % 5 === 0 && !tipPopupMilestonesShown.includes(streak)) return streak;
    return null;
  })();

  useEffect(() => {
    if (!TIP_URL || milestone == null) return;
    setVisible(true);
  }, [milestone]);

  const handleDismiss = () => {
    if (milestone != null) markTipPopupShown(milestone);
    setVisible(false);
  };

  if (!visible || milestone == null) return null;

  const isDay2 = milestone === 2;
  const message = isDay2
    ? "You're on your 2nd day — nice! Enjoying Focusara?"
    : `You've hit a ${streak}-day streak! 🎉 Support the app?`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tip-popup-title"
    >
      <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/15 text-2xl" aria-hidden>
            ☕
          </span>
          <button
            type="button"
            onClick={handleDismiss}
            className="rounded-lg p-1.5 text-[var(--muted)] hover:bg-[var(--hover)] hover:text-[var(--text)]"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
        <h2 id="tip-popup-title" className="mb-2 text-lg font-semibold text-[var(--text)]">
          {message}
        </h2>
        <p className="mb-4 text-sm text-[var(--muted)]">
          If Focusara helps you stay on track, consider buying me a coffee on PayPal.
        </p>
        <div className="flex gap-2">
          <a
            href={TIP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleDismiss}
            className="flex-1 rounded-xl bg-[var(--primary)] py-3 text-center text-sm font-medium text-white hover:opacity-90"
          >
            Buy me a coffee
          </a>
          <button
            type="button"
            onClick={handleDismiss}
            className="rounded-xl border border-[var(--border)] px-4 py-3 text-sm font-medium text-[var(--text)] hover:bg-[var(--hover)]"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
