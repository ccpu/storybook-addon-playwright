export const useSnackbar = vi.fn().mockImplementation(() => {
  return {
    closeSnackbar: vi.fn(),
    enqueueSnackbar: vi.fn(),
  };
});

export const SnackbarProvider = vi.fn();
