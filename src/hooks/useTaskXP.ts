import { useEffect, useRef } from 'react';
import { useGamificationStore } from '../store/gamificationStore.js';

const XP_PER_TASK = 5;

export function useTaskXP(completedTasks: number) {
  const addXP = useGamificationStore((s) => s.addXP);
  const prevRef = useRef<number>(0);

  useEffect(() => {
    const prev = prevRef.current;
    if (completedTasks > prev) {
      const delta = completedTasks - prev;
      addXP(delta * XP_PER_TASK);
    }
    prevRef.current = completedTasks;
  }, [completedTasks, addXP]);
}
