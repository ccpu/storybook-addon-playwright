const useScreenshotIndexChange = vi.fn();

useScreenshotIndexChange.mockImplementation(() => ({
  ChangeIndexErrorSnackbar: () => undefined,
  ChangeIndexInProgress: false,
  ChangeIndexSuccessSnackbar: () => undefined,
  changeIndex: vi.fn(),
}));

export { useScreenshotIndexChange };
