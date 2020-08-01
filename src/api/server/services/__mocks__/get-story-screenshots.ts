import { ScreenshotData, StoryInfo } from '../../../../typings';

const getStoryScreenshots = jest.fn();

getStoryScreenshots.mockImplementation(
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

export { getStoryScreenshots };
