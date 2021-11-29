import { useCallback } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DispatchType<T = any> = (action: T) => void;

export const _dispatchFuncs: { [id: string]: DispatchType } = {};

export function useGlobalDispatch<T>(id: string, callback?: DispatchType<T>) {
  if (callback) {
    _dispatchFuncs[id] = callback;
  }

  const dispatch = useCallback(
    (action?: T) => {
      if (!_dispatchFuncs[id]) {
        throw new Error('Dispatch id not registered yet!');
      }
      _dispatchFuncs[id](action);
    },
    [id],
  );

  return { dispatch };
}
