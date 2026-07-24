import { css } from '@emotion/css';
import clsx from 'clsx';
import React from 'react';

export interface BackdropProps {
  open: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  children?: React.ReactNode;
}

const rootClass = css({
  alignItems: 'center',
  bottom: 0,
  display: 'flex',
  justifyContent: 'center',
  left: 0,
  position: 'fixed',
  right: 0,
  top: 0,
  WebkitTapHighlightColor: 'transparent',
});

/** Full-cover overlay, replacing `@mui/material`'s `Backdrop`. */
const Backdrop: React.FC<BackdropProps> = ({
  open,
  className,
  style,
  onClick,
  children,
}) => {
  if (!open) return null;

  return (
    <div
      aria-hidden
      className={clsx(rootClass, className)}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

Backdrop.displayName = 'Backdrop';

export { Backdrop };
