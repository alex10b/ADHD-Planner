import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Goal, Priority } from '../types/goal.js';
import type { Task } from '../types/task.js';
import { getTodayKey } from '../utils/dateUtils.js';
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
  canAddGoal: () => boolean;
  canAddTask: (goalId: string) => boolean;
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
    ...overrides,
  };
}

function createEmptyTask(overrides?: Partial<Task>): Task {
  return {
    id: uuidv4(),
    title: '',
    completed: false,
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
