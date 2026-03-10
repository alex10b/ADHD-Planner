export interface Task {
  id: string;
  title: string;
  completed: boolean;
  /** Why do you need to finish this task? (unlimited) */
  reasons?: string[];
}
