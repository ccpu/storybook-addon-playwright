import { getScreenshotData } from '../get-screenshot-data';

jest.mock('../../../utils/load-story-data.ts');

describe('getScreenshotData', () => {
  it('should return nothing if not story found', async () => {
    const data = await getScreenshotData({
      fileName: 'file-name',
      hash: 'hash',
      storyId: 'story-id-2',
    });
    expect(data).toStrictEqual(undefined);
  });

  it('should return data', async () => {
    const data = await getScreenshotData({
      fileName: 'file-name',
      hash: 'hash',
      storyId: 'story-id',
    });
    expect(data).toStrictEqual({
      actions: [{ id: 'action-id', name: 'action-name' }],
      browserType: 'chromium',
      hash: 'hash',
      index: 0,
      title: 'title',
    });
  });
});
