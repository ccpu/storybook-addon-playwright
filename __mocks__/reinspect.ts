export const useReducer = jest
  .fn()
  .mockImplementation(
    (_reducer: unknown, initialState: unknown, initialStateFn: () => void) => {
      if (initialStateFn) initialStateFn();
      return [initialState, jest.fn()];
    },
  );
