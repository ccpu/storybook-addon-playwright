import { deleteStoryOptions } from '../delete-story-options';

describe('deleteStoryOptions', () => {
  it('should do nothing if option is undefined', () => {
    const opt = deleteStoryOptions(
      {
        stories: {
          'story-id': {},
        },
      },
      'browserOptions',
      'option-id',
    );
    expect(opt).toStrictEqual({ stories: { 'story-id': {} } });
  });

  it('should not delete option if in use', () => {
    const opt = deleteStoryOptions(
      {
        browserOptions: {
          'option-id': {},
        },
        stories: {
          'story-id': {
            screenshots: [
              {
                browserOptionsId: 'option-id',
                browserType: 'chromium',
                hash: 'hash',
                title: 'title',
              },
            ],
          },
        },
      },
      'browserOptions',
      'option-id',
    );
    expect(opt).toStrictEqual({
      browserOptions: { 'option-id': {} },
      stories: {
        'story-id': {
          screenshots: [
            {
              browserOptionsId: 'option-id',
              browserType: 'chromium',
              hash: 'hash',
              title: 'title',
            },
          ],
        },
      },
    });
  });
  it('should delete browserOptions', () => {
    const opt = deleteStoryOptions(
      {
        browserOptions: {
          'option-id': {},
        },
        stories: {
          'story-id': {},
        },
      },
      'browserOptions',
      'option-id',
    );
    expect(opt).toStrictEqual({ stories: { 'story-id': {} } });
  });
});
