import { getRawStories } from '../get-raw-stories';

vi.mock('../../utils/get-preview-iframe.ts');

describe('getRawStories', () => {
  it('should have value', () => {
    expect(getRawStories()).toHaveLength(2);
  });
});
