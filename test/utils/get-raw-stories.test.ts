import { getRawStories } from '../../src/utils/get-raw-stories';

vi.mock(
  '../../src/utils/get-preview-iframe',
  async () => await import('./__mocks__/get-preview-iframe'),
);

describe('getRawStories', () => {
  it('should have value', () => {
    expect(getRawStories()).toHaveLength(2);
  });
});
