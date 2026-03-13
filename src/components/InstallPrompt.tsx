import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);

    const installedHandler = () => setInstalled(true);
    window.addEventListener('appinstalled', installedHandler);

    const wasDismissed = localStorage.getItem('focusara-install-dismissed');
    if (wasDismissed) setDismissed(true);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('focusara-install-dismissed', '1');
  };

  if (!deferredPrompt || dismissed || installed) return null;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-[var(--text)]">Install Focusara</p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Add to your home screen for quick access and offline use.
          </p>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="shrink-0 rounded p-1 text-[var(--muted)] hover:bg-[var(--hover)]"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={handleInstall}
          className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white"
        >
          Install
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm text-[var(--text)] hover:bg-[var(--hover)]"
        >
          Not now
        </button>
      </div>
    </div>
  );
}
