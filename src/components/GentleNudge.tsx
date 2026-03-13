import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NUDGE_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

interface GentleNudgeProps {
  enabled: boolean;
  isRunning: boolean;
  onDismiss: () => void;
}

export function GentleNudge({ enabled, isRunning, onDismiss }: GentleNudgeProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled || !isRunning) return;
    const id = setInterval(() => {
      setVisible(true);
    }, NUDGE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [enabled, isRunning]);

  const handleDismiss = () => {
    setVisible(false);
    onDismiss();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-24 left-4 right-4 z-40 flex justify-center"
        >
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 shadow-lg">
            <p className="mb-2 text-sm font-medium text-[var(--text)]">
              Still on track?
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleDismiss}
                className="rounded-lg bg-[var(--primary)] px-3 py-1.5 text-sm text-white"
              >
                Yes, staying focused
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--text)] hover:bg-[var(--hover)]"
              >
                Took a break
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
