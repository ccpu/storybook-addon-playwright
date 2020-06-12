import { useState, useCallback, useRef, SFC } from 'react';
import { SnackbarWithRetry, Snackbar } from '../components';
import React from 'react';

type ArgsType<T> = T extends (...args: infer U) => unknown ? U : never;

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
type AsyncApiCallReturnType<T extends Function> = ThenArg<ReturnType<T>>;

export const useAsyncApiCall = <T extends Function>(
  func: T,
  setResponseResult = true,
) => {
  const [inProgress, setInProgress] = useState(false);
  const [error, setError] = useState<string>();
  const funcArgs = useRef<ArgsType<T>>(null);
  const [success, setSuccess] = useState(false);

  const [result, setResult] = useState<AsyncApiCallReturnType<T>>();

  const makeCall = useCallback(
    async (
      ...args: ArgsType<T>
    ): Promise<AsyncApiCallReturnType<T> | Error> => {
      setError(undefined);
      setResult(undefined);
      setInProgress(true);
      funcArgs.current = args;
      let data;
      try {
        data = await func(...args);
        if (setResponseResult) setResult(data);
        setInProgress(false);
        setSuccess(true);
      } catch (error) {
        setInProgress(false);
        setError(error.message);
        return new Error(error.message);
      }
      return data;
    },
    [func, setResponseResult],
  );

  const clearResult = useCallback(() => {
    setResult(undefined);
  }, []);

  const clearError = useCallback(() => {
    setError(undefined);
  }, []);

  const ErrorSnackbar: SFC<{
    onRetry?: () => void;
  }> = ({ onRetry }) => {
    if (!error) return null;

    return (
      <SnackbarWithRetry
        type="error"
        title="Error"
        open={true}
        onClose={clearError}
        // message={error}
        onRetry={onRetry}
      >
        <div>
          {error.split('\n').map((x, i) => {
            return <div key={i}>{x}</div>;
          })}
        </div>
      </SnackbarWithRetry>
    );
  };

  const SuccessSnackbar: SFC<{
    message: string;
    clearResultOnClose?: boolean;
  }> = ({ message, clearResultOnClose }) => {
    if (!success) return null;
    const handleClose = () => {
      setSuccess(false);
      if (clearResultOnClose) {
        clearResult();
      }
    };
    return (
      <Snackbar
        type="success"
        title="Success"
        open={true}
        onClose={handleClose}
        message={message}
        autoHideDuration={4000}
      />
    );
  };

  return {
    ErrorSnackbar,
    SuccessSnackbar,
    clearError,
    clearResult,
    error,
    inProgress,
    makeCall,
    result,
  };
};
