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
}

const DEFAULT_SETTINGS: PlannerSettings = {
  soundOnFocusComplete: true,
  notificationsEnabled: false,
  lastNotificationDateKey: null,
  tipPopupMilestonesShown: [],
};

interface SettingsState extends PlannerSettings {
  hydrate: () => void;
  setSoundOnFocusComplete: (on: boolean) => void;
  setNotificationsEnabled: (on: boolean) => void;
  setLastNotificationDateKey: (dateKey: string | null) => void;
  markTipPopupShown: (milestone: number) => void;
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
}));

function persistSettings(s: SettingsState): void {
  const toSave: PlannerSettings = {
    soundOnFocusComplete: s.soundOnFocusComplete,
    notificationsEnabled: s.notificationsEnabled,
    lastNotificationDateKey: s.lastNotificationDateKey,
    tipPopupMilestonesShown: s.tipPopupMilestonesShown,
  };
  saveToStorage(storageKeys.settings, toSave);
}
