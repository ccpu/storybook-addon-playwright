import { getStoryPlaywrightDataByFileName as orgGetStoryPlaywrightDataByFileName } from '../src/api/services/utils/get-story-playwright-data-by-file-name';

export const getStoryPlaywrightDataByFileName =
  vi.fn<typeof orgGetStoryPlaywrightDataByFileName>();
