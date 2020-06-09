import { loadStoryData } from '../load-story-data';
import { getStoryPlaywrightFileInfo } from '../get-story-playwright-file-info';

jest.mock('fs', () => ({
  existsSync: (file: string) => {
    if (file.indexOf('story-notExist.playwright.json') !== -1) {
      return false;
    }
    return true;
  },
}));

jest.mock('jsonfile', () => ({
  readFile: (file: string, callBack: (err?: string, data?: {}) => void) => {
    if (file.indexOf('story-error.playwright.json') !== -1) {
      callBack('some-error');
    } else if (file.indexOf('no-story-id.playwright.json') !== -1) {
      callBack(undefined, {});
    } else {
      callBack(undefined, { 'story-id': {} });
    }
  },
}));

describe('loadStoryData', () => {
  it('should return object with story-id when file not exist', async () => {
    const data = await loadStoryData(
      getStoryPlaywrightFileInfo('./stories/story-notExist.ts').path,
      'story-id',
    );
    expect(data).toStrictEqual({ 'story-id': {} });
  });

  it('should return empty object when "*" passed for storyId', async () => {
    const data = await loadStoryData(
      getStoryPlaywrightFileInfo('./stories/story-notExist.ts').path,
      '*',
    );
    expect(data).toStrictEqual({});
  });

  it('should return story data object', async () => {
    const data = await loadStoryData(
      getStoryPlaywrightFileInfo('./stories/story.ts').path,
      'story-id',
    );
    expect(data).toStrictEqual({ 'story-id': {} });
  });

  it('should return error', async () => {
    await expect(
      loadStoryData(
        getStoryPlaywrightFileInfo('./stories/story-error.ts').path,
        'story-id',
      ),
    ).rejects.toEqual('some-error');
  });

  it('should return empty object when storyId is "*" and data file has no story id in it', async () => {
    const data = await loadStoryData(
      getStoryPlaywrightFileInfo('./stories/no-story-id.ts').path,
      '*',
    );
    expect(data).toStrictEqual({});
  });

  it('should create new story object if story id not exist', async () => {
    const data = await loadStoryData(
      getStoryPlaywrightFileInfo('./stories/no-story-id.ts').path,
      'story-id-2',
    );
    expect(data).toStrictEqual({ 'story-id-2': {} });
  });
});
