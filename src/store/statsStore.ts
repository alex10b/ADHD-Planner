import { create } from 'zustand';
import type { DailyStats } from '../types/stats.js';
import { getTodayKey } from '../utils/dateUtils.js';
import {
  loadFromStorage,
  saveToStorage,
  storageKeys,
} from '../utils/storage.js';

type StatsByDate = Record<string, DailyStats>;

interface StatsState {
  statsByDate: StatsByDate;
  _hydrated: boolean;
  getTodayStats: () => DailyStats;
  getStatsForDate: (dateKey: string) => DailyStats;
  getAllDates: () => string[];
  addFocusMinutes: (minutes: number) => void;
  addDistractionMinutes: (minutes: number) => void;
  setCompletedGoals: (count: number) => void;
  setCompletedTasks: (count: number) => void;
  setReflectionNote: (note: string) => void;
  hydrate: () => void;
  persist: () => void;
}

function emptyStats(dateKey: string): DailyStats {
  return {
    date: dateKey,
    focusMinutes: 0,
    distractionMinutes: 0,
    completedGoals: 0,
    completedTasks: 0,
  };
}

export const useStatsStore = create<StatsState>((set, get) => ({
  statsByDate: {},
  _hydrated: false,

  getTodayStats() {
    const today = getTodayKey();
    return get().statsByDate[today] ?? emptyStats(today);
  },

  getStatsForDate(dateKey) {
    return get().statsByDate[dateKey] ?? emptyStats(dateKey);
  },

  getAllDates() {
    return Object.keys(get().statsByDate).sort((a, b) => b.localeCompare(a));
  },

  addFocusMinutes(minutes) {
    const today = getTodayKey();
    const state = get();
    const current = state.statsByDate[today] ?? emptyStats(today);
    set({
      statsByDate: {
        ...state.statsByDate,
        [today]: {
          ...current,
          focusMinutes: current.focusMinutes + minutes,
        },
      },
    });
    get().persist();
  },

  addDistractionMinutes(minutes) {
    const today = getTodayKey();
    const state = get();
    const current = state.statsByDate[today] ?? emptyStats(today);
    set({
      statsByDate: {
        ...state.statsByDate,
        [today]: {
          ...current,
          distractionMinutes: current.distractionMinutes + minutes,
        },
      },
    });
    get().persist();
  },

  setCompletedGoals(count) {
    const today = getTodayKey();
    const state = get();
    const current = state.statsByDate[today] ?? emptyStats(today);
    if (current.completedGoals === count) return;
    set({
      statsByDate: {
        ...state.statsByDate,
        [today]: { ...current, completedGoals: count },
      },
    });
    get().persist();
  },

  setCompletedTasks(count) {
    const today = getTodayKey();
    const state = get();
    const current = state.statsByDate[today] ?? emptyStats(today);
    if (current.completedTasks === count) return;
    set({
      statsByDate: {
        ...state.statsByDate,
        [today]: { ...current, completedTasks: count },
      },
    });
    get().persist();
  },

  setReflectionNote(note) {
    const today = getTodayKey();
    const state = get();
    const current = state.statsByDate[today] ?? emptyStats(today);
    set({
      statsByDate: {
        ...state.statsByDate,
        [today]: { ...current, reflectionNote: note },
      },
    });
    get().persist();
  },

  hydrate() {
    if (typeof window === 'undefined') return;
    const stored = loadFromStorage<StatsByDate>(storageKeys.stats, {});
    set({ statsByDate: stored, _hydrated: true });
  },

  persist() {
    if (typeof window === 'undefined') return;
    saveToStorage(storageKeys.stats, get().statsByDate);
  },
}));
