const useLoadScreenshotSettings = vi.fn();

useLoadScreenshotSettings.mockImplementation(() => ({
  loadSetting: vi.fn(),
}));

export { useLoadScreenshotSettings };
