const useDeleteScreenshot = vi.fn();

useDeleteScreenshot.mockImplementation(() => {
  return {
    clearError: () => undefined,
    deleteScreenshot: () => undefined,
    inProgress: false,
  };
});

export { useDeleteScreenshot };
