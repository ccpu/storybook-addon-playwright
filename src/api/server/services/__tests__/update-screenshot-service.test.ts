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
      screenshotId: 'screenshot-id',
      storyId: 'story-id',
    });
    expect(result).toStrictEqual({
      added: true,
      screenshotId: 'screenshot-id',
      storyId: 'story-id',
    });
  });

  it('should throw if screenshotData not found', async () => {
    await expect(
      updateScreenshotService({
        base64: 'base64-image',
        fileName: 'story.ts',
        screenshotId: 'invalid-screenshot-id',
        storyId: 'story-id',
      }),
    ).rejects.toThrowError('Unable to find screenshot data.');
  });
});
