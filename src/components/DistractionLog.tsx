import { useState } from 'react';
import { useStatsStore } from '../store/statsStore.js';

const PRESETS = [1, 5, 10] as const;

export function DistractionLog({ onDismiss }: { onDismiss: () => void }) {
  const [minutes, setMinutes] = useState(5);
  const addDistractionMinutes = useStatsStore((s) => s.addDistractionMinutes);

  const handleLog = () => {
    addDistractionMinutes(minutes);
    onDismiss();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xl">
        <h3 className="mb-2 text-lg font-semibold text-[var(--text)]">
          Log distraction
        </h3>
        <p className="mb-4 text-sm text-[var(--muted)]">
          How many minutes were you distracted?
        </p>
        <div className="mb-4 flex gap-2">
          {PRESETS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMinutes(m)}
              className={`flex-1 rounded-xl py-2 text-sm font-medium transition ${
                minutes === m ? 'bg-[var(--primary)] text-white' : 'bg-[var(--hover)] text-[var(--text)]'
              }`}
            >
              {m} min
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            min={1}
            max={60}
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value) || 1)}
            className="w-20 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-center text-[var(--text)]"
          />
          <span className="flex items-center text-sm text-[var(--muted)]">minutes</span>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={handleLog}
            className="flex-1 rounded-xl bg-[var(--primary)] py-3 text-sm font-medium text-white"
          >
            Log
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-xl border border-[var(--border)] px-4 py-3 text-sm text-[var(--text)] hover:bg-[var(--hover)]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
