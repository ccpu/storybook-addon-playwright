import { useState, useCallback, useRef, SFC, useEffect } from 'react';
import { Snackbar, SnackbarProps } from '../components';
import React from 'react';
import { Button } from '@material-ui/core';
import { useSnackbar } from './use-snackbar';

type ArgsType<T> = T extends (...args: infer U) => unknown ? U : never;

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/ban-types
type AsyncApiCallReturnType<T extends Function> = ThenArg<ReturnType<T>>;

interface Options {
  successMessage?: string;
  clearResultOnSuccess?: boolean;
  retryButton?: boolean;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export const useAsyncApiCall = <T extends Function>(
  func: T,
  setResponseResult = true,
  options: Options = {},
) => {
  const [inProgress, setInProgress] = useState(false);
  const [error, setError] = useState<string>();
  const funcArgs = useRef<ArgsType<T>>(null);

  const { openSnackbar } = useSnackbar();

  const { successMessage, clearResultOnSuccess } = options;

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

        if (successMessage) {
          openSnackbar(successMessage, {
            onClose: clearResultOnSuccess
              ? () => setResult(undefined)
              : undefined,
          });
        }
      } catch (error) {
        setInProgress(false);
        setError(error.message);
        return new Error(error.message);
      }
      return data;
    },
    [
      clearResultOnSuccess,
      func,
      openSnackbar,
      setResponseResult,
      successMessage,
    ],
  );

  const clearResult = useCallback(() => {
    setResult(undefined);
  }, []);

  const clearError = useCallback(() => {
    setError(undefined);
  }, []);

  const ErrorSnackbar: SFC<
    SnackbarProps & { onRetry?: () => void }
  > = useCallback(
    ({ onRetry }) => {
      if (!error) return null;
      return (
        <Snackbar
          variant="error"
          open={true}
          onClose={clearError}
          action={
            onRetry && (
              <Button color="inherit" onClick={onRetry}>
                Retry
              </Button>
            )
          }
          message={error}
        />
      );
    },
    [clearError, error],
  );

  useEffect(() => {
    return () => {
      clearResult();
      clearError();
    };
  }, [clearError, clearResult]);

  return {
    ErrorSnackbar,
    clearError,
    clearResult,
    error,
    inProgress,
    makeCall,
    result,
  };
};
