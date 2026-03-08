import { useTimerStore, type TimerPreset } from '../store/timerStore.js';

const PRESETS: { value: TimerPreset; label: string }[] = [
  { value: 25, label: '25 min' },
  { value: 35, label: '35 min' },
  { value: 'custom', label: 'Custom' },
];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function FocusTimer() {
  const preset = useTimerStore((s) => s.preset);
  const customMinutes = useTimerStore((s) => s.customMinutes);
  const setPreset = useTimerStore((s) => s.setPreset);
  const setCustomMinutes = useTimerStore((s) => s.setCustomMinutes);
  const remainingSeconds = useTimerStore((s) => s.remainingSeconds);
  const isRunning = useTimerStore((s) => s.isRunning);
  const isPaused = useTimerStore((s) => s.isPaused);
  const pause = useTimerStore((s) => s.pause);
  const resume = useTimerStore((s) => s.resume);

  const showPresets = !isRunning && remainingSeconds === 0;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <div
          className="font-mono text-6xl tabular-nums text-[var(--text)] sm:text-7xl"
          aria-live="polite"
        >
          {formatTime(remainingSeconds)}
        </div>
        {isPaused && (
          <p className="mt-2 text-sm text-[var(--muted)]">Paused</p>
        )}
      </div>

      {showPresets && (
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-wrap justify-center gap-2">
            {PRESETS.map((p) => (
              <button
                key={String(p.value)}
                type="button"
                onClick={() => setPreset(p.value)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  preset === p.value
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-[var(--hover)] text-[var(--text)] hover:bg-[var(--border)]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          {preset === 'custom' && (
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={120}
                value={customMinutes}
                onChange={(e) => setCustomMinutes(Number(e.target.value) || 25)}
                className="w-20 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-center text-[var(--text)]"
              />
              <span className="text-[var(--muted)]">minutes</span>
            </div>
          )}
        </div>
      )}

      {isRunning && (
        <div className="flex gap-3">
          <button
            type="button"
            onClick={isPaused ? resume : pause}
            className="rounded-xl bg-[var(--hover)] px-6 py-3 text-[var(--text)] hover:bg-[var(--border)]"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        </div>
      )}
    </div>
  );
}
