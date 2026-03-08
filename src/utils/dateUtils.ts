/**
 * Returns today's date as YYYY-MM-DD (local date, no timezone shift)
 */
export function getTodayKey(): string {
  const now = new Date();
  return formatDateKey(now);
}

export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function formatDisplayDate(dateKey: string): string {
  const date = parseDateKey(dateKey);
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function isToday(dateKey: string): boolean {
  return dateKey === getTodayKey();
}

/** Previous day's key (YYYY-MM-DD) */
export function getPreviousDayKey(dateKey: string): string {
  const d = parseDateKey(dateKey);
  d.setDate(d.getDate() - 1);
  return formatDateKey(d);
}

/** Hour 0–23 for greeting */
export function getCurrentHour(): number {
  return new Date().getHours();
}
