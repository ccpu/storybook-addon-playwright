import { updateScreenshotService } from '../update-screenshot-service';

jest.mock('../../utils/save-story-file');
jest.mock('../../utils/load-story-data');
jest.mock('../diff-image-to-screenshot');

describe('updateScreenshot', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update', async () => {
    const result = await updateScreenshotService({
      base64: 'base64-image',
      fileName: 'story.ts',
      hash: 'hash',
      storyId: 'story-id',
    });
    expect(result).toStrictEqual({
      added: true,
      screenshotHash: 'hash',
      storyId: 'story-id',
    });
  });

  it('should throw if screenshotData not found', async () => {
    await expect(
      updateScreenshotService({
        base64: 'base64-image',
        fileName: 'story.ts',
        hash: 'invalid-hash',
        storyId: 'story-id',
      }),
    ).rejects.toThrowError('Unable to find screenshot data.');
  });
});
