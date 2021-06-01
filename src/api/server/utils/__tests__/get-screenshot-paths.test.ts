import { getScreenshotPaths } from '../get-screenshot-paths';

describe('getScreenshotPaths', () => {
  it('should be defined', () => {
    expect(getScreenshotPaths).toBeDefined();
  });

  it('should call function', () => {
    expect(
      getScreenshotPaths({
        browserType: 'chromium',
        fileName: 'file-name',
        storyId: 'story-id',
        title: 'title',
      }),
    ).toBeDefined();
  });
});
