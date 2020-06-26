import { getRawStories } from '../get-raw-stories';

jest.mock('../../utils/get-iframe.ts');

describe('getRawStories', () => {
  it('should have value', () => {
    expect(getRawStories()).toStrictEqual([
      { id: 'story-id', kind: 'story-kind' },
    ]);
  });
});
