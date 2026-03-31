export const globalDispatchMock = vi.fn();

vi.mock('../../src/hooks/use-global-screenshot-dispatch', () => ({
  useGlobalScreenshotDispatch: () => ({
    dispatch: globalDispatchMock,
  }),
}));
