import { create } from 'zustand';
import {
  loadFromStorage,
  saveToStorage,
  storageKeys,
} from '../utils/storage.js';

type Theme = 'light' | 'dark' | 'system';

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function applyTheme(theme: 'light' | 'dark') {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

interface ThemeState {
  theme: Theme;
  resolved: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  hydrate: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'system',
  resolved: 'light',

  setTheme(theme) {
    const resolved =
      theme === 'system' ? getSystemTheme() : theme;
    set({ theme, resolved });
    applyTheme(resolved);
    saveToStorage(storageKeys.theme, theme);
  },

  hydrate() {
    if (typeof window === 'undefined') return;
    const stored = loadFromStorage<Theme>(storageKeys.theme, 'system');
    const resolved = stored === 'system' ? getSystemTheme() : stored;
    set({ theme: stored, resolved });
    applyTheme(resolved);
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => {
        if (get().theme === 'system') {
          const r = getSystemTheme();
          set({ resolved: r });
          applyTheme(r);
        }
      });
  },
}));
