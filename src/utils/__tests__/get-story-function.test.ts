import { getStoryFunction } from '../get-story-function';

vi.mock('../../utils/get-preview-iframe.ts');

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
