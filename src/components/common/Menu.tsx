import type { PopoverOrigin } from './Popover';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { Popover } from './Popover';

type MenuCloseReason = 'backdropClick' | 'escapeKeyDown';

export interface MenuProps {
  open: boolean;
  anchorEl?: Element | null;
  anchorOrigin?: PopoverOrigin;
  transformOrigin?: PopoverOrigin;
  // `event` is `unknown` so callers can pass a no-argument close handler.
  onClose?: (event: unknown, reason?: MenuCloseReason) => void;
  /** Accepted for MUI compatibility; the list is unmounted while closed. */
  keepMounted?: boolean;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const useStyles = makeStyles(
  () => ({
    list: {
      listStyle: 'none',
      margin: 0,
      outline: 0,
      padding: '4px 0',
    },
  }),
  { name: 'Menu' },
);

/**
 * Anchored dropdown menu replacing `@mui/material`'s `Menu`. Renders its
 * children (typically {@link MenuItem}s) inside the reusable {@link Popover},
 * exposing the MUI-compatible `open` / `anchorEl` / `onClose` API.
 */
const Menu: React.FC<MenuProps> = ({
  open,
  anchorEl,
  anchorOrigin,
  transformOrigin,
  onClose,
  id,
  className,
  style,
  children,
}) => {
  const classes = useStyles();

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      onClose={onClose}
      className={className}
      style={style}
    >
      <ul id={id} role="menu" className={classes.list}>
        {children}
      </ul>
    </Popover>
  );
};

Menu.displayName = 'Menu';

export { Menu };
