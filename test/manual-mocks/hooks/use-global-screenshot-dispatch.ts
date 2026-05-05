export const globalDispatchMock = vi.fn<(...args: unknown[]) => unknown>();

vi.mock(
  '../../../src/features/screenshot/hooks/use-global-screenshot-dispatch',
  () => ({
    useGlobalScreenshotDispatch: () => ({
      dispatch: globalDispatchMock,
    }),
  }),
);
