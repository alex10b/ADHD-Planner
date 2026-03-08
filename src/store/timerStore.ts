import { create } from 'zustand';

export type TimerPreset = 25 | 35 | 'custom';

interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  preset: TimerPreset;
  customMinutes: number;
  remainingSeconds: number;
  totalSeconds: number;
  focusGoalId: string | null;
  focusTaskId: string | null;
  setPreset: (preset: TimerPreset) => void;
  setCustomMinutes: (minutes: number) => void;
  startSession: (goalId: string, taskId: string) => void;
  tick: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  getEffectiveDurationMinutes: () => number;
}

function getPresetSeconds(preset: TimerPreset, customMinutes: number): number {
  if (preset === 'custom') return customMinutes * 60;
  return preset * 60;
}

export const useTimerStore = create<TimerState>((set, get) => ({
  isRunning: false,
  isPaused: false,
  preset: 25,
  customMinutes: 25,
  remainingSeconds: 0,
  totalSeconds: 0,
  focusGoalId: null,
  focusTaskId: null,

  setPreset(preset) {
    set({ preset });
  },

  setCustomMinutes(minutes) {
    set({ customMinutes: Math.max(1, Math.min(120, minutes)) });
  },

  startSession(goalId, taskId) {
    const { preset, customMinutes } = get();
    const total = getPresetSeconds(preset, customMinutes);
    set({
      isRunning: true,
      isPaused: false,
      remainingSeconds: total,
      totalSeconds: total,
      focusGoalId: goalId,
      focusTaskId: taskId,
    });
  },

  tick() {
    const state = get();
    if (!state.isRunning || state.isPaused) return;
    const next = state.remainingSeconds - 1;
    if (next <= 0) {
      set({
        isRunning: false,
        isPaused: false,
        remainingSeconds: 0,
      });
      return;
    }
    set({ remainingSeconds: next });
  },

  pause() {
    set({ isPaused: true });
  },

  resume() {
    set({ isPaused: false });
  },

  stop() {
    set({
      isRunning: false,
      isPaused: false,
      focusGoalId: null,
      focusTaskId: null,
    });
  },

  getEffectiveDurationMinutes() {
    const { totalSeconds } = get();
    return Math.round(totalSeconds / 60);
  },
}));
