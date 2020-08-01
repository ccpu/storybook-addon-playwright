import { getScreenshotData } from '../get-screenshot-data';

jest.mock('../../../utils/load-story-data.ts');

describe('getScreenshotData', () => {
  it('should return nothing if not story found', async () => {
    const data = await getScreenshotData({
      fileName: 'file-name',
      screenshotId: 'screenshot-id',
      storyId: 'story-id-2',
    });
    expect(data).toStrictEqual(undefined);
  });

  it('should return data', async () => {
    const data = await getScreenshotData({
      fileName: 'file-name',
      screenshotId: 'screenshot-id',
      storyId: 'story-id',
    });
    expect(data).toStrictEqual({
      actions: [{ id: 'action-id', name: 'action-name' }],
      browserType: 'chromium',
      id: 'screenshot-id',
      index: 0,
      title: 'title',
    });
  });
});
