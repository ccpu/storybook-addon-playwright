type GlobalDispatch = {
  dispatch: (...args: unknown[]) => unknown;
};

export const useGlobalDispatchs = vi
  .fn<() => GlobalDispatch>()
  .mockImplementation(() => ({
    dispatch: vi.fn(),
  }));
