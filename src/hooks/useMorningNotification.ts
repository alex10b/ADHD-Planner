import { useEffect } from 'react';
import { useSettingsStore } from '../store/settingsStore.js';
import { getTodayKey } from '../utils/dateUtils.js';

const NOTIFICATION_TITLE = 'ADHD Daily Planner';
const NOTIFICATION_BODY = 'Time to plan your day?';
const MORNING_START = 7;
const MORNING_END = 10;

/**
 * If notifications are enabled and it's morning and we haven't notified today,
 * show a one-time "plan your day" notification.
 */
export function useMorningNotification(): void {
  const notificationsEnabled = useSettingsStore((s) => s.notificationsEnabled);
  const lastNotificationDateKey = useSettingsStore((s) => s.lastNotificationDateKey);
  const setLastNotificationDateKey = useSettingsStore((s) => s.setLastNotificationDateKey);

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (!notificationsEnabled || Notification.permission !== 'granted') return;

    const hour = new Date().getHours();
    if (hour < MORNING_START || hour > MORNING_END) return;

    const today = getTodayKey();
    if (lastNotificationDateKey === today) return;

    const n = new Notification(NOTIFICATION_TITLE, {
      body: NOTIFICATION_BODY,
      icon: '/vite.svg',
    });
    n.onclick = () => {
      window.focus();
      n.close();
    };
    setLastNotificationDateKey(today);
  }, [notificationsEnabled, lastNotificationDateKey, setLastNotificationDateKey]);
}
