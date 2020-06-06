import { getStoryPlaywrightFileInfo } from '../get-story-playwright-file-info';

describe('getStoryFileInfo', () => {
  it('should return file info', () => {
    const fileInfo = getStoryPlaywrightFileInfo('./stories/story.ts');
    expect(fileInfo.name).toBe('story.playwright.json');
    expect(fileInfo.path.endsWith('story.playwright.json')).toBeTruthy();
  });
});
