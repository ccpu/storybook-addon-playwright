import React, { memo } from 'react';
import { makeStyles, Backdrop } from '@material-ui/core';

const useStyles = makeStyles(
  () => {
    return {
      backdrop: {
        position: 'absolute',
      },
      root: {
        color: 'red',
      },
    };
  },
  { name: 'ErrorPanel' },
);

export interface ErrorPanelProps {
  message: string;
}

const ErrorPanel: React.FC<ErrorPanelProps> = memo((props) => {
  const { message } = props;

  const classes = useStyles();

  return (
    <Backdrop open={true} className={classes.backdrop}>
      <div className={classes.root}>{message}</div>{' '}
    </Backdrop>
  );
});

ErrorPanel.displayName = 'ErrorPanel';

export { ErrorPanel };
