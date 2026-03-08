import { useState } from 'react';
import type { Priority } from '../types/goal.js';
import { useGoalsStore } from '../store/goalsStore.js';
import { getTodayKey } from '../utils/dateUtils.js';

const PRIORITIES: { value: Priority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const MAX_GOALS_PER_DAY = 5;

export function GoalInput() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [expanded, setExpanded] = useState(false);

  const addGoal = useGoalsStore((s) => s.addGoal);
  useGoalsStore((s) => s._version);
  const goalsByDate = useGoalsStore((s) => s.goalsByDate);
  const canAddGoal = (goalsByDate[getTodayKey()] ?? []).length < MAX_GOALS_PER_DAY;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    addGoal(t, description.trim() || undefined, priority);
    setTitle('');
    setDescription('');
    setPriority('medium');
    setExpanded(false);
  };

  if (!canAddGoal) return null;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
      {!expanded ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[var(--muted)] transition hover:bg-[var(--hover)] hover:text-[var(--primary)]"
        >
          <span className="text-xl">+</span>
          <span>Add goal</span>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Goal title"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--primary)] focus:outline-none"
            autoFocus
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--primary)] focus:outline-none"
          />
          <div className="flex flex-wrap gap-2">
            {PRIORITIES.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPriority(p.value)}
                className={`rounded-lg px-3 py-1.5 text-sm transition ${
                  priority === p.value
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-[var(--hover)] text-[var(--muted)] hover:text-[var(--text)]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 rounded-xl bg-[var(--primary)] py-3 font-medium text-white transition hover:opacity-90"
            >
              Add goal
            </button>
            <button
              type="button"
              onClick={() => {
                setExpanded(false);
                setTitle('');
                setDescription('');
              }}
              className="rounded-xl border border-[var(--border)] px-4 py-3 text-[var(--text)] transition hover:bg-[var(--hover)]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
