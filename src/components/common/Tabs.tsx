import type { Theme } from '../../styles';
import { makeStyles } from '../../styles';
import { cx } from '@emotion/css';
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

    tab: {
      background: 'none',
      border: 0,
      color: theme.palette.text.primary,
      borderBottom: '2px solid transparent',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: 500,
      marginBottom: '-1px',
      padding: '10px 16px',
      textTransform: 'none',
      whiteSpace: 'nowrap',
      '&:hover': {
        color: theme.palette.primary.main,
      },
    },
    selected: {
      borderBottomColor: theme.palette.primary.main,
      color: theme.palette.primary.main,
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
      className={cx(classes.tab, { [classes.selected]: selected }, className)}
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
    <div role="tablist" className={cx(classes.root, className)}>
      {items.map((child, index) => {
        const tab = child as React.ReactElement<TabProps>;
        return React.cloneElement(tab, {
          key: index,
          selected: value === index,
          onClick: (event: React.MouseEvent<HTMLButtonElement>) =>
            onChange?.(event, index),
          className: cx(tab.props.className, {
            [classes.fullWidthTab]: variant === 'fullWidth',
          }),
        });
      })}
    </div>
  );
};

Tabs.displayName = 'Tabs';

export { Tab, Tabs };
