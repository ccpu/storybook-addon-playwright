import { getActionSet } from '../get-action-set';
// import '../../../../../__manual_mocks__/nanoid';

jest.mock('../../utils/save-story-file');
jest.mock('../../utils/load-story-data');

describe('getActionSet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should have action set', async () => {
    const data = await getActionSet({
      fileName: 'story-file-name',
      storyId: 'story-id',
    });

    expect(data).toHaveLength(2);
    expect(data).toStrictEqual([
      {
        actions: [{ args: { selector: 'html' }, id: 'id-1', name: 'click' }],
        id: 'action-set-id',
        title: 'click',
      },
      {
        actions: [{ args: { selector: 'html' }, id: 'id-2', name: 'click' }],
        id: 'action-set-id-2',
        title: 'click',
      },
    ]);
  });

  it('should return empty array if story id not exist', async () => {
    const data = await getActionSet({
      fileName: 'story-file-name',
      storyId: 'story-id-2',
    });

    expect(data).toHaveLength(0);
  });
});
