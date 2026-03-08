import { getCurrentHour } from './dateUtils.js';

const NOON = 12;
const EVENING = 17;

export function getTimeBasedGreeting(): string {
  const h = getCurrentHour();
  if (h < NOON) return 'Good morning';
  if (h < EVENING) return 'Good afternoon';
  return 'Good evening';
}

/** Rotate by day of year so it's stable for the day but changes daily */
export function getEncouragement(): string {
  const messages = [
    'One task at a time.',
    'Small steps count.',
    "You've got this.",
    'Focus on what matters now.',
    'Progress over perfection.',
    'One thing done is a win.',
    'Start with just one.',
    'Today is a fresh start.',
  ];
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return messages[dayOfYear % messages.length];
}
