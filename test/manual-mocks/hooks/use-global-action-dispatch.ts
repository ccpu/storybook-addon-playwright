export const dispatchMock = vi.fn<(...args: unknown[]) => unknown>();

vi.mock(
  '../../../src/features/action-set/hooks/use-global-action-dispatch',
  () => ({
    useGlobalActionDispatch: () => ({
      dispatch: dispatchMock,
    }),
  }),
);
