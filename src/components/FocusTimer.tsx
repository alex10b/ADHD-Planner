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
  const focusGoalId = useTimerStore((s) => s.focusGoalId);
  const focusTaskId = useTimerStore((s) => s.focusTaskId);
  const startSession = useTimerStore((s) => s.startSession);
  const remainingSeconds = useTimerStore((s) => s.remainingSeconds);
  const isRunning = useTimerStore((s) => s.isRunning);
  const isPaused = useTimerStore((s) => s.isPaused);
  const pause = useTimerStore((s) => s.pause);
  const resume = useTimerStore((s) => s.resume);

  const sessionPrepared = focusGoalId && focusTaskId && !isRunning && remainingSeconds === 0;
  const showPresets = sessionPrepared;

  const handleStartTimer = () => {
    if (focusGoalId && focusTaskId) startSession(focusGoalId, focusTaskId);
  };

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6">
      <div className="text-center">
        <div
          className="font-mono text-5xl tabular-nums text-[var(--text)] sm:text-6xl"
          aria-live="polite"
        >
          {formatTime(remainingSeconds)}
        </div>
        {isPaused && (
          <p className="mt-2 text-sm text-[var(--muted)]">Paused</p>
        )}
      </div>

      {showPresets && (
        <div className="flex w-full flex-col items-center gap-4">
          <p className="text-sm font-medium text-[var(--muted)]">Choose duration</p>
          <div className="flex flex-wrap justify-center gap-2">
            {PRESETS.map((p) => (
              <button
                key={String(p.value)}
                type="button"
                onClick={() => setPreset(p.value)}
                className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  preset === p.value
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-[var(--card)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--hover)]'
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
                className="w-20 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-center text-[var(--text)]"
              />
              <span className="text-sm text-[var(--muted)]">minutes</span>
            </div>
          )}
          <button
            type="button"
            onClick={handleStartTimer}
            className="mt-2 w-full rounded-xl bg-[var(--primary)] py-3 font-medium text-white"
          >
            Start timer
          </button>
        </div>
      )}

      {isRunning && (
        <div className="flex gap-3">
          <button
            type="button"
            onClick={isPaused ? resume : pause}
            className="rounded-xl bg-[var(--card)] border border-[var(--border)] px-6 py-3 text-[var(--text)] hover:bg-[var(--hover)]"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        </div>
      )}
    </div>
  );
}
