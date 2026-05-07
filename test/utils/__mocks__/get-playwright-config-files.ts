import { getPlaywrightConfigFiles as orgGetPlaywrightConfigFiles } from '../../../src/utils/get-playwright-config-files';

export const getPlaywrightConfigFiles = vi.fn<typeof orgGetPlaywrightConfigFiles>();

getPlaywrightConfigFiles.mockImplementation(async () => [
  './stories/test.stories.playwright.json',
  './stories/test-2.stories.playwright.json',
]);
