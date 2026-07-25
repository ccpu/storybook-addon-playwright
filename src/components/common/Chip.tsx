import { cx } from '@emotion/css';
import React from 'react';
import { makeStyles } from '../../styles';

export interface ChipProps {
  label?: React.ReactNode;
  variant?: 'filled' | 'outlined';
  size?: 'small' | 'medium';
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const useStyles = makeStyles(
  (theme) => ({
    filled: {
      backgroundColor: theme.palette.action.selected,
    },
    label: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    outlined: {
      border: `1px solid ${theme.palette.divider}`,
    },
    root: {
      alignItems: 'center',
      borderRadius: 16,
      boxSizing: 'border-box',
      color: theme.palette.text.primary,
      display: 'inline-flex',
      fontSize: '0.75rem',
      height: 24,
      maxWidth: '100%',
      padding: '0 8px',
    },
    small: {
      fontSize: '0.6875rem',
      height: 20,
      padding: '0 6px',
    },
  }),
  { name: 'Chip' },
);

/** Compact label pill, replacing `@mui/material`'s `Chip`. */
const Chip: React.FC<ChipProps> = ({
  label,
  variant = 'filled',
  size = 'medium',
  className,
  style,
  title,
  onClick,
}) => {
  const classes = useStyles();

  return (
    <div
      className={cx(
        classes.root,
        classes[variant],
        size === 'small' && classes.small,
        className,
      )}
      style={style}
      title={title}
      onClick={onClick}
    >
      <span className={classes.label}>{label}</span>
    </div>
  );
};

Chip.displayName = 'Chip';

export { Chip };
