const unlinkSyncMock = vi.hoisted(() => vi.fn());
const existsSyncMock = vi.hoisted(() => vi.fn());
vi.mock('node:fs', () => ({
  existsSync: existsSyncMock,
  unlinkSync: unlinkSyncMock,
}));

import { storyFileInfo } from '../../configs/story-file-info';
import { deleteScreenshot } from '../../../src/api/services/delete-screenshot';
import { saveStoryFile, loadStoryData } from '../../../src/api/server/utils';

vi.mock(
  '../../../src/api/server/utils/save-story-file',
  async () => await import('../server/utils/__mocks__/save-story-file'),
);
vi.mock(
  '../../../src/api/server/utils/load-story-data',
  async () => await import('../server/utils/__mocks__/load-story-data'),
);

describe('deleteScreenshot', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    existsSyncMock.mockImplementation((filePath: string) =>
      filePath.endsWith('-snap.png'),
    );
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('should do nothing if story not available', async () => {
    const result = await deleteScreenshot({
      filePath: 'story.ts',
      screenshotId: 'screenshot-id',
      storyId: 'invalid-story-id-2',
    });
    expect(result).toBeUndefined();
  });

  it('should delete', async () => {
    await deleteScreenshot({
      filePath: 'story.ts',
      screenshotId: 'screenshot-id',
      storyId: 'story-id',
    });
    expect(
      vi.mocked(saveStoryFile).mock.calls[0]![1]!.stories!['story-id'].screenshots,
    ).toStrictEqual([
      {
        actionSets: [
          {
            actions: [{ args: { selector: 'html' }, id: 'action-id', name: 'click' }],
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

  it('should not have screenshots prop if no screen shot available', async () => {
    vi.mocked(loadStoryData).mockImplementationOnce(() => {
      const data = storyFileInfo();
      return new Promise((resolve) => {
        const stories = data.stories!;
        stories['story-id'].screenshots = [stories['story-id'].screenshots![0]];
        resolve(data);
      });
    });

    await deleteScreenshot({
      filePath: 'story.ts',
      screenshotId: 'screenshot-id',
      storyId: 'story-id',
    });

    expect(
      vi.mocked(saveStoryFile).mock.calls[0]![1]!.stories!['story-id'].screenshots,
    ).toStrictEqual(undefined);

    expect(unlinkSyncMock).toBeCalledTimes(1);
  });

  it('should delete the current screenshot file name variant', async () => {
    existsSyncMock.mockImplementation(
      (filePath: string) => filePath.endsWith('.png') && !filePath.endsWith('-snap.png'),
    );

    await deleteScreenshot({
      filePath: 'story.ts',
      screenshotId: 'screenshot-id',
      storyId: 'story-id',
    });

    expect(unlinkSyncMock).toHaveBeenCalledTimes(1);
    expect(unlinkSyncMock).toHaveBeenCalledWith(
      expect.stringContaining('story-id-title-chromium.png'),
    );
  });
});
