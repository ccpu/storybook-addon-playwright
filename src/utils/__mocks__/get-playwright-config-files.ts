export const getPlaywrightConfigFiles = vi.fn();

getPlaywrightConfigFiles.mockImplementation(() => [
  './stories/test.stories.playwright.json',
  './stories/test-2.stories.playwright.json',
]);
