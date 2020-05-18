import { spyOnSaveStoryFile } from '../mocks';
import { saveActionSet } from '../save-action-set';

describe('saveActionSet', () => {
  beforeEach(() => {
    spyOnSaveStoryFile.mockClear();
  });

  it('should create story object if not exist', async () => {
    await saveActionSet({
      actionSet: {
        actions: [{ id: 'action-id', name: 'action-name' }],
        description: 'action-set-desc',
        id: 'action-set-id',
      },
      fileName: 'story-file-name',
      storyId: 'stroy-id-2',
    });
    const data = spyOnSaveStoryFile.mock.calls[0][1]['stroy-id-2'];
    expect(data).toBeDefined();
  });

  it('should update story action set', async () => {
    await saveActionSet({
      actionSet: {
        actions: [{ id: 'action-id', name: 'click' }],
        description: 'action-set-desc',
        id: 'action-set-id',
      },
      fileName: 'story-file-name',
      storyId: 'stroy-id',
    });
    const data = spyOnSaveStoryFile.mock.calls[0][1]['stroy-id'].actionSets;
    expect(data).toStrictEqual([
      {
        actions: [{ id: 'action-id', name: 'click' }],
        description: 'action-set-desc',
        id: 'action-set-id',
      },
    ]);
  });

  it('should create new story action set', async () => {
    await saveActionSet({
      actionSet: {
        actions: [{ id: 'action-id', name: 'click' }],
        description: 'action-set-desc',
        id: 'action-set-id-3',
      },
      fileName: 'story-file-name',
      storyId: 'story-id',
    });
    const data = spyOnSaveStoryFile.mock.calls[0][1]['story-id'].actionSets;
    expect(data).toHaveLength(3);
  });
});
