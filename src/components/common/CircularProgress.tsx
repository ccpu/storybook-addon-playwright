import { css, cx, keyframes } from '@emotion/css';
import React from 'react';

const rotate = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

const dash = keyframes({
  '0%': { strokeDasharray: '1px, 200px', strokeDashoffset: 0 },
  '50%': { strokeDasharray: '100px, 200px', strokeDashoffset: '-15px' },
  '100%': { strokeDasharray: '100px, 200px', strokeDashoffset: '-125px' },
});

export interface CircularProgressProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  /** `svg` class override for API compatibility with `@mui/material`. */
  classes?: { svg?: string };
}

/** Indeterminate circular spinner, replacing `@mui/material`'s `CircularProgress`. */
const CircularProgress: React.FC<CircularProgressProps> = ({
  size = 40,
  className,
  style,
  classes,
}) => {
  const rootClass = css({
    animation: `${rotate} 1.4s linear infinite`,
    color: 'currentColor',
    display: 'inline-block',
  });
  const circleClass = css({
    animation: `${dash} 1.4s ease-in-out infinite`,
    stroke: 'currentColor',
    strokeDasharray: '80px, 200px',
    strokeDashoffset: 0,
  });

  return (
    <span
      aria-label="loading"
      className={cx(rootClass, className)}
      role="progressbar"
      style={{ height: size, width: size, ...style }}
    >
      <svg className={classes?.svg} viewBox="22 22 44 44" style={{ display: 'block' }}>
        <circle
          className={circleClass}
          cx="44"
          cy="44"
          r="20.2"
          fill="none"
          strokeWidth="3.6"
        />
      </svg>
    </span>
  );
};

CircularProgress.displayName = 'CircularProgress';

export { CircularProgress };
