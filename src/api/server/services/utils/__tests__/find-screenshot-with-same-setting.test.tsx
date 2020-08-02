import { findScreenshotWithSameSetting } from '../find-screenshot-with-same-setting';
import { PlaywrightData } from '../../../../../typings';

describe('findScreenshotWithSameSetting', () => {
  const data: PlaywrightData = {
    browserOptions: { ['browser-option-id']: { cursor: true } },
    screenshotOptions: { ['screenshot-options-id']: { fullPage: true } },
    stories: {
      ['story-id']: {
        screenshots: [
          {
            browserOptionsId: 'browser-option-id',
            browserType: 'chromium',
            id: 'screenshot-id',
            title: 'title',
          },

          {
            browserType: 'chromium',
            id: 'screenshot-id-2',
            screenshotOptionsId: 'screenshot-options-id',
            title: 'title',
          },
          {
            actions: [{ id: 'action-id', name: 'action-name' }],
            browserType: 'chromium',
            id: 'screenshot-id-3',
            title: 'title',
          },
        ],
      },
    },
  };

  it('should return undefined', () => {
    const screenshot = findScreenshotWithSameSetting(
      data,
      data.stories['story-id'].screenshots,
      {
        browserType: 'chromium',
        id: 'screenshot-id',
        title: 'title',
      },
    );
    expect(screenshot).toBeUndefined();
  });

  it('should return screenshot with same browserOptions', () => {
    const screenshot = findScreenshotWithSameSetting(
      data,
      data.stories['story-id'].screenshots,
      {
        browserOptions: { cursor: true },
        browserType: 'chromium',
        id: 'test-screenshot-id',
        title: 'title',
      },
    );
    expect(screenshot).toStrictEqual({
      browserOptionsId: 'browser-option-id',
      browserType: 'chromium',
      id: 'screenshot-id',
      title: 'title',
    });
  });

  it('should return screenshot with same screenshotOptions', () => {
    const screenshot = findScreenshotWithSameSetting(
      data,
      data.stories['story-id'].screenshots,
      {
        browserType: 'chromium',
        id: 'test-screenshot-id',
        screenshotOptions: { fullPage: true },
        title: 'title',
      },
    );
    expect(screenshot).toStrictEqual({
      browserType: 'chromium',
      id: 'screenshot-id-2',
      screenshotOptionsId: 'screenshot-options-id',
      title: 'title',
    });
  });

  it('should return screenshot with same actions', () => {
    const screenshot = findScreenshotWithSameSetting(
      data,
      data.stories['story-id'].screenshots,
      {
        actions: [{ id: 'action-id', name: 'action-name' }],
        browserType: 'chromium',
        id: 'test-screenshot-id',
        title: 'title',
      },
    );
    expect(screenshot).toStrictEqual({
      actions: [{ id: 'action-id', name: 'action-name' }],
      browserType: 'chromium',
      id: 'screenshot-id-3',
      title: 'title',
    });
  });
});
