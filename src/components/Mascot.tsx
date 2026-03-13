import { useId } from 'react';
import { motion } from 'framer-motion';

type MascotVariant = 'idle' | 'focused' | 'celebrate' | 'rest';

interface MascotProps {
  variant?: MascotVariant;
  size?: number;
  className?: string;
}

export function Mascot({ variant = 'idle', size = 64, className = '' }: MascotProps) {
  const s = size;
  const gradId = useId().replace(/:/g, '');

  return (
    <motion.div
      className={`inline-flex items-center justify-center ${className}`}
      initial={false}
      animate={
        variant === 'celebrate'
          ? {
              scale: [1, 1.2, 1],
              transition: { duration: 0.4, repeat: 2 },
            }
          : variant === 'idle'
            ? {
                y: [0, -4, 0],
                transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
              }
            : variant === 'rest'
              ? {
                  scale: [1, 1.03, 1],
                  transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
                }
              : {}
      }
    >
      <svg
        width={s}
        height={s}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
        {/* Soft blob body */}
        <path
          d="M32 6C18 6 6 18 6 32c0 14 10 26 26 26s26-12 26-26S46 6 32 6z"
          fill={`url(#${gradId})`}
        />
        {/* Eyes */}
        {variant === 'focused' ? (
          <>
            <ellipse cx="24" cy="28" rx="4" ry="5" fill="#1e1b4b" />
            <ellipse cx="40" cy="28" rx="4" ry="5" fill="#1e1b4b" />
            <circle cx="24" cy="29" r="1.5" fill="#e2e8f0" />
            <circle cx="40" cy="29" r="1.5" fill="#e2e8f0" />
          </>
        ) : variant === 'celebrate' ? (
          <>
            <path d="M20 26 L24 30 L28 26" stroke="#1e1b4b" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M36 26 L40 30 L44 26" stroke="#1e1b4b" strokeWidth="2" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            <ellipse cx="24" cy="28" rx="4" ry="4" fill="#1e1b4b" />
            <ellipse cx="40" cy="28" rx="4" ry="4" fill="#1e1b4b" />
            <circle cx="24" cy="28" r="1" fill="#e2e8f0" />
            <circle cx="40" cy="28" r="1" fill="#e2e8f0" />
          </>
        )}
        {/* Mouth */}
        {variant === 'celebrate' ? (
          <path d="M26 40 Q32 48 38 40" stroke="#1e1b4b" strokeWidth="2" strokeLinecap="round" fill="none" />
        ) : variant === 'rest' ? (
          <path d="M24 42 L40 42" stroke="#1e1b4b" strokeWidth="2" strokeLinecap="round" />
        ) : (
          <path d="M26 40 Q32 44 38 40" stroke="#1e1b4b" strokeWidth="2" strokeLinecap="round" fill="none" />
        )}
      </svg>
    </motion.div>
  );
}
