import { getStoryPlaywrightData } from '../get-story-playwright-data';

jest.mock('../../utils/load-story-data');
jest.mock('../../utils/save-story-file');

describe('getStoryPlaywrightData', () => {
  it('should have data', async () => {
    const result = await getStoryPlaywrightData('story.ts');
    expect(result).toStrictEqual({
      playWrightData: {
        stories: {
          'story-id': {
            actionSets: [
              {
                actions: [
                  {
                    args: { selector: 'html' },
                    id: 'action-id',
                    name: 'click',
                  },
                ],
                description: 'click',
                id: 'action-set-id',
              },
              {
                actions: [
                  {
                    args: { selector: 'html' },
                    id: 'action-id',
                    name: 'click',
                  },
                ],
                description: 'click',
                id: 'action-set-id-2',
              },
            ],
            screenshots: [
              {
                actions: [{ id: 'action-id', name: 'action-name' }],
                browserType: 'chromium',
                id: 'screenshot-id',
                index: 0,
                title: 'title',
              },
              {
                actions: [{ id: 'action-id', name: 'action-name' }],
                browserType: 'chromium',
                id: 'screenshot-id-2',
                index: 1,
                title: 'title-2',
              },
            ],
          },
        },
      },
      storyData: [
        {
          data: {
            actionSets: [
              {
                actions: [
                  {
                    args: { selector: 'html' },
                    id: 'action-id',
                    name: 'click',
                  },
                ],
                description: 'click',
                id: 'action-set-id',
              },
              {
                actions: [
                  {
                    args: { selector: 'html' },
                    id: 'action-id',
                    name: 'click',
                  },
                ],
                description: 'click',
                id: 'action-set-id-2',
              },
            ],
            screenshots: [
              {
                actions: [{ id: 'action-id', name: 'action-name' }],
                browserType: 'chromium',
                id: 'screenshot-id',
                index: 0,
                title: 'title',
              },
              {
                actions: [{ id: 'action-id', name: 'action-name' }],
                browserType: 'chromium',
                id: 'screenshot-id-2',
                index: 1,
                title: 'title-2',
              },
            ],
          },
          storyId: 'story-id',
        },
      ],
    });
  });
});
