import { useEffect, useRef } from 'react';
import { useTimerStore } from '../store/timerStore.js';
import { useStatsStore } from '../store/statsStore.js';

/**
 * Runs the focus timer tick every second and records focus time when session ends.
 */
export function useFocusTimer() {
  const tick = useTimerStore((s) => s.tick);
  const isRunning = useTimerStore((s) => s.isRunning);
  const isPaused = useTimerStore((s) => s.isPaused);
  const remainingSeconds = useTimerStore((s) => s.remainingSeconds);
  const getEffectiveDurationMinutes = useTimerStore(
    (s) => s.getEffectiveDurationMinutes
  );
  const addFocusMinutes = useStatsStore((s) => s.addFocusMinutes);
  const hadActiveSession = useRef(false);

  useEffect(() => {
    if (!isRunning || isPaused) return;
    hadActiveSession.current = true;
    const id = setInterval(() => tick(), 1000);
    return () => clearInterval(id);
  }, [isRunning, isPaused, tick]);

  useEffect(() => {
    if (remainingSeconds === 0 && hadActiveSession.current) {
      hadActiveSession.current = false;
      const minutes = getEffectiveDurationMinutes();
      if (minutes > 0) addFocusMinutes(minutes);
    }
  }, [remainingSeconds, getEffectiveDurationMinutes, addFocusMinutes]);
}
