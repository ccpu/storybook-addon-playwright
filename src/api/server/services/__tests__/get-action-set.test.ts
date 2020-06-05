import { getActionSet } from '../get-action-set';

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
  });

  it('should return empty array if story id not exist', async () => {
    const data = await getActionSet({
      fileName: 'story-file-name',
      storyId: 'story-id-2',
    });

    expect(data).toHaveLength(0);
  });
});
