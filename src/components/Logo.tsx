interface LogoProps {
  className?: string;
  size?: number;
}

/** Logo from SVG file – scales cleanly, single source of truth in public/focusara-logo.svg */
export function Logo({ className = '', size = 32 }: LogoProps) {
  return (
    <img
      src="/focusara-logo.svg"
      alt=""
      width={size}
      height={size}
      className={className}
      draggable={false}
    />
  );
}
