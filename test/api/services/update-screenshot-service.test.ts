import { updateScreenshotService } from '../../../src/api/services/update-screenshot-service';

vi.mock(
  '../../../src/api/server/utils/save-story-file',
  async () => await import('../server/utils/__mocks__/save-story-file'),
);
vi.mock(
  '../../../src/api/server/utils/load-story-data',
  async () => await import('../server/utils/__mocks__/load-story-data'),
);
vi.mock(
  '../../../src/api/services/diff-image-to-screenshot',
  async () => await import('./__mocks__/diff-image-to-screenshot'),
);

describe('updateScreenshot', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update', async () => {
    const result = await updateScreenshotService({
      base64: 'base64-image',
      filePath: 'story.ts',
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
        filePath: 'story.ts',
        screenshotId: 'invalid-screenshot-id',
        storyId: 'story-id',
      }),
    ).rejects.toThrowError('Unable to find screenshot data.');
  });
});
