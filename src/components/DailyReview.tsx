import { useState } from 'react';
import { useStatsStore } from '../store/statsStore.js';
import { getTodayKey } from '../utils/dateUtils.js';

export function DailyReview() {
  const [expanded, setExpanded] = useState(false);
  const today = getTodayKey();
  const statsByDate = useStatsStore((s) => s.statsByDate);
  const setReflectionNote = useStatsStore((s) => s.setReflectionNote);

  const stats =
    statsByDate[today] ??
    {
      date: today,
      focusMinutes: 0,
      distractionMinutes: 0,
      completedGoals: 0,
      completedTasks: 0,
    };

  const [note, setNote] = useState('');

  const handleSaveNote = () => {
    setReflectionNote(note);
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
      <button
        type="button"
        onClick={() => {
          if (!expanded) setNote(stats.reflectionNote ?? '');
          setExpanded(!expanded);
        }}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="font-medium text-[var(--text)]">Daily review</span>
        <span className="text-[var(--muted)]">{expanded ? '−' : '+'}</span>
      </button>
      {expanded && (
        <div className="mt-4 space-y-4 border-t border-[var(--border)] pt-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-[var(--muted)]">Goals completed</p>
              <p className="font-medium text-[var(--text)]">{stats.completedGoals}</p>
            </div>
            <div>
              <p className="text-[var(--muted)]">Focus time</p>
              <p className="font-medium text-[var(--text)]">{stats.focusMinutes} min</p>
            </div>
            <div>
              <p className="text-[var(--muted)]">Tasks completed</p>
              <p className="font-medium text-[var(--text)]">{stats.completedTasks}</p>
            </div>
          </div>
          <div>
            <label htmlFor="reflection" className="block text-sm text-[var(--muted)]">
              Reflection note
            </label>
            <textarea
              id="reflection"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onBlur={handleSaveNote}
              placeholder="How did today go?"
              rows={3}
              className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--primary)] focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
