import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useGoalsStore } from './store/goalsStore.js';
import { useThemeStore } from './store/themeStore.js';
import { Dashboard } from './pages/Dashboard.jsx';
import { FocusMode } from './pages/FocusMode.jsx';
import { History } from './pages/History.jsx';

function ThemeToggle() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const resolved = useThemeStore((s) => s.resolved);

  const cycle = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <button
      type="button"
      onClick={cycle}
      className="rounded-xl p-2 text-[var(--muted)] hover:bg-[var(--hover)] hover:text-[var(--text)]"
      aria-label={`Theme: ${resolved}. Click to change.`}
      title={`Theme: ${resolved}`}
    >
      {resolved === 'dark' ? (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ) : (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )}
    </button>
  );
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg)]/95 px-4 py-3 backdrop-blur">
        <h1 className="text-lg font-semibold text-[var(--text)]">
          ADHD Daily Planner
        </h1>
        <ThemeToggle />
      </header>
      {children}
    </div>
  );
}

export default function App() {
  const hydrateGoals = useGoalsStore((s) => s.hydrate);
  const hydrateTheme = useThemeStore((s) => s.hydrate);

  useEffect(() => {
    hydrateTheme();
    hydrateGoals();
  }, [hydrateTheme, hydrateGoals]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/focus"
          element={
            <div className="min-h-screen bg-[var(--bg)]">
              <FocusMode />
            </div>
          }
        />
        <Route
          path="/"
          element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          }
        />
        <Route
          path="/history"
          element={
            <AppLayout>
              <History />
            </AppLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
