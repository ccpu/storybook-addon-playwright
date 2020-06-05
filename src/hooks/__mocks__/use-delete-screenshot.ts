const useDeleteScreenshot = jest.fn();

useDeleteScreenshot.mockImplementation(() => {
  return {
    ErrorSnackbar: () => undefined,
    clearError: () => undefined,
    deleteScreenshot: () => undefined,
    inProgress: false,
  };
});

export { useDeleteScreenshot };
