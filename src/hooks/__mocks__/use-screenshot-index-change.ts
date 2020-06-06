const useScreenshotIndexChange = jest.fn();

useScreenshotIndexChange.mockImplementation(() => ({
  ChangeIndexErrorSnackbar: () => undefined,
  ChangeIndexInProgress: false,
  ChangeIndexSuccessSnackbar: () => undefined,
  changeIndex: jest.fn(),
}));

export { useScreenshotIndexChange };
