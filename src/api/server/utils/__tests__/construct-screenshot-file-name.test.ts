import { constructScreenshotFileName } from '../construct-screenshot-file-name';

describe('constructScreenshotFileName', () => {
  it('should be defined', () => {
    expect(constructScreenshotFileName).toBeDefined();
  });

  it('should construst', () => {
    expect(
      constructScreenshotFileName({
        browser: 'chromium',
        screenshotTitle: 'screenshot-title',
        storyId: 'story-id',
        storyTitle: 'story-title',
      }),
    ).toBe('story-title-story-id-screenshot-title-chromium-snap.png');
  });
});
