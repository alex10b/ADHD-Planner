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
  statsByDate: StatsByDate
): number {
  let streak = 0;
  let current = todayKey;
  while (hadActivity(current, goalsByDate, statsByDate)) {
    streak += 1;
    current = getPreviousDayKey(current);
  }
  return streak;
}

/** Consecutive days (including today) with focus time > 0 */
export function getFocusStreak(todayKey: string, statsByDate: StatsByDate): number {
  let streak = 0;
  let current = todayKey;
  while (statsByDate[current]?.focusMinutes > 0) {
    streak += 1;
    current = getPreviousDayKey(current);
  }
  return streak;
}
