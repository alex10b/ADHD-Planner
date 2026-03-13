import { create } from 'zustand';
import {
  loadFromStorage,
  saveToStorage,
} from '../utils/storage.js';

const STORAGE_KEY = 'focusara-gamification';

export interface FocusSession {
  id: string;
  dateKey: string;
  taskTitle?: string;
  goalTitle?: string;
  minutes: number;
  completedAt: string;
}

export type AchievementId =
  | 'first_focus'
  | 'streak_3'
  | 'streak_7'
  | 'streak_14'
  | 'tasks_5'
  | 'tasks_10'
  | 'focus_60'
  | 'focus_120'
  | 'week_complete';

export const ACHIEVEMENTS: Record<AchievementId, { label: string; emoji: string }> = {
  first_focus: { label: 'First focus session', emoji: '🎯' },
  streak_3: { label: '3-day streak', emoji: '🔥' },
  streak_7: { label: '7-day streak', emoji: '⭐' },
  streak_14: { label: '14-day streak', emoji: '🌟' },
  tasks_5: { label: '5 tasks in a day', emoji: '✅' },
  tasks_10: { label: '10 tasks in a day', emoji: '🏆' },
  focus_60: { label: '60 min focus in a day', emoji: '⏱' },
  focus_120: { label: '120 min focus in a day', emoji: '💪' },
  week_complete: { label: 'Full week of focus', emoji: '📅' },
};

interface GamificationState {
  focusSessions: FocusSession[];
  unlockedAchievements: AchievementId[];
  totalXP: number;
  streakFreezesRemaining: number;
  freezeUsedForDates: string[];
  addFocusSession: (session: Omit<FocusSession, 'id' | 'completedAt'>) => void;
  addXP: (amount: number) => void;
  unlockAchievement: (id: AchievementId) => void;
  getFocusSessions: (limit?: number) => FocusSession[];
  getLevel: () => number;
  useStreakFreeze: (dateKey: string) => boolean;
  addStreakFreeze: () => void;
  hydrate: () => void;
  persist: () => void;
}

function xpToLevel(xp: number): number {
  if (xp < 100) return 1;
  if (xp < 250) return 2;
  if (xp < 500) return 3;
  if (xp < 1000) return 4;
  if (xp < 2000) return 5;
  if (xp < 3500) return 6;
  if (xp < 5500) return 7;
  if (xp < 8000) return 8;
  if (xp < 12000) return 9;
  return Math.min(99, 10 + Math.floor((xp - 12000) / 2000));
}

const DEFAULT_STATE = {
  focusSessions: [] as FocusSession[],
  unlockedAchievements: [] as AchievementId[],
  totalXP: 0,
  streakFreezesRemaining: 1,
  freezeUsedForDates: [] as string[],
};

export const useGamificationStore = create<GamificationState>((set, get) => ({
  ...DEFAULT_STATE,

  addFocusSession(session) {
    const id = `fs-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const full: FocusSession = {
      ...session,
      id,
      completedAt: new Date().toISOString(),
    };
    const xpGain = session.minutes + 5; // 1 XP per min + 5 for completing
    set((s) => ({
      focusSessions: [full, ...s.focusSessions].slice(0, 500),
      totalXP: s.totalXP + xpGain,
    }));
    get().persist();
  },

  addXP(amount) {
    if (amount <= 0) return;
    set((s) => ({ totalXP: s.totalXP + amount }));
    get().persist();
  },

  unlockAchievement(id) {
    const { unlockedAchievements } = get();
    if (unlockedAchievements.includes(id)) return;
    set({ unlockedAchievements: [...unlockedAchievements, id] });
    get().persist();
  },

  getFocusSessions(limit = 50) {
    return get().focusSessions.slice(0, limit);
  },

  getLevel() {
    return xpToLevel(get().totalXP);
  },

  useStreakFreeze(dateKey) {
    const { streakFreezesRemaining, freezeUsedForDates } = get();
    if (streakFreezesRemaining <= 0 || freezeUsedForDates.includes(dateKey)) return false;
    set({
      streakFreezesRemaining: streakFreezesRemaining - 1,
      freezeUsedForDates: [...freezeUsedForDates, dateKey],
    });
    get().persist();
    return true;
  },

  addStreakFreeze() {
    set((s) => ({ streakFreezesRemaining: s.streakFreezesRemaining + 1 }));
    get().persist();
  },

  hydrate() {
    if (typeof window === 'undefined') return;
    const stored = loadFromStorage<typeof DEFAULT_STATE>(STORAGE_KEY, DEFAULT_STATE);
    set({ ...DEFAULT_STATE, ...stored });
  },

  persist() {
    if (typeof window === 'undefined') return;
    const s = get();
    saveToStorage(STORAGE_KEY, {
      focusSessions: s.focusSessions,
      unlockedAchievements: s.unlockedAchievements,
      totalXP: s.totalXP,
      streakFreezesRemaining: s.streakFreezesRemaining,
      freezeUsedForDates: s.freezeUsedForDates,
    });
  },
}));
