import { create } from 'zustand';
import {
  loadFromStorage,
  saveToStorage,
  storageKeys,
} from '../utils/storage.js';

export interface PlannerSettings {
  soundOnFocusComplete: boolean;
  notificationsEnabled: boolean;
  /** Last date we showed the "plan your day" notification (YYYY-MM-DD) */
  lastNotificationDateKey: string | null;
  /** Milestones at which we've shown the tip popup (e.g. [2, 5, 10]) */
  tipPopupMilestonesShown: number[];
  /** Show break reminder after focus session */
  breakReminderEnabled: boolean;
  /** Body doubling: ambient study-with-me audio during focus */
  bodyDoublingEnabled: boolean;
  /** Just one task mode: minimal UI during focus */
  justOneTaskMode: boolean;
  /** Gentle nudges: "Still on track?" prompts during focus (every 10 min) */
  gentleNudgesEnabled: boolean;
}

const DEFAULT_SETTINGS: PlannerSettings = {
  soundOnFocusComplete: true,
  notificationsEnabled: false,
  lastNotificationDateKey: null,
  tipPopupMilestonesShown: [],
  breakReminderEnabled: true,
  bodyDoublingEnabled: false,
  justOneTaskMode: false,
  gentleNudgesEnabled: false,
};

interface SettingsState extends PlannerSettings {
  hydrate: () => void;
  setSoundOnFocusComplete: (on: boolean) => void;
  setNotificationsEnabled: (on: boolean) => void;
  setLastNotificationDateKey: (dateKey: string | null) => void;
  markTipPopupShown: (milestone: number) => void;
  setBreakReminderEnabled: (on: boolean) => void;
  setBodyDoublingEnabled: (on: boolean) => void;
  setJustOneTaskMode: (on: boolean) => void;
  setGentleNudgesEnabled: (on: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...DEFAULT_SETTINGS,

  hydrate() {
    if (typeof window === 'undefined') return;
    const stored = loadFromStorage<PlannerSettings>(storageKeys.settings, DEFAULT_SETTINGS);
    set({ ...DEFAULT_SETTINGS, ...stored });
  },

  setSoundOnFocusComplete(on) {
    set({ soundOnFocusComplete: on });
    persistSettings(get());
  },

  setNotificationsEnabled(on) {
    set({ notificationsEnabled: on });
    persistSettings(get());
  },

  setLastNotificationDateKey(dateKey) {
    set({ lastNotificationDateKey: dateKey });
    persistSettings(get());
  },

  markTipPopupShown(milestone) {
    const { tipPopupMilestonesShown } = get();
    if (tipPopupMilestonesShown.includes(milestone)) return;
    set({ tipPopupMilestonesShown: [...tipPopupMilestonesShown, milestone] });
    persistSettings(get());
  },

  setBreakReminderEnabled(on) {
    set({ breakReminderEnabled: on });
    persistSettings(get());
  },

  setBodyDoublingEnabled(on) {
    set({ bodyDoublingEnabled: on });
    persistSettings(get());
  },

  setJustOneTaskMode(on) {
    set({ justOneTaskMode: on });
    persistSettings(get());
  },

  setGentleNudgesEnabled(on) {
    set({ gentleNudgesEnabled: on });
    persistSettings(get());
  },
}));

function persistSettings(s: SettingsState): void {
  const toSave: PlannerSettings = {
    soundOnFocusComplete: s.soundOnFocusComplete,
    notificationsEnabled: s.notificationsEnabled,
    lastNotificationDateKey: s.lastNotificationDateKey,
    tipPopupMilestonesShown: s.tipPopupMilestonesShown,
    breakReminderEnabled: s.breakReminderEnabled,
    bodyDoublingEnabled: s.bodyDoublingEnabled,
    justOneTaskMode: s.justOneTaskMode,
    gentleNudgesEnabled: s.gentleNudgesEnabled,
  };
  saveToStorage(storageKeys.settings, toSave);
}
