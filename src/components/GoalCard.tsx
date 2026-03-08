import { useState } from 'react';
import type { Goal } from '../types/goal.js';
import { useGoalsStore } from '../store/goalsStore.js';
import { TaskItem } from './TaskItem.js';
import { useNavigate } from 'react-router-dom';
import { useTimerStore } from '../store/timerStore.js';
import { motion, AnimatePresence } from 'framer-motion';

const MAX_TASKS = 7;

interface GoalCardProps {
  goal: Goal;
}

export function GoalCard({ goal }: GoalCardProps) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);
  const [showDeleteGoal, setShowDeleteGoal] = useState(false);

  const navigate = useNavigate();
  const toggleGoal = useGoalsStore((s) => s.toggleGoal);
  const removeGoal = useGoalsStore((s) => s.removeGoal);
  const addTask = useGoalsStore((s) => s.addTask);
  const canAddTask = useGoalsStore((s) => s.canAddTask);
  const startSession = useTimerStore((s) => s.startSession);

  const completedTasks = goal.tasks.filter((t) => t.completed).length;
  const totalTasks = goal.tasks.length;
  const canAdd = canAddTask(goal.id);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const t = newTaskTitle.trim();
    if (!t) return;
    addTask(goal.id, t);
    setNewTaskTitle('');
    setShowAddTask(false);
  };

  const handleStartFocus = (taskId: string) => {
    startSession(goal.id, taskId);
    navigate('/focus');
  };

  const priorityColor =
    goal.priority === 'high'
      ? 'var(--warning)'
      : goal.priority === 'medium'
        ? 'var(--primary)'
        : 'var(--muted)';

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleGoal(goal.id)}
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition ${
                goal.completed
                  ? 'border-[var(--success)] bg-[var(--success)] text-white'
                  : 'border-[var(--border)] bg-transparent'
              }`}
              aria-label={goal.completed ? 'Mark goal incomplete' : 'Mark goal complete'}
            />
            <h3
              className={`text-lg font-medium text-[var(--text)] ${
                goal.completed ? 'line-through text-[var(--muted)]' : ''
              }`}
            >
              {goal.title}
            </h3>
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: priorityColor }}
              aria-hidden
            />
          </div>
          {goal.description && (
            <p className="mt-1 text-sm text-[var(--muted)]">{goal.description}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowDeleteGoal(true)}
          className="rounded-lg p-1.5 text-[var(--muted)] hover:bg-[var(--hover)] hover:text-[var(--danger)]"
          aria-label="Delete goal"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-1 14H5L4 7m5 0V5a2 2 0 012-2h4a2 2 0 012 2v2M9 7h6" />
          </svg>
        </button>
      </div>

      <p className="mb-3 text-sm text-[var(--muted)]">
        Tasks {completedTasks}/{totalTasks}
      </p>

      <ul className="space-y-1">
        <AnimatePresence mode="popLayout">
          {goal.tasks.map((task, index) => (
            <TaskItem
              key={task.id}
              goalId={goal.id}
              task={task}
              index={index}
              total={goal.tasks.length}
              onStartFocus={() => handleStartFocus(task.id)}
            />
          ))}
        </AnimatePresence>
      </ul>

      {canAdd && (
        <div className="mt-3">
          {!showAddTask ? (
            <button
              type="button"
              onClick={() => setShowAddTask(true)}
              className="rounded-lg py-1.5 text-sm text-[var(--muted)] hover:text-[var(--primary)]"
            >
              + Add task (max {MAX_TASKS})
            </button>
          ) : (
            <form onSubmit={handleAddTask} className="flex gap-2">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Task title"
                className="min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--primary)] focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="rounded-lg bg-[var(--primary)] px-3 py-2 text-sm text-white"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowAddTask(false)}
                className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm text-[var(--text)]"
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      )}

      <AnimatePresence>
        {showDeleteGoal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={() => setShowDeleteGoal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="rounded-2xl bg-[var(--card)] p-6 shadow-xl"
            >
              <p className="mb-4 text-[var(--text)]">Delete this goal and all its tasks?</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    removeGoal(goal.id);
                    setShowDeleteGoal(false);
                  }}
                  className="rounded-xl bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteGoal(false)}
                  className="rounded-xl border border-[var(--border)] px-4 py-2 text-[var(--text)]"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
