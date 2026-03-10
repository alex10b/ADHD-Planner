import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Goal, Priority } from '../types/goal.js';
import type { Task } from '../types/task.js';
import { getTodayKey, getYesterdayKey } from '../utils/dateUtils.js';
import {
  loadFromStorage,
  saveToStorage,
  storageKeys,
} from '../utils/storage.js';

const MAX_GOALS_PER_DAY = 5;
const MAX_TASKS_PER_GOAL = 7;

type GoalsByDate = Record<string, Goal[]>;

interface GoalsState {
  goalsByDate: GoalsByDate;
  _hydrated: boolean;
  _version: number;
  getTodayGoals: () => Goal[];
  getGoalsForDate: (dateKey: string) => Goal[];
  getAllDatesWithGoals: () => string[];
  addGoal: (title: string, description?: string, priority?: Priority) => void;
  removeGoal: (goalId: string) => void;
  toggleGoal: (goalId: string) => void;
  updateGoal: (
    goalId: string,
    updates: Partial<Pick<Goal, 'title' | 'description' | 'priority'>>
  ) => void;
  addTask: (goalId: string, title: string) => void;
  toggleTask: (goalId: string, taskId: string) => void;
  deleteTask: (goalId: string, taskId: string) => void;
  reorderTasks: (goalId: string, fromIndex: number, toIndex: number) => void;
  addGoalReason: (goalId: string, reason: string) => void;
  removeGoalReason: (goalId: string, index: number) => void;
  addTaskReason: (goalId: string, taskId: string, reason: string) => void;
  removeTaskReason: (goalId: string, taskId: string, index: number) => void;
  canAddGoal: () => boolean;
  canAddTask: (goalId: string) => boolean;
  copyYesterdayGoals: () => void;
  hydrate: () => void;
  persist: () => void;
}

function createEmptyGoal(overrides?: Partial<Goal>): Goal {
  return {
    id: uuidv4(),
    title: '',
    description: undefined,
    priority: 'medium',
    tasks: [],
    completed: false,
    createdAt: new Date().toISOString(),
    reasons: [],
    ...overrides,
  };
}

function createEmptyTask(overrides?: Partial<Task>): Task {
  return {
    id: uuidv4(),
    title: '',
    completed: false,
    reasons: [],
    ...overrides,
  };
}

