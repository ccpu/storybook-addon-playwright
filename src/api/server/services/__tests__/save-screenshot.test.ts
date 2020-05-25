const diffImageToSnapshotMock = jest.fn() as jest.Mock<ImageDiff>;

jest.mock('jest-image-snapshot/src/diff-snapshot', () => ({
  diffImageToSnapshot: diffImageToSnapshotMock,
}));

const spyOnRmdirSyncMock = jest.fn();
jest.mock('fs', () => ({
  rmdirSync: spyOnRmdirSyncMock,
}));

diffImageToSnapshotMock.mockImplementation(() => {
  return {
    added: true,
  };
});

import { spyOnSaveStoryFile } from '../../../../../__manual_mocks__/utils/save-story-file';
import { loadStoryDataMock } from '../../../../../__manual_mocks__/utils/load-story-data';
import { saveScreenshot } from '../save-screenshot';
import { SaveScreenshotRequest, ImageDiff } from '../../../typings';

describe('saveScreenshot', () => {
  const getData = (
    data?: Partial<SaveScreenshotRequest>,
  ): SaveScreenshotRequest => {
    return {
      actions: [
        {
          id: 'action-id',
          name: 'action-name',
        },
      ],
      base64: 'base64-image',
      browserType: 'chromium',
      fileName: 'story.ts',
      hash: 'hash',
      storyId: 'story-id',
      title: 'screenshot-title',
      ...data,
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should create new file and save data', async () => {
    loadStoryDataMock.mockImplementationOnce(() => {
      return new Promise((resolve) => {
        resolve({});
      });
    });
    const result = await saveScreenshot(getData());
    expect(result).toStrictEqual({ added: true });
    expect(spyOnSaveStoryFile).toHaveBeenCalledTimes(1);
  });

  it('should not allow duplicate title', async () => {
    loadStoryDataMock.mockImplementationOnce(() => {
      return new Promise((resolve) => {
        resolve({
          ['story-id']: {
            screenshots: [
              {
                browserType: 'chromium',
                hash: 'hash-2',
                title: 'foo',
              },
            ],
          },
        });
      });
    });

    await expect(
      saveScreenshot(getData({ title: 'foo' })),
    ).rejects.toThrowError(
      'Found screenshot with the same title (foo), title must be unique.',
    );
  });

  it('should not screenshot with the same setting (using hash for comparison)', async () => {
    loadStoryDataMock.mockImplementationOnce(() => {
      return new Promise((resolve) => {
        resolve({
          ['story-id']: {
            screenshots: [
              {
                browserType: 'chromium',
                hash: 'hash-1',
                title: 'bar',
              },
            ],
          },
        });
      });
    });

    await expect(
      saveScreenshot(getData({ hash: 'hash-1', title: 'foo' })),
    ).rejects.toThrowError('Found screenshot with same setting (bar).');
  });

  it('should remove diff file', async () => {
    diffImageToSnapshotMock.mockImplementationOnce(() => {
      return {
        pass: false,
      };
    });

    await saveScreenshot(getData());

    expect(spyOnRmdirSyncMock).toHaveBeenCalledTimes(1);
  });

  it('should pass and return old screenshot title', async () => {
    loadStoryDataMock.mockImplementationOnce(() => {
      return new Promise((resolve) => {
        resolve({
          ['story-id']: {
            screenshots: [getData()],
          },
        });
      });
    });

    diffImageToSnapshotMock.mockImplementationOnce(() => {
      return {
        pass: true,
      };
    });

    const result = await saveScreenshot(getData());

    expect(spyOnRmdirSyncMock).toHaveBeenCalledTimes(0);
    expect(result).toStrictEqual({
      oldScreenShotTitle: 'screenshot-title',
      pass: true,
    });
  });

  it('should set empty array to undefined (actions)', async () => {
    await saveScreenshot(getData({ actions: [] }));

    const actions =
      spyOnSaveStoryFile.mock.calls[0][1]['story-id']['screenshots'][0].actions;

    const data = spyOnSaveStoryFile;
    expect(data).toBeDefined();

    expect(actions).toBe(undefined);
  });
});
