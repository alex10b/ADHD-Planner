import { useState } from 'react';
import type { Task } from '../types/task.js';
import { useGoalsStore } from '../store/goalsStore.js';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskItemProps {
  goalId: string;
  task: Task;
  index: number;
  total: number;
  isFocusMode?: boolean;
  onStartFocus?: () => void;
}

export function TaskItem({
  goalId,
  task,
  index,
  total,
  isFocusMode = false,
  onStartFocus,
}: TaskItemProps) {
  const [showDelete, setShowDelete] = useState(false);
  const toggleTask = useGoalsStore((s) => s.toggleTask);
  const deleteTask = useGoalsStore((s) => s.deleteTask);
  const reorderTasks = useGoalsStore((s) => s.reorderTasks);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -8 }}
      className="group flex items-center gap-3 rounded-xl py-2"
    >
      <button
        type="button"
        onClick={() => toggleTask(goalId, task.id)}
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
          task.completed
            ? 'border-[var(--success)] bg-[var(--success)] text-white'
            : 'border-[var(--border)] bg-transparent hover:border-[var(--primary)]'
        }`}
        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {task.completed && (
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>
      <span
        className={`min-w-0 flex-1 text-[var(--text)] ${
          task.completed ? 'text-[var(--muted)] line-through' : ''
        }`}
      >
        {task.title}
      </span>
      {!isFocusMode && (
        <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
          {total > 1 && (
            <span className="flex">
              <button
                type="button"
                onClick={() => reorderTasks(goalId, index, index - 1)}
                disabled={index === 0}
                className="rounded p-0.5 text-[var(--muted)] hover:bg-[var(--hover)] disabled:opacity-30"
                aria-label="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => reorderTasks(goalId, index, index + 1)}
                disabled={index === total - 1}
                className="rounded p-0.5 text-[var(--muted)] hover:bg-[var(--hover)] disabled:opacity-30"
                aria-label="Move down"
              >
                ↓
              </button>
            </span>
          )}
          {onStartFocus && !task.completed && (
            <button
              type="button"
              onClick={onStartFocus}
              className="rounded-lg px-2 py-1 text-sm text-[var(--primary)] hover:bg-[var(--hover)]"
            >
              Focus
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowDelete(true)}
            className="rounded-lg p-1 text-[var(--muted)] hover:bg-[var(--danger)] hover:text-white"
            aria-label="Delete task"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-1 14H5L4 7m5 0V5a2 2 0 012-2h4a2 2 0 012 2v2M9 7h6" />
            </svg>
          </button>
        </div>
      )}
      <AnimatePresence>
        {showDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={() => setShowDelete(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="rounded-2xl bg-[var(--card)] p-6 shadow-xl"
            >
              <p className="mb-4 text-[var(--text)]">Delete this task?</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    deleteTask(goalId, task.id);
                    setShowDelete(false);
                  }}
                  className="rounded-xl bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowDelete(false)}
                  className="rounded-xl border border-[var(--border)] px-4 py-2 text-[var(--text)]"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}
