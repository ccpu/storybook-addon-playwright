export const useGlobalActionDispatch = vi.fn();

useGlobalActionDispatch.mockImplementation((callBack) => callBack());
