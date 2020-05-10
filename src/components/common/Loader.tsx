import React, { memo, SFC } from 'react';
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(
  () => {
    return {
      root: {
        zIndex: 10000,
      },
    };
  },
  { name: 'Loader' },
);

export interface LoaderProps {
  open: boolean;
}

const Loader: SFC<LoaderProps> = memo((props) => {
  const { open } = props;

  const classes = useStyles();

  return (
    <Backdrop className={classes.root} open={open}>
      <CircularProgress />
    </Backdrop>
  );
});

Loader.displayName = 'Loader';

export { Loader };
