import { ScreenshotData, StoryInfo } from '../../../../typings';

const getStoryScreenshotsData = jest.fn();

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
