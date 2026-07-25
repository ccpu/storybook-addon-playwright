import type { Theme } from '../../styles';
import { makeStyles } from '../../styles';
import { cx } from '@emotion/css';
import React from 'react';

export type BadgeColor = 'primary' | 'secondary' | 'error' | 'default';

export interface BadgeProps {
  badgeContent?: React.ReactNode;
  color?: BadgeColor;
  /** Accepted for MUI compatibility; the badge always sits at the top-right. */
  overlap?: 'rectangular' | 'circular';
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    badge: {
      alignItems: 'center',
      borderRadius: '10px',
      boxSizing: 'border-box',
      display: 'inline-flex',
      fontSize: '0.75rem',
      fontWeight: 500,
      height: '20px',
      justifyContent: 'center',
      lineHeight: 1,
      minWidth: '20px',
      padding: '0 6px',
      position: 'absolute',
      right: 0,
      top: 0,
      whiteSpace: 'nowrap',
    },
    default: {
      backgroundColor: theme.palette.grey[500],
      color: theme.palette.getContrastText(theme.palette.grey[500]),
    },
    error: {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText,
    },
    primary: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
    root: {
      display: 'inline-flex',
      position: 'relative',
      verticalAlign: 'middle',
    },
    secondary: {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.secondary.contrastText,
    },
  }),
  { name: 'Badge' },
);

/**
 * A small count/label bubble overlaid on the top-right of its children,
 * replacing `@mui/material`'s (overlay) `Badge`.
 */
const Badge: React.FC<BadgeProps> = ({
  badgeContent,
  color = 'default',
  className,
  style,
  children,
}) => {
  const classes = useStyles();

  return (
    <span className={cx(classes.root, className)} style={style}>
      {children}
      <span className={cx(classes.badge, classes[color])}>{badgeContent}</span>
    </span>
  );
};

Badge.displayName = 'Badge';

export { Badge };
