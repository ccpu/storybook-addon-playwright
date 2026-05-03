const useGlobalActionDispatchMock = vi.fn((callBack: () => void) => callBack());

export const useGlobalActionDispatch: (callback: () => void) => void =
  useGlobalActionDispatchMock;
