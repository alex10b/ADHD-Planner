import { useEffect } from 'react';
import { useGoalsStore } from '../store/goalsStore.js';
import { useStatsStore } from '../store/statsStore.js';
import { useGamificationStore } from '../store/gamificationStore.js';
import { getTodayKey } from '../utils/dateUtils.js';
import { getPlanningStreak, getFocusStreak } from '../utils/streakUtils.js';
import type { AchievementId } from '../store/gamificationStore.js';

export function useAchievements() {
  const goalsByDate = useGoalsStore((s) => s.goalsByDate);
  const statsByDate = useStatsStore((s) => s.statsByDate);
  const focusSessions = useGamificationStore((s) => s.focusSessions);
  const unlockedAchievements = useGamificationStore((s) => s.unlockedAchievements);
  const unlockAchievement = useGamificationStore((s) => s.unlockAchievement);
  const addStreakFreeze = useGamificationStore((s) => s.addStreakFreeze);
  const freezeUsedForDates = useGamificationStore((s) => s.freezeUsedForDates);

  useEffect(() => {
    const today = getTodayKey();
    const stats = statsByDate[today];
    const focusMin = stats?.focusMinutes ?? 0;
    const completedTasks = stats?.completedTasks ?? 0;
    const planningStreak = getPlanningStreak(today, goalsByDate, statsByDate, freezeUsedForDates);
    const focusStreak = getFocusStreak(today, statsByDate, freezeUsedForDates);

    const toCheck: { id: AchievementId; condition: boolean }[] = [
      { id: 'first_focus', condition: focusSessions.length >= 1 },
      { id: 'streak_3', condition: planningStreak >= 3 },
      { id: 'streak_7', condition: planningStreak >= 7 },
      { id: 'streak_14', condition: planningStreak >= 14 },
      { id: 'tasks_5', condition: completedTasks >= 5 },
      { id: 'tasks_10', condition: completedTasks >= 10 },
      { id: 'focus_60', condition: focusMin >= 60 },
      { id: 'focus_120', condition: focusMin >= 120 },
    ];

    for (const { id, condition } of toCheck) {
      if (condition && !unlockedAchievements.includes(id)) {
        unlockAchievement(id);
      }
    }

    // Week complete: 7 days in a row with focus - also grants a streak freeze
    if (focusStreak >= 7 && !unlockedAchievements.includes('week_complete')) {
      unlockAchievement('week_complete');
      addStreakFreeze();
    }
  }, [goalsByDate, statsByDate, focusSessions.length, unlockedAchievements, freezeUsedForDates, unlockAchievement, addStreakFreeze]);
}
