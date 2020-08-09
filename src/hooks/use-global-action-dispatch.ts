import { useGlobalState } from './use-global-state';
import { Action } from '../store/actions/reducer';
import { useCallback, useEffect } from 'react';

export const useGlobalActionDispatch = () => {
  const [action, dispatch] = useGlobalState<Action>('action-dispatch');

  return { action, dispatch };
};

type Dispatch = (action: Action) => void;

const dispatches: { [id: string]: Dispatch } = {};

export const useGlobalActionDispatch2 = (id: string, callback?: Dispatch) => {
  if (callback) {
    dispatches[id] = callback;
  }

  const dispatch = useCallback(
    (action?: Action) => {
      if (!dispatches[id]) {
        throw new Error('Dispatch id not registered yet!');
      }
      dispatches[id](action);
    },
    [id],
  );

  useEffect(() => {
    return () => {
      if (dispatches[id]) {
        delete dispatches[id];
      }
    };
  }, [id]);

  return { dispatch };
};
