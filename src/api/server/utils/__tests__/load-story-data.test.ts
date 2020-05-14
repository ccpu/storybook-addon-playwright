import { loadStoryData } from '../load-story-data';
import { getStoryFileInfo } from '../get-story-file-info';

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
      getStoryFileInfo('./stories/story-notExist.ts'),
    );
    expect(data).toStrictEqual({});
  });

  it('should return story data object', async () => {
    const data = await loadStoryData(getStoryFileInfo('./stories/story.ts'));
    expect(data).toStrictEqual({ 'story-id': {} });
  });

  it('should return error', async () => {
    await expect(
      loadStoryData(getStoryFileInfo('./stories/story-error.ts')),
    ).rejects.toEqual('some-error');
  });
});
