import { setStoryScreenshotOptions as orgSetStoryScreenshotOptions } from '../../../../../src/api/services/utils/set-story-screenshot-options';

export const setStoryScreenshotOptions =
  vi.fn<typeof orgSetStoryScreenshotOptions>();
