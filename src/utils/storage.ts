const GOALS_KEY = 'adhd-planner-goals';
const STATS_KEY = 'adhd-planner-stats';
const THEME_KEY = 'adhd-planner-theme';

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage save failed', e);
  }
}

export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export const storageKeys = {
  goals: GOALS_KEY,
  stats: STATS_KEY,
  theme: THEME_KEY,
} as const;
