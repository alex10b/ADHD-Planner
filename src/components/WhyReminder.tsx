import { useState } from 'react';

interface WhyReminderProps {
  reasons: string[];
  fallback?: string;
}

export function WhyReminder({ reasons, fallback }: WhyReminderProps) {
  const [expanded, setExpanded] = useState(false);
  const text = reasons.length > 0 ? reasons[Math.floor(Math.random() * reasons.length)] : fallback ?? "You've got this.";

  if (!text) return null;

  return (
    <div className="text-center">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="rounded-lg px-3 py-1.5 text-sm text-[var(--muted)] hover:bg-[var(--hover)] hover:text-[var(--text)]"
      >
        {expanded ? `"${text}"` : 'Why am I doing this?'}
      </button>
    </div>
  );
}
