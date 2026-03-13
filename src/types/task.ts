export interface Task {
  id: string;
  title: string;
  completed: boolean;
  /** Optional time estimate in minutes (helps with time blindness) */
  estimateMinutes?: number;
  /** Why do you need to finish this task? (unlimited) */
  reasons?: string[];
}
