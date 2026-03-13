import { useGoalsStore } from '../store/goalsStore.js';
import { getTodayKey } from '../utils/dateUtils.js';
import { Mascot } from './Mascot.jsx';

const SUGGESTIONS = [
  { title: 'One important thing', description: 'The single thing that would make today a win' },
  { title: 'Deep work block', description: 'Focused time on one project' },
  { title: 'Clear the deck', description: 'Small tasks that will free your mind' },
] as const;

export function EmptyState() {
  const addGoal = useGoalsStore((s) => s.addGoal);
  const goalsByDate = useGoalsStore((s) => s.goalsByDate);
  const goals = goalsByDate[getTodayKey()] ?? [];

  if (goals.length > 0) return null;

  return (
    <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)] p-8 text-center">
      <div className="mx-auto mb-4 flex justify-center" aria-hidden>
        <Mascot variant="idle" size={80} />
      </div>
      <h2 className="text-lg font-medium text-[var(--text)]">
        Plan your day in small steps
      </h2>
      <p className="mt-2 max-w-sm mx-auto text-sm text-[var(--muted)]">
        Add up to 5 goals. Break each into tiny tasks. Focus on one at a time.
      </p>
      <p className="mt-4 text-sm font-medium text-[var(--muted)]">
        Quick add a goal:
      </p>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.title}
            type="button"
            onClick={() => addGoal(s.title, s.description)}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--text)] transition hover:border-[var(--primary)] hover:bg-[var(--hover)]"
          >
            {s.title}
          </button>
        ))}
      </div>
    </div>
  );
}
