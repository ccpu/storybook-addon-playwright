import { deleteActionSet } from '../../../src/api/services/delete-action-set';
import { storyFileInfo } from '../../configs/story-file-info';
import { saveStoryFile, loadStoryData } from '../../../src/api/server/utils';

vi.mock(
  '../../../src/api/server/utils/save-story-file',
  async () => await import('../server/utils/__mocks__/save-story-file'),
);
vi.mock(
  '../../../src/api/server/utils/load-story-data',
  async () => await import('../server/utils/__mocks__/load-story-data'),
);
const saveStoryFileMock = vi.mocked(saveStoryFile);
const loadStoryDataMock = vi.mocked(loadStoryData);

describe('deleteActionSet', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('should throw error if story id missing', async () => {
    await expect(
      deleteActionSet({
        actionSetId: '',
        filePath: 'story-file-name',
        storyId: 'story-id',
      }),
    ).rejects.toThrowError();
  });

  it('should not call save if story id cannot be found', async () => {
    await deleteActionSet({
      actionSetId: 'action-set-id',
      filePath: 'story-file-name',
      storyId: 'story-id-1',
    });
    expect(saveStoryFile).toHaveBeenCalledTimes(0);
  });

  it("should not call save if story doesn't have action sets", async () => {
    loadStoryDataMock.mockImplementationOnce(() => {
      return new Promise((resolve) => {
        const data = storyFileInfo();
        const stories = data.stories!;
        delete stories['story-id'].actionSets;
        resolve(data);
      });
    });

    await deleteActionSet({
      actionSetId: 'action-set-id',
      filePath: 'story-file-name',
      storyId: 'story-id',
    });

    expect(saveStoryFileMock).toHaveBeenCalledTimes(0);
  });

  it('should save', async () => {
    await deleteActionSet({
      actionSetId: 'action-set-id',
      filePath: 'story-file-name',
      storyId: 'story-id',
    });
    expect(saveStoryFileMock).toHaveBeenCalledTimes(1);
  });

  it('should delete actionSets if empty', async () => {
    loadStoryDataMock.mockImplementationOnce(() => {
      return new Promise((resolve) => {
        const data = storyFileInfo();
        const stories = data.stories!;
        stories['story-id'].actionSets = [
          {
            actions: [],
            id: 'action-set-id',
            title: '',
          },
        ];
        resolve(data);
      });
    });

    await deleteActionSet({
      actionSetId: 'action-set-id',
      filePath: 'story-file-name',
      storyId: 'story-id',
    });

    const { actionSets } =
      saveStoryFileMock.mock.calls[0]![1]!.stories!['story-id'];
    expect(actionSets).toStrictEqual(undefined);
  });
});
