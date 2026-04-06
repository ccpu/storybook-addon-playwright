export const dispatchMock = vi.fn();

vi.mock(
  '../../../src/features/action-set/hooks/use-global-action-dispatch',
  () => ({
    useGlobalActionDispatch: () => ({
      dispatch: dispatchMock,
    }),
  }),
);
