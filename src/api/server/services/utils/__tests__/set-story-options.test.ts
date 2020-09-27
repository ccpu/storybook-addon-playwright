import { setStoryOptions } from '../set-story-options';
import { PlaywrightData } from '../../../../../typings';

describe('setStoryOptions', () => {
  const storyData: PlaywrightData = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should set data and return id', () => {
    const data = { ...storyData };
    const id = setStoryOptions(data, 'browserOptions', { fullPage: true });
    expect(id).toBe('id-1');
    expect(data).toStrictEqual({
      browserOptions: { 'id-1': { fullPage: true } },
    });
  });

  it('should set data', () => {
    const data = { ...storyData };
    const id = setStoryOptions(data, 'browserOptions', { fullPage: true });
    expect(id).toBe('id-2');
    expect(data).toStrictEqual({
      browserOptions: { 'id-2': { fullPage: true } },
    });
  });

  it('should return undefined if option has no prop', () => {
    const data = { ...storyData };
    const id = setStoryOptions(data, 'browserOptions', {});
    expect(id).toBe(undefined);
  });

  it('should return key if found equal object', () => {
    const id = setStoryOptions(
      { screenshotOptions: { ['option-id']: { fullPage: true } } },
      'screenshotOptions',
      {
        fullPage: true,
      },
    );
    expect(id).toBe('option-id');
  });

  it('should return object id if equal', () => {
    const id = setStoryOptions(
      { browserOptions: { ['option-id']: { cursor: true } } },
      'browserOptions',
      { fullPage: true },
    );
    expect(id).toBe('id-3');
  });
});
