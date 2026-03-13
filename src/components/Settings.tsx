import { useState } from 'react';
import { useSettingsStore } from '../store/settingsStore.js';

function supportsNotifications(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function Settings() {
  const [expanded, setExpanded] = useState(false);
  const soundOnFocusComplete = useSettingsStore((s) => s.soundOnFocusComplete);
  const setSoundOnFocusComplete = useSettingsStore((s) => s.setSoundOnFocusComplete);
  const notificationsEnabled = useSettingsStore((s) => s.notificationsEnabled);
  const setNotificationsEnabled = useSettingsStore((s) => s.setNotificationsEnabled);
  const breakReminderEnabled = useSettingsStore((s) => s.breakReminderEnabled);
  const setBreakReminderEnabled = useSettingsStore((s) => s.setBreakReminderEnabled);
  const bodyDoublingEnabled = useSettingsStore((s) => s.bodyDoublingEnabled);
  const setBodyDoublingEnabled = useSettingsStore((s) => s.setBodyDoublingEnabled);
  const justOneTaskMode = useSettingsStore((s) => s.justOneTaskMode);
  const setJustOneTaskMode = useSettingsStore((s) => s.setJustOneTaskMode);
  const gentleNudgesEnabled = useSettingsStore((s) => s.gentleNudgesEnabled);
  const setGentleNudgesEnabled = useSettingsStore((s) => s.setGentleNudgesEnabled);

  const handleNotificationsToggle = (on: boolean) => {
    if (on && typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        setNotificationsEnabled(true);
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((p) => {
          setNotificationsEnabled(p === 'granted');
        });
      }
    } else {
      setNotificationsEnabled(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="font-medium text-[var(--text)]">Settings</span>
        <span className="text-[var(--muted)]">{expanded ? '−' : '+'}</span>
      </button>
      {expanded && (
        <div className="mt-4 space-y-4 border-t border-[var(--border)] pt-4">
          <label className="flex cursor-pointer items-center justify-between gap-3">
            <span className="text-sm text-[var(--text)]">
              Sound when focus session ends
            </span>
            <input
              type="checkbox"
              checked={soundOnFocusComplete}
              onChange={(e) => setSoundOnFocusComplete(e.target.checked)}
              className="h-5 w-5 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
            />
          </label>
          {supportsNotifications() && (
            <label className="flex cursor-pointer items-center justify-between gap-3">
              <span className="text-sm text-[var(--text)]">
                Remind me to plan my day (morning notification)
              </span>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => handleNotificationsToggle(e.target.checked)}
                className="h-5 w-5 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
              />
            </label>
          )}
          <label className="flex cursor-pointer items-center justify-between gap-3">
            <span className="text-sm text-[var(--text)]">
              Break reminder after focus session
            </span>
            <input
              type="checkbox"
              checked={breakReminderEnabled}
              onChange={(e) => setBreakReminderEnabled(e.target.checked)}
              className="h-5 w-5 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
            />
          </label>
          <label className="flex cursor-pointer items-center justify-between gap-3">
            <span className="text-sm text-[var(--text)]">
              Body doubling (ambient sound during focus)
            </span>
            <input
              type="checkbox"
              checked={bodyDoublingEnabled}
              onChange={(e) => setBodyDoublingEnabled(e.target.checked)}
              className="h-5 w-5 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
            />
          </label>
          <label className="flex cursor-pointer items-center justify-between gap-3">
            <span className="text-sm text-[var(--text)]">
              Just one task mode (minimal focus UI)
            </span>
            <input
              type="checkbox"
              checked={justOneTaskMode}
              onChange={(e) => setJustOneTaskMode(e.target.checked)}
              className="h-5 w-5 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
            />
          </label>
          <label className="flex cursor-pointer items-center justify-between gap-3">
            <span className="text-sm text-[var(--text)]">
              Gentle nudges (“Still on track?” during focus)
            </span>
            <input
              type="checkbox"
              checked={gentleNudgesEnabled}
              onChange={(e) => setGentleNudgesEnabled(e.target.checked)}
              className="h-5 w-5 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
            />
          </label>
        </div>
      )}
    </div>
  );
}
