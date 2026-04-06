import { getStoryFunction } from '../../src/utils/get-story-function';

vi.mock(
  '../../src/utils/get-preview-iframe',
  async () => await import('./__mocks__/get-preview-iframe'),
);

describe('getStoryFunction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return func', () => {
    expect(typeof getStoryFunction('story-id')).toBe('function');
  });

  it('should return func if story not exist', () => {
    expect(getStoryFunction('bad-story-id')).toBe(undefined);
  });
});
