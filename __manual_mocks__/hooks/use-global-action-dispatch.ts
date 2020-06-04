export const dispatchMock = jest.fn();

jest.mock('../../src/hooks/use-global-action-dispatch', () => ({
  useGlobalActionDispatch: () => ({
    dispatch: dispatchMock,
  }),
}));
