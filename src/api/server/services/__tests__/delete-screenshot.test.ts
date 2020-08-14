const unlinkSyncMock = jest.fn();
jest.mock('fs', () => ({ existsSync: () => true, unlinkSync: unlinkSyncMock }));

import { storyFileInfo } from '../../../../../__test_data__/story-file-info';
import { deleteScreenshot } from '../delete-screenshot';
import { saveStoryFile, loadStoryData } from '../../utils';
import { mocked } from 'ts-jest/utils';

jest.mock('../../utils/save-story-file');
jest.mock('../../utils/load-story-data');

describe('deleteScreenshot', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should do nothing if story not available', async () => {
    const result = await deleteScreenshot({
      fileName: 'story.ts',
      screenshotId: 'screenshot-id',
      storyId: 'invalid-story-id-2',
    });
    expect(result).toBeUndefined();
  });

  it('should delete', async () => {
    await deleteScreenshot({
      fileName: 'story.ts',
      screenshotId: 'screenshot-id',
      storyId: 'story-id',
    });
    expect(
      mocked(saveStoryFile).mock.calls[0][1].stories['story-id'].screenshots,
    ).toStrictEqual([
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

  it('should not have screenshots prop if no screen shot available', async () => {
    mocked(loadStoryData).mockImplementationOnce(() => {
      const data = storyFileInfo();
      return new Promise((resolve) => {
        data.stories['story-id'].screenshots = [
          data.stories['story-id'].screenshots[0],
        ];
        resolve(data);
      });
    });

    await deleteScreenshot({
      fileName: 'story.ts',
      screenshotId: 'screenshot-id',
      storyId: 'story-id',
    });

    expect(
      mocked(saveStoryFile).mock.calls[0][1].stories['story-id'].screenshots,
    ).toStrictEqual(undefined);

    expect(unlinkSyncMock).toBeCalledTimes(1);
  });
});
