import { makeStyles } from '@mui/styles';
import clsx from 'clsx';
import React from 'react';

export interface DialogContentProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const useStyles = makeStyles(
  () => ({
    root: {
      flex: '1 1 auto',
      overflowY: 'auto',
      padding: '8px 24px 20px',
    },
  }),
  { name: 'DialogContent' },
);

/** Scrollable dialog body, replacing `@mui/material`'s `DialogContent`. */
const DialogContent: React.FC<DialogContentProps> = ({ className, style, children }) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, className)} style={style}>
      {children}
    </div>
  );
};

DialogContent.displayName = 'DialogContent';

export { DialogContent };
