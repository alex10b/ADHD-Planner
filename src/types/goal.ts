import type { Task } from './task.js';

export type Priority = 'low' | 'medium' | 'high';

export interface Goal {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  tasks: Task[];
  completed: boolean;
  createdAt: string;
  /** Why do you need to finish this goal? (unlimited) */
  reasons?: string[];
}
