import { SFC } from 'react';
import { SnackbarWithRetry, Snackbar } from '../../components';
import React from 'react';

const useAsyncApiCall = jest.fn();

useAsyncApiCall.mockImplementation(() => {
  const ErrorSnackbar: SFC<{
    onRetry?: () => void;
    clearResultOnClose?: boolean;
  }> = ({ onRetry }) => {
    return <SnackbarWithRetry type="error" open={true} onRetry={onRetry} />;
  };

  const SuccessSnackbar: SFC<{
    message: string;
    clearResultOnClose?: boolean;
  }> = ({ message }) => {
    return (
      <Snackbar
        type="success"
        title="Success"
        open={true}
        message={message}
        autoHideDuration={4000}
      />
    );
  };

  return {
    ErrorSnackbar,
    SuccessSnackbar,
    clearError: jest.fn(),
    clearResult: jest.fn(),
    error: undefined,
    inProgress: false,
    makeCall: jest.fn(),
    result: undefined,
  };
});

export { useAsyncApiCall };
