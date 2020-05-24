export const globalDispatchMock = jest.fn();

jest.mock('../../src/hooks/use-global-screenshot-dispatch', () => ({
  useGlobalScreenshotDispatch: () => ({
    dispatch: globalDispatchMock,
  }),
}));
