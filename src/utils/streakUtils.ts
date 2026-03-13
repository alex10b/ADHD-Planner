import type { DailyStats } from '../types/stats.js';
import type { Goal } from '../types/goal.js';
import { getPreviousDayKey } from './dateUtils.js';

type GoalsByDate = Record<string, Goal[]>;
type StatsByDate = Record<string, DailyStats>;

/** A day "counts" if user had goals or any focus/completion activity */
function hadActivity(dateKey: string, goalsByDate: GoalsByDate, statsByDate: StatsByDate): boolean {
  const goals = goalsByDate[dateKey] ?? [];
  const stats = statsByDate[dateKey];
  if (goals.length > 0) return true;
  if (stats && (stats.focusMinutes > 0 || stats.completedTasks > 0 || stats.completedGoals > 0)) return true;
  return false;
}

/** Consecutive days (including today) with activity, going backward from todayKey */
export function getPlanningStreak(
  todayKey: string,
  goalsByDate: GoalsByDate,
  statsByDate: StatsByDate,
  freezeUsedForDates: string[] = []
): number {
  let streak = 0;
  let current = todayKey;
  while (true) {
    if (hadActivity(current, goalsByDate, statsByDate) || freezeUsedForDates.includes(current)) {
      streak += 1;
      current = getPreviousDayKey(current);
    } else {
      break;
    }
  }
  return streak;
}

/** Consecutive days (including today) with focus time > 0 */
export function getFocusStreak(
  todayKey: string,
  statsByDate: StatsByDate,
  freezeUsedForDates: string[] = []
): number {
  let streak = 0;
  let current = todayKey;
  while (true) {
    if (statsByDate[current]?.focusMinutes > 0 || freezeUsedForDates.includes(current)) {
      streak += 1;
      current = getPreviousDayKey(current);
    } else {
      break;
    }
  }
  return streak;
}
