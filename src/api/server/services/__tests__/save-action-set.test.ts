import { saveStoryFile } from '../../utils';
import { saveActionSet } from '../save-action-set';
import { mocked } from 'ts-jest/utils';

jest.mock('../../utils/save-story-file');
jest.mock('../../utils/load-story-data');
const saveStoryFileMock = mocked(saveStoryFile);

describe('saveActionSet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should create story actionSets if not exist', async () => {
    await saveActionSet({
      actionSet: {
        actions: [{ id: 'action-id', name: 'action-name' }],
        description: 'action-set-desc',
        id: 'action-set-id',
      },
      fileName: 'story.ts',
      storyId: 'story-id-2',
    });
    const data = saveStoryFileMock.mock.calls[0][1]['story-id-2'];
    expect(data).toStrictEqual({
      actionSets: [
        {
          actions: [{ id: 'action-id', name: 'action-name' }],
          description: 'action-set-desc',
          id: 'action-set-id',
        },
      ],
    });
  });

  it('should update story action set', async () => {
    await saveActionSet({
      actionSet: {
        actions: [{ id: 'action-id', name: 'dbClick' }],
        description: 'action-set-desc',
        id: 'action-set-id',
      },
      fileName: 'story.ts',
      storyId: 'story-id',
    });
    const data = saveStoryFileMock.mock.calls[0][1]['story-id'].actionSets;
    expect(data).toStrictEqual([
      {
        actions: [
          { args: { selector: 'html' }, id: 'action-id', name: 'click' },
        ],
        description: 'click',
        id: 'action-set-id-2',
      },
      {
        actions: [{ id: 'action-id', name: 'dbClick' }],
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
      fileName: 'story.ts',
      storyId: 'story-id',
    });
    const data = saveStoryFileMock.mock.calls[0][1]['story-id'].actionSets;
    expect(data).toHaveLength(3);
  });
});
