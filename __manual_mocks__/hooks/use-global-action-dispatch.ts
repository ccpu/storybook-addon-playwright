export const dispatchMock = vi.fn();

vi.mock('../../src/hooks/use-global-action-dispatch', () => ({
  useGlobalActionDispatch: () => ({
    dispatch: dispatchMock,
  }),
}));
