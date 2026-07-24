import type { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import clsx from 'clsx';
import React from 'react';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  style?: React.CSSProperties;
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    horizontal: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      height: 0,
      width: '100%',
    },
    root: {
      border: 0,
      flexShrink: 0,
      margin: 0,
    },
    vertical: {
      alignSelf: 'stretch',
      borderRight: `1px solid ${theme.palette.divider}`,
      height: 'auto',
      width: 0,
    },
  }),
  { name: 'Divider' },
);

/**
 * A thin themed separator line replacing `@mui/material`'s `Divider`.
 */
const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  className,
  style,
}) => {
  const classes = useStyles();

  return (
    <hr
      aria-orientation={orientation}
      className={clsx(classes.root, classes[orientation], className)}
      style={style}
    />
  );
};

Divider.displayName = 'Divider';

export { Divider };
