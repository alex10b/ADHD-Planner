import { useGamificationStore } from '../store/gamificationStore.js';

export function LevelBadge() {
  const totalXP = useGamificationStore((s) => s.totalXP);
  const getLevel = useGamificationStore((s) => s.getLevel);
  const level = getLevel();

  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-full bg-[var(--hover)] px-3 py-1.5 text-sm text-[var(--text)]"
      title={`Level ${level} · ${totalXP} XP`}
    >
      <span aria-hidden>⬆</span>
      <span>Lv.{level}</span>
    </div>
  );
}
