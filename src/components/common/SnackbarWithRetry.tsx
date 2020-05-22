import React, { SFC } from 'react';
import { Snackbar, SnackbarProps } from './Snackbar';
import { Button } from '@material-ui/core';

export interface SnackbarWithRetryProps extends SnackbarProps {
  onRetry: () => void;
}

const SnackbarWithRetry: SFC<SnackbarWithRetryProps> = (props) => {
  const { onRetry, message, children, ...rest } = props;

  return (
    <Snackbar open={true} {...rest}>
      <>
        {children ? children : message}
        {onRetry && (
          <Button color="inherit" size="small" onClick={onRetry}>
            Retry
          </Button>
        )}
      </>
    </Snackbar>
  );
};

SnackbarWithRetry.displayName = 'SnackbarWithRetry';

export { SnackbarWithRetry };
