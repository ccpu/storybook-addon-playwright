import { getStoryData } from '../get-story-data';

describe('getStoryData', () => {
  it('should return  story data', () => {
    const data = getStoryData(
      { stories: { 'story-id': { actionSets: [] } } },
      'story-id',
    );
    expect(data).toStrictEqual({ actionSets: [] });
  });

  it('should not create empty story object', () => {
    const data = getStoryData({}, 'story-id');
    expect(data).toStrictEqual(undefined);
  });

  it('should create empty story object', () => {
    const data = getStoryData({}, 'story-id', true);
    expect(data).toStrictEqual({});
  });
});
