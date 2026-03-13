import { useGamificationStore } from '../store/gamificationStore.js';
import { formatDisplayDate } from '../utils/dateUtils.js';

export function FocusSessionHistory() {
  const getFocusSessions = useGamificationStore((s) => s.getFocusSessions);
  const sessions = getFocusSessions(20);

  if (sessions.length === 0) return null;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
      <h3 className="mb-3 font-medium text-[var(--text)]">Focus sessions</h3>
      <ul className="max-h-48 space-y-2 overflow-y-auto">
        {sessions.map((s) => (
          <li
            key={s.id}
            className="flex items-center justify-between rounded-lg bg-[var(--hover)]/50 px-3 py-2 text-sm"
          >
            <div className="min-w-0">
              <p className="truncate font-medium text-[var(--text)]">
                {s.taskTitle || s.goalTitle || 'Focus session'}
              </p>
              <p className="text-xs text-[var(--muted)]">{formatDisplayDate(s.dateKey)}</p>
            </div>
            <span className="ml-2 shrink-0 font-medium text-[var(--primary)]">
              {s.minutes} min
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
