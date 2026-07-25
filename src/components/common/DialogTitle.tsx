import { makeStyles } from '../../styles';
import { cx } from '@emotion/css';
import React from 'react';

export interface DialogTitleProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const useStyles = makeStyles(
  () => ({
    root: {
      flex: '0 0 auto',
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.6,
      margin: 0,
      padding: '16px 24px',
    },
  }),
  { name: 'DialogTitle' },
);

/** Dialog header row, replacing `@mui/material`'s `DialogTitle`. */
const DialogTitle: React.FC<DialogTitleProps> = ({ className, style, children }) => {
  const classes = useStyles();

  return (
    <div className={cx(classes.root, className)} style={style}>
      {children}
    </div>
  );
};

DialogTitle.displayName = 'DialogTitle';

export { DialogTitle };
