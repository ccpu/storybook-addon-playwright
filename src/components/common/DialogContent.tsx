import { makeStyles } from '../../styles';
import { cx } from '@emotion/css';
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
    <div className={cx(classes.root, className)} style={style}>
      {children}
    </div>
  );
};

DialogContent.displayName = 'DialogContent';

export { DialogContent };
