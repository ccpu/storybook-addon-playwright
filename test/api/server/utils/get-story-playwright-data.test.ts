import { getStoryPlaywrightData } from '../../../../src/api/server/utils/get-story-playwright-data';

vi.mock(
  '../../../../src/api/server/utils/load-story-data',
  async () => await import('./__mocks__/load-story-data'),
);
vi.mock(
  '../../../../src/api/server/utils/save-story-file',
  async () => await import('./__mocks__/save-story-file'),
);

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
                id: 'action-set-id',
                title: 'click',
              },
              {
                actions: [
                  {
                    args: { selector: 'html' },
                    id: 'action-id',
                    name: 'click',
                  },
                ],
                id: 'action-set-id-2',
                title: 'click',
              },
            ],
            screenshots: [
              {
                actionSets: [
                  {
                    actions: [
                      {
                        args: { selector: 'html' },
                        id: 'action-id',
                        name: 'click',
                      },
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
                      {
                        args: { selector: 'html' },
                        id: 'action-id',
                        name: 'click',
                      },
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
                id: 'action-set-id',
                title: 'click',
              },
              {
                actions: [
                  {
                    args: { selector: 'html' },
                    id: 'action-id',
                    name: 'click',
                  },
                ],
                id: 'action-set-id-2',
                title: 'click',
              },
            ],
            screenshots: [
              {
                actionSets: [
                  {
                    actions: [
                      {
                        args: { selector: 'html' },
                        id: 'action-id',
                        name: 'click',
                      },
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
                      {
                        args: { selector: 'html' },
                        id: 'action-id',
                        name: 'click',
                      },
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
            ],
          },
          storyId: 'story-id',
        },
      ],
    });
  });
});
