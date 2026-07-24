import type { Theme } from '../../styles';
import { makeStyles } from '../../styles';
import clsx from 'clsx';
import React, { forwardRef } from 'react';

export interface MenuItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  selected?: boolean;
  disabled?: boolean;
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    disabled: {
      cursor: 'default',
      opacity: theme.palette.action.disabledOpacity,
      pointerEvents: 'none',
    },
    root: {
      alignItems: 'center',
      cursor: 'pointer',
      display: 'flex',
      fontSize: 'inherit',
      listStyle: 'none',
      padding: '6px 16px',
      userSelect: 'none',
      whiteSpace: 'nowrap',
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
    },
    selected: {
      backgroundColor: theme.palette.action.selected,
    },
  }),
  { name: 'MenuItem' },
);

/**
 * A single selectable row inside a {@link Menu}, replacing `@mui/material`'s
 * `MenuItem`. Forwards its ref to the underlying `<li>` and accepts the usual
 * list-item HTML attributes (`onClick`, `className`, ...).
 */
const MenuItem = forwardRef<HTMLLIElement, MenuItemProps>(
  ({ selected, disabled, className, children, ...rest }, ref) => {
    const classes = useStyles();

    return (
      <li
        ref={ref}
        role="menuitem"
        aria-disabled={disabled || undefined}
        className={clsx(
          classes.root,
          { [classes.selected]: selected, [classes.disabled]: disabled },
          className,
        )}
        {...rest}
      >
        {children}
      </li>
    );
  },
);

MenuItem.displayName = 'MenuItem';

export { MenuItem };
