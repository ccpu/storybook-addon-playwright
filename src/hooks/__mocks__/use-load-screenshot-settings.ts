const useLoadScreenshotSettings = jest.fn();

useLoadScreenshotSettings.mockImplementation(() => ({
  loadSetting: jest.fn(),
}));

export { useLoadScreenshotSettings };
