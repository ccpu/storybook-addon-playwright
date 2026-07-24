import { makeStyles } from '../../styles';
import clsx from 'clsx';
import React from 'react';

export interface DialogActionsProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const useStyles = makeStyles(
  () => ({
    root: {
      alignItems: 'center',
      display: 'flex',
      flex: '0 0 auto',
      gap: '8px',
      justifyContent: 'flex-end',
      padding: '8px',
      '& button': {
        cursor: 'pointer',
        padding: '6px 16px',
        height: '34px',
        minWidth: '120px',
      },
    },
  }),
  { name: 'DialogActions' },
);

/** Right-aligned dialog footer, replacing `@mui/material`'s `DialogActions`. */
const DialogActions: React.FC<DialogActionsProps> = ({ className, style, children }) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, className)} style={style}>
      {children}
    </div>
  );
};

DialogActions.displayName = 'DialogActions';

export { DialogActions };
