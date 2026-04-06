export const globalDispatchMock = vi.fn();

vi.mock(
  '../../../src/features/screenshot/hooks/use-global-screenshot-dispatch',
  () => ({
    useGlobalScreenshotDispatch: () => ({
      dispatch: globalDispatchMock,
    }),
  }),
);
