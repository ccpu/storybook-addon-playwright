import { loadStoryData } from '../load-story-data';
import { getStoryPlaywrightFileInfo } from '../get-story-playwright-file-info';
import fs from 'fs';

const spyOnFs = jest.spyOn(fs, 'existsSync');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
spyOnFs.mockImplementation((file: any) => {
  if (file.indexOf('story-notExist.playwright.json') !== -1) {
    return false;
  }
  return true;
});

jest.mock('jsonfile', () => ({
  readFile: (
    file: string,
    callBack: (err?: string, data?: unknown) => void,
  ) => {
    if (file.indexOf('story-error.playwright.json') !== -1) {
      callBack('some-error');
    } else if (file.indexOf('no-story-id.playwright.json') !== -1) {
      callBack(undefined, {});
    } else {
      callBack(undefined, { stories: { 'story-id': {} } });
    }
  },
}));

describe('loadStoryData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not create object if story-id file not exist', async () => {
    const data = await loadStoryData(
      getStoryPlaywrightFileInfo('./stories/story-notExist.ts').path,
      'story-id',
      false,
    );
    expect(data).toBeUndefined();
  });

  it('should return object with story-id file not exist', async () => {
    const data = await loadStoryData(
      getStoryPlaywrightFileInfo('./stories/story-notExist.ts').path,
      'story-id',
    );
    expect(data).toStrictEqual({ stories: { 'story-id': {} } });
  });

  it('should return empty object when "*" passed for storyId', async () => {
    const data = await loadStoryData(
      getStoryPlaywrightFileInfo('./stories/story-notExist.ts').path,
      '*',
    );
    expect(data).toStrictEqual({ stories: {} });
  });

  it('should return story data object', async () => {
    const data = await loadStoryData(
      getStoryPlaywrightFileInfo('./stories/story.ts').path,
      'story-id',
    );
    expect(data).toStrictEqual({ stories: { 'story-id': {} } });
  });

  it('should return error', async () => {
    await expect(
      loadStoryData(
        getStoryPlaywrightFileInfo('./stories/story-error.ts').path,
        'story-id',
      ),
    ).rejects.toEqual('some-error');
  });

  it('should return empty story object when storyId is "*" and data file has no story id in it', async () => {
    const data = await loadStoryData(
      getStoryPlaywrightFileInfo('./stories/no-story-id.ts').path,
      '*',
    );
    expect(data).toStrictEqual({ stories: {} });
  });

  it('should create new story object if story id not exist', async () => {
    const data = await loadStoryData(
      getStoryPlaywrightFileInfo('./stories/no-story-id.ts').path,
      'story-id-2',
    );
    expect(data).toStrictEqual({ stories: { 'story-id-2': {} } });
  });
});
