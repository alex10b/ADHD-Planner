import { useEffect, useRef } from 'react';
import { useTimerStore } from '../store/timerStore.js';
import { useStatsStore } from '../store/statsStore.js';

/**
 * Runs the focus timer tick every second and records focus time when session ends.
 */
export function useFocusTimer() {
  const elapse = useTimerStore((s) => s.elapse);
  const isRunning = useTimerStore((s) => s.isRunning);
  const isPaused = useTimerStore((s) => s.isPaused);
  const remainingSeconds = useTimerStore((s) => s.remainingSeconds);
  const getEffectiveDurationMinutes = useTimerStore(
    (s) => s.getEffectiveDurationMinutes
  );
  const addFocusMinutes = useStatsStore((s) => s.addFocusMinutes);
  const hadActiveSession = useRef(false);
  const lastWallTimeMs = useRef<number | null>(null);

  useEffect(() => {
    if (!isRunning || isPaused) return;
    hadActiveSession.current = true;
    lastWallTimeMs.current = Date.now();

    const sync = () => {
      const now = Date.now();
      const last = lastWallTimeMs.current ?? now;
      const deltaMs = now - last;
      if (deltaMs < 1000) return;
      const seconds = Math.floor(deltaMs / 1000);
      lastWallTimeMs.current = last + seconds * 1000;
      elapse(seconds);
    };

    // Use an interval for smooth UI updates, but derive the amount from wall clock
    // so the timer stays accurate when the browser throttles background timers.
    const id = window.setInterval(sync, 1000);

    const onVisible = () => {
      if (!document.hidden) sync();
    };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', sync);

    // Run once immediately in case we resumed after a long delay.
    sync();

    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', sync);
      lastWallTimeMs.current = null;
    };
  }, [isRunning, isPaused, elapse]);

  useEffect(() => {
    if (remainingSeconds === 0 && hadActiveSession.current) {
      hadActiveSession.current = false;
      const minutes = getEffectiveDurationMinutes();
      if (minutes > 0) addFocusMinutes(minutes);
    }
  }, [remainingSeconds, getEffectiveDurationMinutes, addFocusMinutes]);
}