export const useGoalsStore = create<GoalsState>((set, get) => ({
  goalsByDate: {},
  _hydrated: false,
  _version: 0,

  getTodayGoals() {
    const today = getTodayKey();
    return get().goalsByDate[today] ?? [];
  },

  getGoalsForDate(dateKey) {
    return get().goalsByDate[dateKey] ?? [];
  },

  getAllDatesWithGoals() {
    return Object.keys(get().goalsByDate).sort((a, b) => b.localeCompare(a));
  },

  addGoal(title, description, priority = 'medium') {
    const state = get();
    if (!state.canAddGoal()) return;
    const today = getTodayKey();
    const goal = createEmptyGoal({
      title,
      description,
      priority,
    });
    const existing = state.goalsByDate[today] ?? [];
    set({
      goalsByDate: {
        ...state.goalsByDate,
        [today]: [...existing, goal],
      },
      _version: state._version + 1,
    });
    get().persist();
  },

  removeGoal(goalId) {
    const state = get();
    const today = getTodayKey();
    const list = state.goalsByDate[today] ?? [];
    const next = list.filter((g) => g.id !== goalId);
    set({
      goalsByDate: {
        ...state.goalsByDate,
        [today]: next,
      },
      _version: state._version + 1,
    });
    get().persist();
  },

  toggleGoal(goalId) {
    const state = get();
    const today = getTodayKey();
    const list = state.goalsByDate[today] ?? [];
    const updated = list.map((g) =>
      g.id === goalId ? { ...g, completed: !g.completed } : g
    );
    set({
      goalsByDate: {
        ...state.goalsByDate,
        [today]: updated,
      },
      _version: state._version + 1,
    });
    get().persist();
  },

  updateGoal(goalId, updates) {
    const state = get();
    const today = getTodayKey();
    const list = state.goalsByDate[today] ?? [];
    const updated = list.map((g) =>
      g.id === goalId ? { ...g, ...updates } : g
    );
    set({
      goalsByDate: {
        ...state.goalsByDate,
        [today]: updated,
      },
      _version: state._version + 1,
    });
    get().persist();
  },

  addTask(goalId, title) {
    const state = get();
    if (!state.canAddTask(goalId)) return;
    const today = getTodayKey();
    const list = state.goalsByDate[today] ?? [];
    const task = createEmptyTask({ title });
    const updated = list.map((g) =>
      g.id === goalId ? { ...g, tasks: [...g.tasks, task] } : g
    );
    set({
      goalsByDate: {
        ...state.goalsByDate,
        [today]: updated,
      },
      _version: state._version + 1,
    });
    get().persist();
  },

  toggleTask(goalId, taskId) {
    const state = get();
    const today = getTodayKey();
    const list = state.goalsByDate[today] ?? [];
    const updated = list.map((g) =>
      g.id === goalId
        ? {
            ...g,
            tasks: g.tasks.map((t) =>
              t.id === taskId ? { ...t, completed: !t.completed } : t
            ),
          }
        : g
    );
    set({
      goalsByDate: {
        ...state.goalsByDate,
        [today]: updated,
      },
      _version: state._version + 1,
    });
    get().persist();
  },

  deleteTask(goalId, taskId) {
    const state = get();
    const today = getTodayKey();
    const list = state.goalsByDate[today] ?? [];
    const updated = list.map((g) =>
      g.id === goalId
        ? { ...g, tasks: g.tasks.filter((t) => t.id !== taskId) }
        : g
    );
    set({
      goalsByDate: {
        ...state.goalsByDate,
        [today]: updated,
      },
      _version: state._version + 1,
    });
    get().persist();
  },

  reorderTasks(goalId, fromIndex, toIndex) {
    const state = get();
    const today = getTodayKey();
    const list = state.goalsByDate[today] ?? [];
    const updated = list.map((g) => {
      if (g.id !== goalId) return g;
      const tasks = [...g.tasks];
      const [removed] = tasks.splice(fromIndex, 1);
      tasks.splice(toIndex, 0, removed);
      return { ...g, tasks };
    });
    set({
      goalsByDate: {
        ...state.goalsByDate,
        [today]: updated,
      },
      _version: state._version + 1,
    });
    get().persist();
  },

  addGoalReason(goalId, reason) {
    const state = get();
    const today = getTodayKey();
    const list = state.goalsByDate[today] ?? [];
    const updated = list.map((g) =>
      g.id === goalId
        ? { ...g, reasons: [...(g.reasons ?? []), reason.trim()].filter(Boolean) }
        : g
    );
    set({
      goalsByDate: { ...state.goalsByDate, [today]: updated },
      _version: state._version + 1,
    });
    get().persist();
  },

  removeGoalReason(goalId, index) {
    const state = get();
    const today = getTodayKey();
    const list = state.goalsByDate[today] ?? [];
    const updated = list.map((g) => {
      if (g.id !== goalId) return g;
      const reasons = [...(g.reasons ?? [])];
      reasons.splice(index, 1);
      return { ...g, reasons };
    });
    set({
      goalsByDate: { ...state.goalsByDate, [today]: updated },
      _version: state._version + 1,
    });
    get().persist();
  },

  addTaskReason(goalId, taskId, reason) {
    const state = get();
    const today = getTodayKey();
    const list = state.goalsByDate[today] ?? [];
    const updated = list.map((g) =>
      g.id === goalId
        ? {
            ...g,
            tasks: g.tasks.map((t) =>
              t.id === taskId
                ? {
                    ...t,
                    reasons: [...(t.reasons ?? []), reason.trim()].filter(Boolean),
                  }
                : t
            ),
          }
        : g
    );
    set({
      goalsByDate: { ...state.goalsByDate, [today]: updated },
      _version: state._version + 1,
    });
    get().persist();
  },

  removeTaskReason(goalId, taskId, index) {
    const state = get();
    const today = getTodayKey();
    const list = state.goalsByDate[today] ?? [];
    const updated = list.map((g) =>
      g.id === goalId
        ? {
            ...g,
            tasks: g.tasks.map((t) => {
              if (t.id !== taskId) return t;
              const reasons = [...(t.reasons ?? [])];
              reasons.splice(index, 1);
              return { ...t, reasons };
            }),
          }
        : g
    );
    set({
      goalsByDate: { ...state.goalsByDate, [today]: updated },
      _version: state._version + 1,
    });
    get().persist();
  },

  canAddGoal() {
    const today = getTodayKey();
    const list = get().goalsByDate[today] ?? [];
    return list.length < MAX_GOALS_PER_DAY;
  },

  canAddTask(goalId) {
    const today = getTodayKey();
    const list = get().goalsByDate[today] ?? [];
    const goal = list.find((g) => g.id === goalId);
    return goal ? goal.tasks.length < MAX_TASKS_PER_GOAL : false;
  },

  copyYesterdayGoals() {
    const state = get();
    const today = getTodayKey();
    const yesterday = getYesterdayKey();
    const existingToday = state.goalsByDate[today] ?? [];
    const yesterdayGoals = state.goalsByDate[yesterday] ?? [];
    const slotsLeft = MAX_GOALS_PER_DAY - existingToday.length;
    if (slotsLeft <= 0 || yesterdayGoals.length === 0) return;
    const toCopy = yesterdayGoals.slice(0, slotsLeft);
    const newGoals = toCopy.map((g) =>
      createEmptyGoal({
        title: g.title,
        description: g.description,
        priority: g.priority,
        reasons: g.reasons?.length ? [...g.reasons] : undefined,
      })
    );
    set({
      goalsByDate: {
        ...state.goalsByDate,
        [today]: [...existingToday, ...newGoals],
      },
      _version: state._version + 1,
    });
    get().persist();
  },

  hydrate() {
    if (typeof window === 'undefined') return;
    const stored = loadFromStorage<GoalsByDate>(storageKeys.goals, {});
    set({ goalsByDate: stored, _hydrated: true, _version: get()._version + 1 });
  },

  persist() {
    if (typeof window === 'undefined') return;
    saveToStorage(storageKeys.goals, get().goalsByDate);
  },
}));
