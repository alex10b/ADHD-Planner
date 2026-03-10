import { useId } from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

/** Clean lens/focus icon – works on light and dark, scales perfectly */
export function Logo({ className = '', size = 32 }: LogoProps) {
  const id = useId().replace(/:/g, '');
  const gradId = `logo-grad-${id}`;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
      className={className}
      width={size}
      height={size}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#4338ca" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="26" stroke={`url(#${gradId})`} strokeWidth="4" fill="none" />
      <circle cx="32" cy="32" r="12" fill={`url(#${gradId})`} />
      <circle cx="32" cy="32" r="4" fill="#e2e8f0" />
    </svg>
  );
}
