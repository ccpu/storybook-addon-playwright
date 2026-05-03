const useScreenshotIndexChange = vi.fn();

useScreenshotIndexChange.mockImplementation(() => ({
  ChangeIndexInProgress: false,
  ChangeIndexSuccessSnackbar: () => undefined,
  changeIndex: vi.fn(),
}));

export { useScreenshotIndexChange };
