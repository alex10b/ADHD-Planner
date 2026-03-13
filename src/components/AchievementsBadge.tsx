import { useState } from 'react';
import { useGamificationStore, ACHIEVEMENTS, type AchievementId } from '../store/gamificationStore.js';

const ALL_IDS = Object.keys(ACHIEVEMENTS) as AchievementId[];

export function AchievementsBadge() {
  const [expanded, setExpanded] = useState(false);
  const unlockedAchievements = useGamificationStore((s) => s.unlockedAchievements);
  const count = unlockedAchievements.length;

  if (count === 0) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="inline-flex items-center gap-1.5 rounded-full bg-[var(--hover)] px-3 py-1.5 text-sm text-[var(--text)]"
        title="Achievements"
      >
        <span aria-hidden>🏅</span>
        <span>{count}</span>
      </button>
      {expanded && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setExpanded(false)}
            aria-hidden
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3 shadow-xl">
            <p className="mb-2 text-xs font-medium text-[var(--muted)]">Achievements</p>
            <div className="max-h-48 space-y-1.5 overflow-y-auto">
              {ALL_IDS.map((id) => {
                const a = ACHIEVEMENTS[id];
                const unlocked = unlockedAchievements.includes(id);
                return (
                  <div
                    key={id}
                    className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm ${
                      unlocked ? 'text-[var(--text)]' : 'opacity-40'
                    }`}
                  >
                    <span>{a.emoji}</span>
                    <span>{a.label}</span>
                    {unlocked && <span className="ml-auto text-[var(--success)]">✓</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
