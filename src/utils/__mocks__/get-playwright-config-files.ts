export const getPlaywrightConfigFiles = jest.fn();

getPlaywrightConfigFiles.mockImplementation(() => [
  './stories/test.stories.playwright.json',
  './stories/test-2.stories.playwright.json',
]);
