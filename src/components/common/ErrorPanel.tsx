import React, { memo, SFC } from 'react';
import { makeStyles, Backdrop } from '@material-ui/core';

const useStyles = makeStyles(
  () => {
    return {
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

const ErrorPanel: SFC<ErrorPanelProps> = memo((props) => {
  const { message } = props;

  const classes = useStyles();

  return (
    <Backdrop open={true}>
      <div className={classes.root}>{message}</div>{' '}
    </Backdrop>
  );
});

ErrorPanel.displayName = 'ErrorPanel';

export { ErrorPanel };
