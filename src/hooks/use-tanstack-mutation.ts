import { useCallback, useState } from 'react';
import { toast } from '../utils/toast';

type AnyFn = (...args: unknown[]) => unknown;

type ArgsType<T> = T extends (...args: infer U) => unknown ? U : never;
type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

type MutationReturnType<T extends AnyFn> = ThenArg<ReturnType<T>>;

interface MutationOptions {
  successMessage?: string;
  clearResultOnSuccess?: boolean;
}

export const useTanstackMutation = <T extends AnyFn>(
  func: T,
  setResponseResult = true,
  options: MutationOptions = {},
) => {
  const [error, setError] = useState<string>();
  const [result, setResult] = useState<MutationReturnType<T>>();
  const [inProgress, setInProgress] = useState(false);

  const { successMessage, clearResultOnSuccess } = options;

  const clearResult = useCallback(() => {
    setResult(undefined);
  }, []);

  const clearError = useCallback(() => {
    setError(undefined);
  }, []);

  const makeCall = useCallback(
    async (
      ...args: ArgsType<T>
    ): Promise<MutationReturnType<T> | Error | undefined> => {
      setError(undefined);
      setResult(undefined);
      setInProgress(true);

      try {
        const data = (await func(...args)) as MutationReturnType<T>;

        if (setResponseResult) {
          setResult(data);
        }

        if (successMessage) {
          toast.success(successMessage, {
            onAutoClose: clearResultOnSuccess ? clearResult : undefined,
            onDismiss: clearResultOnSuccess ? clearResult : undefined,
          });
        }

        return data;
      } catch (mutationError) {
        const message =
          (mutationError as { message?: string }).message ||
          'Unexpected error occurred';
        setError(message);
        toast.error(message);
        return new Error(message);
      } finally {
        setInProgress(false);
      }
    },
    [
      clearResult,
      clearResultOnSuccess,
      func,
      setResponseResult,
      successMessage,
    ],
  );

  return {
    clearError,
    clearResult,
    error,
    inProgress,
    makeCall,
    result,
  };
};
