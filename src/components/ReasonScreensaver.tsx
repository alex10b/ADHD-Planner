import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ROTATION_INTERVAL_MS = 6000;

interface ReasonScreensaverProps {
  reasons: string[];
  /** Fallback when no reasons (e.g. task title or generic motivation) */
  fallback?: string;
}

export function ReasonScreensaver({ reasons, fallback = "You've got this." }: ReasonScreensaverProps) {
  const [index, setIndex] = useState(0);

  const list = reasons.length > 0 ? reasons : [fallback];

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % list.length);
    }, ROTATION_INTERVAL_MS);
    return () => clearInterval(id);
  }, [list.length]);

  return (
    <div
      className="pointer-events-none absolute left-0 right-0 top-0 z-[1] flex h-[min(42vh,200px)] min-h-[140px] flex-col items-center justify-center px-6 md:h-[min(28vh,160px)] md:min-h-[120px]"
      aria-hidden
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`${index}-${list[index].slice(0, 12)}`}
          initial={{ opacity: 0, y: 32, scale: 0.96, filter: 'blur(8px)' }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
          }}
          exit={{
            opacity: 0,
            y: -24,
            scale: 0.97,
            filter: 'blur(6px)',
          }}
          transition={{
            duration: 0.7,
            ease: [0.33, 1, 0.68, 1],
          }}
          className="max-w-4xl text-center"
        >
          <motion.p
            className="text-2xl font-semibold leading-snug tracking-tight text-[var(--text)] sm:text-4xl md:text-5xl lg:text-6xl"
            style={{
              textShadow: `
                0 0 60px color-mix(in srgb, var(--primary) 25%, transparent),
                0 2px 20px color-mix(in srgb, var(--bg) 40%, transparent)
              `,
            }}
            animate={{
              y: [0, -3, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          >
            “{list[index]}”
          </motion.p>
          <motion.span
            className="mt-4 block h-1 w-24 rounded-full bg-[var(--primary)]"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 0.7 }}
            exit={{ scaleX: 0, opacity: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            style={{ originX: 'center' }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Dots: which reason we're on - inside the screensaver block */}
      {list.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {list.map((_, i) => (
            <motion.span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-[var(--muted)]"
              animate={{
                scale: i === index ? 1.4 : 1,
                opacity: i === index ? 1 : 0.4,
                backgroundColor: i === index ? 'var(--primary)' : 'var(--muted)',
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      )}

      {/* Soft vignette so text reads on any background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, color-mix(in srgb, var(--bg) 65%, transparent) 100%)',
        }}
      />
    </div>
  );
}
