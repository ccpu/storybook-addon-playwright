import { getStoryIdFormScreenshotFileName } from '../get-story-id-form-screenshot-file-name';

describe('getStoryIdFormScreenshotFileName', () => {
  it('should be defined', () => {
    expect(getStoryIdFormScreenshotFileName).toBeDefined();
  });

  it('should return story id', () => {
    expect(
      getStoryIdFormScreenshotFileName({
        browser: 'chromium',
        fileName: 'story-title-with-tippy-screenshot-title-chromium-snap.png',
        screenshotTitle: 'screenshot-title',
        storyTitle: 'story-title',
      }),
    ).toBe('with-tippy');
  });
});
