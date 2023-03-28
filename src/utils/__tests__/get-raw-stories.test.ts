import { getRawStories } from '../get-raw-stories';

jest.mock('../../utils/get-preview-iframe.ts');

describe('getRawStories', () => {
  it('should have value', () => {
    expect(getRawStories()).toHaveLength(2);
  });
});
