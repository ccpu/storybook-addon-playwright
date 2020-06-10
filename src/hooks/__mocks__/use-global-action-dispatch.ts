export const useGlobalActionDispatch = jest.fn().mockImplementation(() => {
  return [{}, jest.fn()];
});
