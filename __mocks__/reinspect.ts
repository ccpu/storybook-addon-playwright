import { createElement } from 'react';

export const useReducer = vi
  .fn()
  .mockImplementation(
    (_reducer: unknown, initialState: unknown, initialStateFn: () => void) => {
      if (initialStateFn) initialStateFn();
      return [initialState, vi.fn()];
    },
  );

export const StateInspector = () => createElement('div');
