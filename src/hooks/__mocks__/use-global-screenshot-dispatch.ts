const useGlobalScreenshotDispatch = jest.fn();

useGlobalScreenshotDispatch.mockImplementation(() => {
  return {
    dispatch: jest.fn(),
  };
});

export { useGlobalScreenshotDispatch };
