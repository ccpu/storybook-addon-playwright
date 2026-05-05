type GlobalScreenshotDispatch = {
  dispatch: (...args: unknown[]) => unknown;
};

export const useGlobalScreenshotDispatch = vi
  .fn<() => GlobalScreenshotDispatch>()
  .mockImplementation(() => ({
    dispatch: vi.fn(),
  }));
