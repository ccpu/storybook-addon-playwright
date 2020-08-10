export const useGlobalActionDispatch = jest.fn();

useGlobalActionDispatch.mockImplementation((callBack) => callBack());
