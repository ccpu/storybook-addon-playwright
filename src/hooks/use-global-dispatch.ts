import { useCallback } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DispatchType<T extends unknown = any> = (action: T) => void;

const dispatches: { [id: string]: DispatchType } = {};

export function useGlobalDispatch<T>(id: string, callback?: DispatchType<T>) {
  if (callback) {
    dispatches[id] = callback;
  }

  const dispatch = useCallback(
    (action?: T) => {
      if (!dispatches[id]) {
        throw new Error('Dispatch id not registered yet!');
      }
      dispatches[id](action);
    },
    [id],
  );

  return { dispatch };
}
