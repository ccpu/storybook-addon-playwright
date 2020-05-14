import {
  spyOnSaveStoryFile,
  spyOnLoadStoryData,
} from '../__tests__/mocks/utils';
import { deleteActionSet } from '../delete-action-set';
import { storyFileInfo } from './utils';

describe('deleteActionSet', () => {
  beforeEach(() => {
    spyOnSaveStoryFile.mockClear();
    spyOnLoadStoryData.mockClear();
  });

  it('should throw error if story id missing ', async () => {
    await expect(
      deleteActionSet({
        actionSetId: '',
        fileName: 'story-file-name',
        storyId: 'story-id',
      }),
    ).rejects.toThrowError();
  });

  it('should not call save if story id cannot be found', async () => {
    await deleteActionSet({
      actionSetId: 'action-set-id',
      fileName: 'story-file-name',
      storyId: 'story-id-1',
    });
    expect(spyOnSaveStoryFile).toHaveBeenCalledTimes(0);
  });

  it("should not call save if story doesn't have action sets", async () => {
    spyOnLoadStoryData.mockImplementationOnce(() => {
      return new Promise((resolve) => {
        const data = storyFileInfo();
        delete data['story-id'].actionSets;
        resolve(data);
      });
    });

    await deleteActionSet({
      actionSetId: 'action-set-id',
      fileName: 'story-file-name',
      storyId: 'story-id',
    });

    expect(spyOnSaveStoryFile).toHaveBeenCalledTimes(0);
  });

  it('should save', async () => {
    await deleteActionSet({
      actionSetId: 'action-set-id',
      fileName: 'story-file-name',
      storyId: 'story-id',
    });
    expect(spyOnSaveStoryFile).toHaveBeenCalledTimes(1);
  });

  it('should save empty object when there is no actionSets ', async () => {
    spyOnLoadStoryData.mockImplementationOnce(() => {
      return new Promise((resolve) => {
        const data = storyFileInfo();
        data['story-id'].actionSets = data['story-id'].actionSets.filter(
          (x) => x.id === 'action-set-id',
        );
        resolve(data);
      });
    });

    await deleteActionSet({
      actionSetId: 'action-set-id',
      fileName: 'story-file-name',
      storyId: 'story-id',
    });

    const actionSets = spyOnSaveStoryFile.mock.calls[0][1];
    expect(actionSets).toStrictEqual({});
  });
});
