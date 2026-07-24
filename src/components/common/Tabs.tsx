import type { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import clsx from 'clsx';
import React from 'react';

export interface TabProps {
  label: React.ReactNode;
  className?: string;
  // Injected by `Tabs` when it clones its children:
  selected?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface TabsProps {
  value: number;
  onChange?: (event: React.SyntheticEvent, value: number) => void;
  /** `fullWidth` stretches the tabs to fill the row (MUI-compatible). */
  variant?: 'standard' | 'fullWidth' | 'scrollable';
  /** Accepted for MUI compatibility. */
  textColor?: 'primary' | 'secondary' | 'inherit';
  /** Accepted for MUI compatibility. */
  indicatorColor?: 'primary' | 'secondary';
  className?: string;
  children?: React.ReactNode;
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    fullWidthTab: {
      flex: 1,
    },
    root: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      display: 'flex',
    },
    selected: {
      borderBottomColor: theme.palette.primary.main,
      color: theme.palette.primary.main,
    },
    tab: {
      background: 'none',
      border: 0,
      borderBottom: '2px solid transparent',
      color: theme.palette.text.secondary,
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: 500,
      marginBottom: '-1px',
      padding: '10px 16px',
      textTransform: 'none',
      whiteSpace: 'nowrap',
      '&:hover': {
        color: theme.palette.text.primary,
      },
    },
  }),
  { name: 'Tabs' },
);

/** A single tab button, rendered inside {@link Tabs}. */
const Tab: React.FC<TabProps> = ({ label, className, selected, onClick }) => {
  const classes = useStyles();

  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      className={clsx(classes.tab, { [classes.selected]: selected }, className)}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

Tab.displayName = 'Tab';

/**
 * A controlled tab bar replacing `@mui/material`'s `Tabs`. Clones its {@link Tab}
 * children to inject the selected state and click handling, exposing the same
 * `value` / `onChange(event, index)` API.
 */
const Tabs: React.FC<TabsProps> = ({
  value,
  onChange,
  variant = 'standard',
  className,
  children,
}) => {
  const classes = useStyles();

  const items = React.Children.toArray(children).filter(React.isValidElement);

  return (
    <div role="tablist" className={clsx(classes.root, className)}>
      {items.map((child, index) => {
        const tab = child as React.ReactElement<TabProps>;
        return React.cloneElement(tab, {
          key: index,
          selected: value === index,
          onClick: (event: React.MouseEvent<HTMLButtonElement>) =>
            onChange?.(event, index),
          className: clsx(tab.props.className, {
            [classes.fullWidthTab]: variant === 'fullWidth',
          }),
        });
      })}
    </div>
  );
};

Tabs.displayName = 'Tabs';

export { Tab, Tabs };
