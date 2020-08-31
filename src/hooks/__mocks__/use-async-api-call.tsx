const useAsyncApiCall = jest.fn();

useAsyncApiCall.mockImplementation(() => {
  return {
    ErrorSnackbar: jest.fn(),
    clearError: jest.fn(),
    clearResult: jest.fn(),
    error: undefined,
    inProgress: false,
    makeCall: jest.fn(),
    result: undefined,
  };
});

export { useAsyncApiCall };
