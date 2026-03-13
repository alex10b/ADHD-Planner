import { useState } from 'react';
import { useGoalsStore } from '../store/goalsStore.js';
import { useStatsStore } from '../store/statsStore.js';
import { exportAsJson, exportAsCsv, downloadFile } from '../utils/exportData.js';

export function ExportData() {
  const [expanded, setExpanded] = useState(false);
  const goalsByDate = useGoalsStore((s) => s.goalsByDate);
  const statsByDate = useStatsStore((s) => s.statsByDate);

  const handleExportJson = () => {
    const content = exportAsJson(goalsByDate, statsByDate);
    const filename = `focusara-backup-${new Date().toISOString().slice(0, 10)}.json`;
    downloadFile(content, filename, 'application/json');
  };

  const handleExportCsv = () => {
    const content = exportAsCsv(goalsByDate, statsByDate);
    const filename = `focusara-stats-${new Date().toISOString().slice(0, 10)}.csv`;
    downloadFile(content, filename, 'text/csv');
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="font-medium text-[var(--text)]">Export & backup</span>
        <span className="text-[var(--muted)]">{expanded ? '−' : '+'}</span>
      </button>
      {expanded && (
        <div className="mt-4 space-y-2 border-t border-[var(--border)] pt-4">
          <p className="text-sm text-[var(--muted)]">
            Download your goals and stats for backup.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleExportJson}
              className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm text-[var(--text)] hover:bg-[var(--hover)]"
            >
              Export JSON
            </button>
            <button
              type="button"
              onClick={handleExportCsv}
              className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm text-[var(--text)] hover:bg-[var(--hover)]"
            >
              Export CSV
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
