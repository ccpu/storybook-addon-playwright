const useLoadScreenshotSettings = jest.fn();

useLoadScreenshotSettings.mockImplementation(() => ({
  loadSetting: jest.fn(),
}));

// return { loadSetting };

export { useLoadScreenshotSettings };
