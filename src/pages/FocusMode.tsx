import { useEffect, useState, useRef } from 'react';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts.js';
import { Link, useNavigate } from 'react-router-dom';
import { useTimerStore } from '../store/timerStore.js';
import { useGoalsStore } from '../store/goalsStore.js';
import { useSettingsStore } from '../store/settingsStore.js';
import { FocusTimer } from '../components/FocusTimer.jsx';
import { FocusModeBackground } from '../components/FocusModeBackground.jsx';
import { ReasonScreensaver } from '../components/ReasonScreensaver.jsx';
import { BreakReminder } from '../components/BreakReminder.jsx';
import { BodyDoubling } from '../components/BodyDoubling.jsx';
import { DistractionLog } from '../components/DistractionLog.jsx';
import { WhyReminder } from '../components/WhyReminder.jsx';
import { GentleNudge } from '../components/GentleNudge.jsx';
import { useFocusTimer } from '../hooks/useFocusTimer.js';
import { useGamificationStore } from '../store/gamificationStore.js';
import { getTodayKey } from '../utils/dateUtils.js';
import { playFocusCompleteSound } from '../utils/sound.js';
import { hapticSuccess, hapticLight } from '../utils/haptic.js';
import { motion, AnimatePresence } from 'framer-motion';
import { Mascot } from '../components/Mascot.jsx';

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
  const breakReminderEnabled = useSettingsStore((s) => s.breakReminderEnabled);
  const bodyDoublingEnabled = useSettingsStore((s) => s.bodyDoublingEnabled);
  const justOneTaskMode = useSettingsStore((s) => s.justOneTaskMode);
  const gentleNudgesEnabled = useSettingsStore((s) => s.gentleNudgesEnabled);
  const [showBreakReminder, setShowBreakReminder] = useState(false);
  const [showDistractionLog, setShowDistractionLog] = useState(false);

  const addFocusSession = useGamificationStore((s) => s.addFocusSession);
  const getEffectiveDurationMinutes = useTimerStore((s) => s.getEffectiveDurationMinutes);
  const sessionRecorded = useRef(false);

  useEffect(() => {
    const timerJustEnded = remainingSeconds === 0 && !isRunning && totalSeconds > 0;
    if (timerJustEnded) {
      setJustFinished(true);
      setShowSuccess(true);
      hapticSuccess();
      if (soundOnFocusComplete && !soundPlayed.current) {
        soundPlayed.current = true;
        playFocusCompleteSound();
      }
      if (!sessionRecorded.current) {
        sessionRecorded.current = true;
        const minutes = getEffectiveDurationMinutes();
        if (minutes > 0) {
          addFocusSession({
            dateKey: getTodayKey(),
            taskTitle: task?.title,
            goalTitle: goal?.title,
            minutes,
          });
        }
      }
      const t = setTimeout(() => {
        setShowSuccess(false);
        if (breakReminderEnabled) setShowBreakReminder(true);
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [remainingSeconds, isRunning, totalSeconds, soundOnFocusComplete, breakReminderEnabled, addFocusSession, getEffectiveDurationMinutes, task?.title, goal?.title]);

  const handleCompleteTask = () => {
    hapticLight();
    if (focusGoalId && focusTaskId) {
      toggleTask(focusGoalId, focusTaskId);
    }
    stop();
    setJustFinished(false);
    setShowBreakReminder(false);
    navigate('/');
  };

  const handleExit = () => {
    hapticLight();
    stop();
    navigate('/');
  };

  useKeyboardShortcuts({ onExitFocus: handleExit }, true);

  if (!goal && !focusGoalId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
        <Mascot variant="idle" size={72} />
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
    <div className="relative flex h-screen min-h-[600px] flex-col overflow-hidden bg-[var(--bg)]">
      <BodyDoubling enabled={bodyDoublingEnabled && isRunning} />
      {showDistractionLog && (
        <DistractionLog onDismiss={() => setShowDistractionLog(false)} />
      )}
      <GentleNudge
        enabled={gentleNudgesEnabled}
        isRunning={isRunning}
        onDismiss={() => {}}
      />
      <FocusModeBackground />
      {!justOneTaskMode && (
        <ReasonScreensaver reasons={allReasons} fallback={screensaverFallback} />
      )}
      <div className="relative z-10 flex justify-end gap-2 p-4">
        {!justOneTaskMode && isRunning && (
          <button
            type="button"
            onClick={() => setShowDistractionLog(true)}
            className="rounded-xl border border-[var(--border)] bg-[var(--card)]/80 px-4 py-2 text-sm text-[var(--text)] backdrop-blur hover:bg-[var(--hover)]"
          >
            Log distraction
          </button>
        )}
        <button
          type="button"
          onClick={handleExit}
          className="rounded-xl border border-[var(--border)] bg-[var(--card)]/80 px-4 py-2 text-[var(--text)] backdrop-blur hover:bg-[var(--hover)]"
        >
          Exit focus
        </button>
      </div>

      <main className="relative z-10 flex flex-1 min-h-0 flex-col items-center justify-center overflow-y-auto px-4 py-6 pt-[min(42vh,200px)] md:justify-center md:pt-[min(28vh,160px)]">
        <div className="flex w-full max-w-md flex-col items-center gap-4 md:gap-5">
          <AnimatePresence mode="wait">
            {showSuccess && justFinished ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex w-full max-w-sm flex-col items-center gap-6 text-center"
              >
                <div className="flex flex-col items-center gap-2">
                  <Mascot variant="celebrate" size={72} />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--success)] text-2xl text-white"
                  >
                    ✓
                  </motion.div>
                </div>
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
            ) : showBreakReminder ? (
              <motion.div
                key="break"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-sm"
              >
                <BreakReminder onDismiss={() => setShowBreakReminder(false)} />
                <button
                  type="button"
                  onClick={handleCompleteTask}
                  className="mt-4 w-full rounded-xl border border-[var(--border)] py-3 text-sm text-[var(--text)] hover:bg-[var(--hover)]"
                >
                  Back to dashboard
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
                  <div className="flex w-full shrink-0 flex-col items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--card)]/95 p-3 text-center shadow-lg backdrop-blur md:gap-2 md:p-4">
                    <Mascot variant={isRunning ? 'focused' : 'idle'} size={40} />
                    <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                      Current task
                    </p>
                    <p className="mt-1 text-lg font-medium text-[var(--text)]">
                      {task.title}
                    </p>
                    {goal && !justOneTaskMode && (
                      <p className="mt-0.5 text-sm text-[var(--muted)]">
                        {goal.title}
                      </p>
                    )}
                    </div>
                    <WhyReminder
                      reasons={allReasons}
                      fallback={screensaverFallback}
                    />
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
