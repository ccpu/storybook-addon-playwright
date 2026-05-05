import { createElement } from 'react';

type UseReducer = <State>(
  reducer: unknown,
  initialState: State,
  initialStateFn: (() => void) | undefined,
) => [State, ReturnType<typeof vi.fn>];

export const useReducer = vi
  .fn<UseReducer>()
  .mockImplementation(
    (_reducer: unknown, initialState: unknown, initialStateFn?: () => void) => {
      if (initialStateFn) initialStateFn();
      return [initialState, vi.fn()];
    },
  );

export const StateInspector = () => createElement('div');
