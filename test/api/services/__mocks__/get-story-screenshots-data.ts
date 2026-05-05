import { ScreenshotData, StoryInfo } from '../../../../src/typings';

import { getStoryScreenshotsData as orgGetStoryScreenshotsData } from '../../../../src/api/services/get-story-screenshots-data';

const getStoryScreenshotsData = vi.fn<typeof orgGetStoryScreenshotsData>();

getStoryScreenshotsData.mockImplementation(
  (data: StoryInfo): Promise<ScreenshotData[]> => {
    return new Promise((resolve) => {
      resolve([
        {
          browserType: 'chromium',
          id: 'screenshot-id',
          title: data.filePath + '-screenshot',
        },
      ]);
    });
  },
);

export { getStoryScreenshotsData };
