import { loadStoryData } from '../load-story-data';
import { getStoryPlaywrightFileInfo } from '../get-story-playwright-file-info';

jest.mock('fs', () => ({
  existsSync: (file: string) => {
    if (file.indexOf('story-notExist.json') > -1) {
      return false;
    }
    return true;
  },
}));

jest.mock('jsonfile', () => ({
  readFile: (file: string, callBack: (err?: string, data?: {}) => void) => {
    if (file.indexOf('story-error.json') > -1) {
      callBack('some-error');
    } else {
      callBack(undefined, { 'story-id': {} });
    }
  },
}));

describe('loadStoryData', () => {
  it('should return empty object if file not exist', async () => {
    const data = await loadStoryData(
      getStoryPlaywrightFileInfo('./stories/story-notExist.ts'),
    );
    expect(data).toStrictEqual({});
  });

  it('should return story data object', async () => {
    const data = await loadStoryData(
      getStoryPlaywrightFileInfo('./stories/story.ts'),
    );
    expect(data).toStrictEqual({ 'story-id': {} });
  });

  it('should return error', async () => {
    await expect(
      loadStoryData(getStoryPlaywrightFileInfo('./stories/story-error.ts')),
    ).rejects.toEqual('some-error');
  });
});
