import { TIP_URL } from '../config.js';

export function TipSupport() {
  if (!TIP_URL) return null;

  return (
    <a
      href={TIP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 transition hover:border-[var(--primary)]/40 hover:bg-[var(--hover)]"
    >
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/15 text-xl"
        aria-hidden
      >
        ☕
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-[var(--text)]">Enjoying Focusara?</p>
        <p className="text-sm text-[var(--muted)]">Buy me a coffee on PayPal</p>
      </div>
      <span className="shrink-0 text-[var(--primary)]" aria-hidden>
        →
      </span>
    </a>
  );
}
