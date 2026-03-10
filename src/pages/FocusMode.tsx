import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTimerStore } from '../store/timerStore.js';
import { useGoalsStore } from '../store/goalsStore.js';
import { useSettingsStore } from '../store/settingsStore.js';
import { FocusTimer } from '../components/FocusTimer.jsx';
import { FocusModeBackground } from '../components/FocusModeBackground.jsx';
import { ReasonScreensaver } from '../components/ReasonScreensaver.jsx';
import { useFocusTimer } from '../hooks/useFocusTimer.js';
import { getTodayKey } from '../utils/dateUtils.js';
import { playFocusCompleteSound } from '../utils/sound.js';
import { motion, AnimatePresence } from 'framer-motion';

export function FocusMode() {
  const navigate = useNavigate();
  useFocusTimer();

  const focusGoalId = useTimerStore((s) => s.focusGoalId);
  const focusTaskId = useTimerStore((s) => s.focusTaskId);
  const remainingSeconds = useTimerStore((s) => s.remainingSeconds);
  const totalSeconds = useTimerStore((s) => s.totalSeconds);
  const isRunning = useTimerStore((s) => s.isRunning);
  const stop = useTimerStore((s) => s.stop);

  const goalsByDate = useGoalsStore((s) => s.goalsByDate);
  const goals = goalsByDate[getTodayKey()] ?? [];
  const toggleTask = useGoalsStore((s) => s.toggleTask);

  const goal = goals.find((g) => g.id === focusGoalId);
  const task = goal?.tasks.find((t) => t.id === focusTaskId);

  const [showSuccess, setShowSuccess] = useState(false);
  const [justFinished, setJustFinished] = useState(false);
  const soundPlayed = useRef(false);
  const soundOnFocusComplete = useSettingsStore((s) => s.soundOnFocusComplete);

  useEffect(() => {
    const timerJustEnded = remainingSeconds === 0 && !isRunning && totalSeconds > 0;
    if (timerJustEnded) {
      setJustFinished(true);
      setShowSuccess(true);
      if (soundOnFocusComplete && !soundPlayed.current) {
        soundPlayed.current = true;
        playFocusCompleteSound();
      }
      const t = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(t);
    }
  }, [remainingSeconds, isRunning, totalSeconds, soundOnFocusComplete]);

  const handleCompleteTask = () => {
    if (focusGoalId && focusTaskId) {
      toggleTask(focusGoalId, focusTaskId);
    }
    stop();
    setJustFinished(false);
    navigate('/');
  };

  const handleExit = () => {
    stop();
    navigate('/');
  };

  if (!goal && !focusGoalId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
        <p className="text-[var(--muted)]">No focus session selected.</p>
        <Link
          to="/"
          className="rounded-xl bg-[var(--primary)] px-6 py-3 text-white"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  const allReasons = [
    ...(task?.reasons ?? []),
    ...(goal?.reasons ?? []),
  ];
  const screensaverFallback = task?.title ? `Focus on: ${task.title}` : "You've got this.";

  return (
    <div className="relative flex min-h-screen flex-col bg-[var(--bg)]">
      <FocusModeBackground />
      <ReasonScreensaver reasons={allReasons} fallback={screensaverFallback} />
      <div className="relative z-10 flex justify-end gap-2 p-4">
        <button
          type="button"
          onClick={handleExit}
          className="rounded-xl border border-[var(--border)] bg-[var(--card)]/80 px-4 py-2 text-[var(--text)] backdrop-blur hover:bg-[var(--hover)]"
        >
          Exit focus
        </button>
      </div>

      <main className="relative z-10 flex flex-1 flex-col items-center px-4 pb-8 pt-[42vh] min-h-0">
        <div className="flex w-full max-w-md flex-col items-center gap-6">
          <AnimatePresence mode="wait">
            {showSuccess && justFinished ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-6 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--success)] text-4xl text-white"
                >
                  ✓
                </motion.div>
                <div>
                  <h2 className="text-xl font-semibold text-[var(--text)]">
                    Session complete
                  </h2>
                  <p className="mt-2 text-[var(--muted)]">
                    Great focus! Consider a short break.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCompleteTask}
                  className="rounded-xl bg-[var(--primary)] px-6 py-3 text-white"
                >
                  Mark task done & go back
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="focus"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex w-full flex-col items-center gap-6"
              >
                {task && (
                  <div className="w-full shrink-0 rounded-2xl border border-[var(--border)] bg-[var(--card)]/95 p-4 text-center shadow-lg backdrop-blur">
                    <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                      Current task
                    </p>
                    <p className="mt-1 text-lg font-medium text-[var(--text)]">
                      {task.title}
                    </p>
                    {goal && (
                      <p className="mt-0.5 text-sm text-[var(--muted)]">
                        {goal.title}
                      </p>
                    )}
                  </div>
                )}

                <FocusTimer />

                {isRunning && (
                  <button
                    type="button"
                    onClick={handleCompleteTask}
                    className="w-full max-w-sm rounded-xl bg-[var(--success)] py-3 font-medium text-white shadow-lg"
                  >
                    Complete task & exit
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
