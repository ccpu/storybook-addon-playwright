import { getScreenshotData } from '../../../../src/api/services/utils/get-screenshot-data';
import { loadStoryData } from '../../../../src/api/server/utils';

vi.mock(
  '../../../../src/api/server/utils/load-story-data.ts',
  async () => await import('../../server/utils/__mocks__/load-story-data'),
);

describe('getScreenshotData', () => {
  const loadStoryDataMock = vi.mocked(loadStoryData);

  it('should return nothing if not story found', async () => {
    const data = await getScreenshotData({
      filePath: 'file-name',
      screenshotId: 'screenshot-id',
      storyId: 'story-id-2',
    });
    expect(data).toStrictEqual(undefined);
  });

  it('should return data', async () => {
    const data = await getScreenshotData({
      filePath: 'file-name',
      screenshotId: 'screenshot-id',
      storyId: 'story-id',
    });
    expect(data).toStrictEqual({
      actionSets: [
        {
          actions: [{ args: { selector: 'html' }, id: 'action-id', name: 'click' }],
          id: 'action-set-id',
          title: 'click',
        },
      ],
      browserType: 'chromium',
      id: 'screenshot-id',
      index: 0,
      title: 'title',
    });
  });

  it('should hydrate missing action ids from persisted screenshot data', async () => {
    loadStoryDataMock.mockImplementationOnce(async () => {
      return {
        stories: {
          ['story-id']: {
            screenshots: [
              {
                actionSets: [
                  {
                    actions: [{ args: { selector: 'html' }, name: 'click' }],
                    title: 'click',
                  },
                ],
                browserType: 'chromium',
                id: 'screenshot-id',
                index: 0,
                title: 'title',
              },
            ],
          },
        },
      } as any;
    });

    const data = await getScreenshotData({
      filePath: 'file-name',
      screenshotId: 'screenshot-id',
      storyId: 'story-id',
    });

    expect(data?.actionSets?.[0].id).toBeTruthy();
    expect(data?.actionSets?.[0].actions[0].id).toBeTruthy();
    expect(data?.actionSets?.[0].actions[0].name).toBe('click');
  });
});
