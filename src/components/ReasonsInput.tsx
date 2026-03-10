import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReasonsInputProps {
  label: string;
  reasons: string[];
  onAdd: (reason: string) => void;
  onRemove: (index: number) => void;
  placeholder?: string;
  /** If true, show compact (e.g. inside task row) */
  compact?: boolean;
}

export function ReasonsInput({
  label,
  reasons,
  onAdd,
  onRemove,
  placeholder = "Why does this matter?",
  compact = false,
}: ReasonsInputProps) {
  const [value, setValue] = useState('');
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = value.trim();
    if (!t) return;
    onAdd(t);
    setValue('');
  };

  const showInline = expanded || reasons.length > 0;

  return (
    <div className={compact ? 'mt-1' : 'mt-3'}>
      {compact ? (
        <>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-[var(--muted)] hover:text-[var(--primary)]"
          >
            {reasons.length > 0 ? `Why (${reasons.length})` : 'Add why'}
          </button>
          <AnimatePresence>
            {showInline && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-1.5 space-y-1.5">
                  {reasons.map((r, i) => (
                    <span
                      key={`${r}-${i}`}
                      className="inline-flex items-center gap-1 rounded-lg bg-[var(--hover)] px-2 py-0.5 text-xs text-[var(--text)]"
                    >
                      {r}
                      <button
                        type="button"
                        onClick={() => onRemove(i)}
                        className="rounded p-0.5 hover:bg-[var(--border)]"
                        aria-label="Remove"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <form onSubmit={handleSubmit} className="flex gap-1">
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder={placeholder}
                      className="min-w-0 flex-1 rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-xs text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--primary)] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="rounded bg-[var(--primary)] px-2 py-1 text-xs text-white"
                    >
                      Add
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <>
          <p className="mb-1.5 text-sm font-medium text-[var(--muted)]">{label}</p>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence mode="popLayout">
              {reasons.map((r, i) => (
                <motion.span
                  key={`${r}-${i}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--hover)] px-3 py-1.5 text-sm text-[var(--text)]"
                >
                  {r}
                  <button
                    type="button"
                    onClick={() => onRemove(i)}
                    className="rounded p-0.5 hover:bg-[var(--border)]"
                    aria-label="Remove reason"
                  >
                    ×
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
          <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--primary)] focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm text-white"
            >
              Add
            </button>
          </form>
        </>
      )}
    </div>
  );
}
