import { deleteEmptyStory } from '../delete-empty-story';

describe('deleteStory', () => {
  it('should do nothing if story not found', () => {
    const opt = deleteEmptyStory(
      {
        stories: {
          'story-id': {},
        },
      },
      'story-id-2',
    );
    expect(opt).toStrictEqual({ stories: { 'story-id': {} } });
  });

  it('should delete story if empty', () => {
    expect(
      deleteEmptyStory({ stories: { 'story-id': {} } }, 'story-id'),
    ).toStrictEqual({ stories: {} });
  });
  it('should not delete story if not empty', () => {
    expect(
      deleteEmptyStory(
        { stories: { 'story-id': { actionSets: [] } } },
        'story-id',
      ),
    ).toStrictEqual({ stories: { 'story-id': { actionSets: [] } } });
  });
});
