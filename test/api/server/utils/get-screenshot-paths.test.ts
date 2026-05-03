import { getScreenshotPaths } from '../../../../src/api/server/utils/get-screenshot-paths';

describe('getScreenshotPaths', () => {
  it('should be defined', () => {
    expect(getScreenshotPaths).toBeDefined();
  });

  it('should call function', () => {
    expect(
      getScreenshotPaths({
        browserType: 'chromium',
        filePath: './test.stories.tsx',
        storyId: 'story-id',
        title: 'title',
      }),
    ).toBeDefined();
  });
});
