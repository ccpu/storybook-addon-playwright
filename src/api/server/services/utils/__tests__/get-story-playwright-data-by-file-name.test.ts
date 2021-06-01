import { getStoryPlaywrightDataByFileName } from '../get-story-playwright-data-by-file-name';

describe('getStoryPlaywrightDataByFileName', () => {
  it('should be defined', () => {
    expect(getStoryPlaywrightDataByFileName).toBeDefined();
  });

  it('should call', () => {
    expect(getStoryPlaywrightDataByFileName('file-name')).toBeDefined();
  });
});
