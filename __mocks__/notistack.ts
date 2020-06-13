export const useSnackbar = jest.fn().mockImplementation(() => {
  return {
    closeSnackbar: jest.fn(),
    enqueueSnackbar: jest.fn(),
  };
});

export const SnackbarProvider = jest.fn();
