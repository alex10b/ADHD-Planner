import { motion } from 'framer-motion';

/**
 * Calm, pretty animated background for focus mode.
 * Soft gradient + subtle floating orbs. Kept minimal so it doesn't distract.
 */
export function FocusModeBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[var(--bg)]"
      aria-hidden
    >
      {/* Soft gradient tint using theme primary */}
      <div
        className="absolute inset-0 opacity-30 dark:opacity-20"
        style={{
          background: `
            linear-gradient(135deg,
              var(--bg) 0%,
              color-mix(in srgb, var(--primary) 12%, var(--bg)) 30%,
              var(--bg) 50%,
              color-mix(in srgb, var(--primary) 8%, var(--bg)) 80%,
              var(--bg) 100%
            )
          `,
        }}
      />

      {/* Slow-moving gradient overlay */}
      <motion.div
        className="absolute -inset-[50%] opacity-30 dark:opacity-15"
        style={{
          background: 'radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--primary) 25%, transparent) 0%, transparent 55%)',
        }}
        animate={{
          x: ['0%', '10%', '0%'],
          y: ['0%', '5%', '0%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />

      {/* Floating orbs - subtle, theme-aware */}
      {[
        { size: 280, x: '10%', y: '20%', delay: 0 },
        { size: 200, x: '75%', y: '60%', delay: 2 },
        { size: 320, x: '50%', y: '80%', delay: 1 },
        { size: 160, x: '85%', y: '15%', delay: 3 },
        { size: 220, x: '20%', y: '70%', delay: 1.5 },
      ].map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl opacity-40 dark:opacity-25"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            backgroundColor: 'var(--primary)',
          }}
          animate={{
            scale: [1, 1.15, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8 + i * 2,
            delay: orb.delay,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      ))}
    </div>
  );
}
