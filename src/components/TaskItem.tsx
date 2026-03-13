import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Task } from '../types/task.js';
import { useGoalsStore } from '../store/goalsStore.js';
import { useTimerStore } from '../store/timerStore.js';
import { ReasonsInput } from './ReasonsInput.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const PRESETS = [25, 35, 'custom'] as const;

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
  const [showFocusPicker, setShowFocusPicker] = useState(false);
  const [showEstimate, setShowEstimate] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const estimateRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const toggleTask = useGoalsStore((s) => s.toggleTask);
  const deleteTask = useGoalsStore((s) => s.deleteTask);
  const reorderTasks = useGoalsStore((s) => s.reorderTasks);
  const addTaskReason = useGoalsStore((s) => s.addTaskReason);
  const removeTaskReason = useGoalsStore((s) => s.removeTaskReason);
  const setTaskEstimate = useGoalsStore((s) => s.setTaskEstimate);
  const preset = useTimerStore((s) => s.preset);
  const customMinutes = useTimerStore((s) => s.customMinutes);
  const setPreset = useTimerStore((s) => s.setPreset);
  const setCustomMinutes = useTimerStore((s) => s.setCustomMinutes);
  const prepareSession = useTimerStore((s) => s.prepareSession);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      const target = e.target as Node;
      if (pickerRef.current && !pickerRef.current.contains(target)) setShowFocusPicker(false);
      if (estimateRef.current && !estimateRef.current.contains(target)) setShowEstimate(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [showFocusPicker, showEstimate]);

  const handleStartSession = () => {
    prepareSession(goalId, task.id);
    setShowFocusPicker(false);
    navigate('/focus');
  };

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
      <div className="min-w-0 flex-1">
        <span
          className={`text-[var(--text)] ${
            task.completed ? 'text-[var(--muted)] line-through' : ''
          }`}
        >
          {task.title}
          {task.estimateMinutes != null && (
            <span className="ml-1.5 text-xs text-[var(--muted)]">~{task.estimateMinutes} min</span>
          )}
        </span>
        {!isFocusMode && (
          <ReasonsInput
            label=""
            reasons={task.reasons ?? []}
            onAdd={(r) => addTaskReason(goalId, task.id, r)}
            onRemove={(i) => removeTaskReason(goalId, task.id, i)}
            placeholder="Why this task?"
            compact
          />
        )}
      </div>
      {!isFocusMode && (
        <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
          {!task.completed && (
            <div className="relative" ref={estimateRef}>
              <button
                type="button"
                onClick={() => setShowEstimate((v) => !v)}
                className="rounded p-0.5 text-[var(--muted)] hover:bg-[var(--hover)]"
                title="Set time estimate"
                aria-label="Set time estimate"
              >
                ⏱
              </button>
              {showEstimate && (
                <div className="absolute right-0 top-full z-50 mt-1 flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--card)] p-2 shadow-lg">
                  <input
                    type="number"
                    min={1}
                    max={480}
                    placeholder="min"
                    value={task.estimateMinutes ?? ''}
                    onChange={(e) => {
                      const v = e.target.value ? Number(e.target.value) : undefined;
                      setTaskEstimate(goalId, task.id, v);
                    }}
                    className="w-14 rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-xs text-[var(--text)]"
                  />
                  <span className="text-xs text-[var(--muted)]">min</span>
                  {task.estimateMinutes != null && (
                    <button
                      type="button"
                      onClick={() => setTaskEstimate(goalId, task.id, undefined)}
                      className="text-xs text-[var(--muted)] hover:text-[var(--danger)]"
                    >
                      Clear
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
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
            <div className="relative" ref={pickerRef}>
              <button
                type="button"
                onClick={() => setShowFocusPicker((v) => !v)}
                className="rounded-lg px-2 py-1 text-sm text-[var(--primary)] hover:bg-[var(--hover)]"
              >
                Focus
              </button>
              <AnimatePresence>
                {showFocusPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute right-0 top-full z-50 mt-1.5 w-52 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 shadow-lg"
                  >
                    <p className="mb-2 text-xs font-medium text-[var(--muted)]">
                      Start session
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESETS.map((value) => (
                        <button
                          key={String(value)}
                          type="button"
                          onClick={() => setPreset(value)}
                          className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                            preset === value
                              ? 'bg-[var(--primary)] text-white'
                              : 'bg-[var(--hover)] text-[var(--text)]'
                          }`}
                        >
                          {value === 'custom' ? 'Custom' : `${value}m`}
                        </button>
                      ))}
                    </div>
                    {preset === 'custom' && (
                      <div className="mt-2 flex items-center gap-1.5">
                        <input
                          type="number"
                          min={1}
                          max={120}
                          value={customMinutes}
                          onChange={(e) =>
                            setCustomMinutes(Number(e.target.value) || 25)
                          }
                          className="w-14 rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-xs text-[var(--text)]"
                        />
                        <span className="text-xs text-[var(--muted)]">min</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={handleStartSession}
                      className="mt-3 w-full rounded-lg bg-[var(--primary)] py-2 text-xs font-medium text-white"
                    >
                      Start session
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
