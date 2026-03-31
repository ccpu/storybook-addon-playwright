const useAsyncApiCall = vi.fn();

useAsyncApiCall.mockImplementation(() => {
  return {
    ErrorSnackbar: vi.fn(),
    clearError: vi.fn(),
    clearResult: vi.fn(),
    error: undefined,
    inProgress: false,
    makeCall: vi.fn(),
    result: undefined,
  };
});

export { useAsyncApiCall };
