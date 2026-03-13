import { useEffect } from 'react';

interface ShortcutHandlers {
  onStartFocus?: () => void;
  onExitFocus?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'Escape' && handlers.onExitFocus) {
        e.preventDefault();
        handlers.onExitFocus();
      }
      if (e.key === ' ' && handlers.onStartFocus) {
        e.preventDefault();
        handlers.onStartFocus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, handlers.onStartFocus, handlers.onExitFocus]);
}
