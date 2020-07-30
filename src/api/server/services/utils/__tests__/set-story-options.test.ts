import { setStoryOptions } from '../set-story-options';
import { StoryPlaywrightData } from '../../../../../typings';

jest.mock('nanoid', () => ({
  nanoid: () => 'some-id',
}));

describe('setStoryOptions', () => {
  const storyData: StoryPlaywrightData = {};
  it('should set data and return id', () => {
    const data = { ...storyData };
    const id = setStoryOptions(data, 'browserOptions', { fullPage: true });
    expect(id).toBe('some-id');
    expect(data).toStrictEqual({
      browserOptions: { 'some-id': { fullPage: true } },
    });
  });
});
