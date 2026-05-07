import { getStoryPlaywrightFileInfo as orgGetStoryPlaywrightFileInfo } from '../src/api/server/utils/get-story-playwright-file-info';

export const getStoryPlaywrightFileInfo = vi.fn<typeof orgGetStoryPlaywrightFileInfo>();
