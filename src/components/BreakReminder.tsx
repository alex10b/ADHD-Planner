import { useState, useEffect } from 'react';
import { Mascot } from './Mascot.jsx';

const BREAK_MINUTES = 5;

export function BreakReminder({ onDismiss }: { onDismiss: () => void }) {
  const [secondsLeft, setSecondsLeft] = useState(BREAK_MINUTES * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setIsRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  const m = Math.floor(secondsLeft / 60);
  const s = secondsLeft % 60;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
      <div className="mb-3 flex items-center gap-3">
        <Mascot variant="rest" size={48} />
        <p className="font-medium text-[var(--text)]">
          Take a {BREAK_MINUTES}-minute break
        </p>
      </div>
      <p className="mb-4 text-sm text-[var(--muted)]">
        Short breaks help you stay focused longer.
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsRunning(true)}
          disabled={isRunning || secondsLeft === 0}
          className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {isRunning ? `${m}:${s.toString().padStart(2, '0')}` : 'Start break timer'}
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm text-[var(--text)] hover:bg-[var(--hover)]"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
