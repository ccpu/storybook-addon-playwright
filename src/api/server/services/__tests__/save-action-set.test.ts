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
        id: 'action-set-id',
        title: 'action-set-desc',
      },
      fileName: 'story.ts',
      storyId: 'story-id-2',
    });
    const data = saveStoryFileMock.mock.calls[0][1].stories['story-id-2'];
    expect(data).toStrictEqual({
      actionSets: [
        {
          actions: [{ id: 'action-id', name: 'action-name' }],
          id: 'action-set-id',
          title: 'action-set-desc',
        },
      ],
    });
  });

  it('should update story action set', async () => {
    await saveActionSet({
      actionSet: {
        actions: [{ id: 'action-id', name: 'dbClick' }],
        id: 'action-set-id',
        title: 'action-set-desc',
      },
      fileName: 'story.ts',
      storyId: 'story-id',
    });
    const data =
      saveStoryFileMock.mock.calls[0][1].stories['story-id'].actionSets;
    expect(data).toStrictEqual([
      {
        actions: [
          { args: { selector: 'html' }, id: 'action-id', name: 'click' },
        ],
        id: 'action-set-id-2',
        title: 'click',
      },
      {
        actions: [{ id: 'action-id', name: 'dbClick' }],
        id: 'action-set-id',
        title: 'action-set-desc',
      },
    ]);
  });

  it('should create new story action set', async () => {
    await saveActionSet({
      actionSet: {
        actions: [{ id: 'action-id', name: 'click' }],
        id: 'action-set-id-3',
        title: 'action-set-desc',
      },
      fileName: 'story.ts',
      storyId: 'story-id',
    });
    const data =
      saveStoryFileMock.mock.calls[0][1].stories['story-id'].actionSets;
    expect(data).toHaveLength(3);
  });
});
