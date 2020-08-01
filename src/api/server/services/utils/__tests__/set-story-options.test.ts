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

  it('should return undefined if option is empty object', () => {
    const data = { ...storyData };
    const id = setStoryOptions(data, 'browserOptions', {});
    expect(id).toBeUndefined();
  });

  it('should return object id if equal', () => {
    const id = setStoryOptions(
      { browserOptions: { ['option-id']: { cursor: true } } },
      'browserOptions',
      { fullPage: true },
    );
    expect(id).toBe('option-id');
  });
});
