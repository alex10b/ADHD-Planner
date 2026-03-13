import { useState, useRef, useEffect } from 'react';
import { useGoalsStore } from '../store/goalsStore.js';

export function QuickAddGoal() {
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const addGoal = useGoalsStore((s) => s.addGoal);
  const canAddGoal = useGoalsStore((s) => s.canAddGoal);

  useEffect(() => {
    if (expanded) inputRef.current?.focus();
  }, [expanded]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = title.trim();
    if (!t || !canAddGoal()) return;
    addGoal(t);
    setTitle('');
    setExpanded(false);
  };

  if (!canAddGoal()) return null;

  return (
    <div className="relative">
      {expanded ? (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => !title.trim() && setExpanded(false)}
            placeholder="Quick add goal..."
            className="min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-sm text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--primary)] focus:outline-none"
          />
          <button
            type="submit"
            disabled={!title.trim()}
            className="rounded-lg bg-[var(--primary)] px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
          >
            Add
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="rounded-lg px-2 py-1 text-sm text-[var(--muted)] hover:bg-[var(--hover)] hover:text-[var(--text)]"
        >
          + Goal
        </button>
      )}
    </div>
  );
}
