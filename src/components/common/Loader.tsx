import React, { memo, SFC } from 'react';
import { Backdrop, CircularProgress } from '@material-ui/core';

export interface LoaderProps {
  open: boolean;
}

const Loader: SFC<LoaderProps> = memo((props) => {
  const { open } = props;

  return (
    <Backdrop open={open}>
      <CircularProgress />
    </Backdrop>
  );
});

Loader.displayName = 'Loader';

export { Loader };
