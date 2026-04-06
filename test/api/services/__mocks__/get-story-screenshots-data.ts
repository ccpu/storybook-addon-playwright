import { ScreenshotData, StoryInfo } from '../../../../src/typings';

const getStoryScreenshotsData = vi.fn();

getStoryScreenshotsData.mockImplementation(
  (data: StoryInfo): Promise<ScreenshotData[]> => {
    return new Promise((resolve) => {
      resolve([
        {
          browserType: 'chromium',
          id: 'screenshot-id',
          title: data.fileName + '-screenshot',
        },
      ]);
    });
  },
);

export { getStoryScreenshotsData };
