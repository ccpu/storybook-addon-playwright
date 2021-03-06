import { getStoryScreenshotsData } from '../get-story-screenshots-data';
import { storyFileInfo } from '../../../../../__test_data__/story-file-info';
import { loadStoryData } from '../../utils/load-story-data';

jest.mock('../../utils/save-story-file');
jest.mock('../../utils/load-story-data');

describe('getStoryScreenshots', () => {
  it('should have result', async () => {
    const result = await getStoryScreenshotsData({
      fileName: 'story.ts',
      storyId: 'story-id',
    });
    expect(result).toStrictEqual([
      {
        actionSets: [
          {
            actions: [
              { args: { selector: 'html' }, id: 'action-id', name: 'click' },
            ],
            id: 'action-set-id',
            title: 'click',
          },
        ],
        browserType: 'chromium',
        id: 'screenshot-id',
        index: 0,
        title: 'title',
      },
      {
        actionSets: [
          {
            actions: [
              { args: { selector: 'html' }, id: 'action-id', name: 'click' },
            ],
            id: 'action-set-id-2',
            title: 'click',
          },
        ],
        browserType: 'chromium',
        id: 'screenshot-id-2',
        index: 1,
        title: 'title-2',
      },
    ]);
  });

  it('should not have result if story id not exist', async () => {
    const result = await getStoryScreenshotsData({
      fileName: 'story.ts',
      storyId: 'invalid-story-id',
    });
    expect(result).toStrictEqual(undefined);
  });

  it('should set screenshot browserOptions', async () => {
    (loadStoryData as jest.Mock).mockImplementation(() => {
      const data = storyFileInfo({
        browserOptions: {
          'browser-option-id': {
            cursor: true,
          },
        },
        screenshotOptions: {
          'screenshot-option-id': {
            fullPage: true,
          },
        },
      });
      data.stories['story-id'].screenshots = [
        {
          actionSets: [
            {
              actions: [
                {
                  id: 'action-id',
                  name: 'action-name',
                },
              ],
              id: 'action-set-id',
              title: 'action-set-title',
            },
          ],
          browserOptionsId: 'browser-option-id',
          browserType: 'chromium',
          id: 'screenshot-id',
          index: 0,
          screenshotOptionsId: 'screenshot-option-id',
          title: 'title',
        },
      ];

      return new Promise((resolve) => {
        resolve(data);
      });
    });

    const result = await getStoryScreenshotsData({
      fileName: 'story.ts',
      storyId: 'story-id',
    });

    expect(result).toStrictEqual([
      {
        actionSets: [
          {
            actions: [{ id: 'action-id', name: 'action-name' }],
            id: 'action-set-id',
            title: 'action-set-title',
          },
        ],
        browserOptions: { cursor: true },
        browserOptionsId: 'browser-option-id',
        browserType: 'chromium',
        id: 'screenshot-id',
        index: 0,
        screenshotOptions: { fullPage: true },
        screenshotOptionsId: 'screenshot-option-id',
        title: 'title',
      },
    ]);
  });
});
