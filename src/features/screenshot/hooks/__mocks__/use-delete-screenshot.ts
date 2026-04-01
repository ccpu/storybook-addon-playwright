const useDeleteScreenshot = vi.fn();

useDeleteScreenshot.mockImplementation(() => {
  return {
    ErrorSnackbar: () => undefined,
    clearError: () => undefined,
    deleteScreenshot: () => undefined,
    inProgress: false,
  };
});

export { useDeleteScreenshot };
