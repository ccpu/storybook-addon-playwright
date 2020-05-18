import { getActionSet } from '../get-action-set';
import { spyOnLoadStoryData, spyOnSaveStoryFile } from '../mocks';

describe('getActionSet', () => {
  beforeEach(() => {
    spyOnLoadStoryData.mockClear();
    spyOnSaveStoryFile.mockClear();
  });
  it('should have action set', async () => {
    const data = await getActionSet({
      fileName: 'story-file-name',
      storyId: 'story-id',
    });

    expect(data).toHaveLength(2);
  });

  it('should return empty array if story id not exist', async () => {
    const data = await getActionSet({
      fileName: 'story-file-name',
      storyId: 'story-id-2',
    });

    expect(data).toHaveLength(0);
  });
});
