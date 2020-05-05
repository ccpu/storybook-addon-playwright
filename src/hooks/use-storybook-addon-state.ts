import { useRef, useCallback } from 'react';
import { useStorybookApi } from '@storybook/api';

/* useAddonState from  '@storybook/api' causing reenter because of 'setState', we use useCallback to solve it*/

function orDefault<S>(fromStore: S, defaultState: S): S {
  if (typeof fromStore === 'undefined') {
    return defaultState;
  }
  return fromStore;
}
export type StateMerger<S> = (input: S) => S;

export interface Options {
  persistence: 'none' | 'session' | string;
}

export function useStoryBookAddonState<S>(addonId: string, defaultState?: S) {
  const api = useStorybookApi();
  const ref = useRef<{ [k: string]: boolean }>({});

  const existingState = api.getAddonState<S>(addonId);
  const state = orDefault<S>(existingState, defaultState);

  const setState = useCallback(
    (newStateOrMerger: S | StateMerger<S>, options?: Options) => {
      return api.setAddonState<S>(addonId, newStateOrMerger, options);
    },
    [addonId, api],
  );

  if (typeof existingState === 'undefined' && typeof state !== 'undefined') {
    if (!ref.current[addonId]) {
      api.setAddonState<S>(addonId, state);
      ref.current[addonId] = true;
    }
  }

  return [state, setState] as [
    S,
    (newStateOrMerger: S | StateMerger<S>, options?: Options) => Promise<S>,
  ];
}
