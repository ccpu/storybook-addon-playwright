import { getStoryPlaywrightFileInfo } from '../get-story-playwright-file-info';

describe('getStoryFileInfo', () => {
  it('should return file info', () => {
    const fileInfo = getStoryPlaywrightFileInfo('./stories/story.ts');
    expect(fileInfo.name).toBe('story.playwright.json');
    expect(fileInfo.path.endsWith('story.playwright.json')).toBeTruthy();
  });

  it('should handle playwright json file', () => {
    const fileInfo = getStoryPlaywrightFileInfo(
      './stories/story.playwright.json',
    );
    expect(fileInfo.name).toBe('story.playwright.json');
    expect(fileInfo.path.endsWith('story.playwright.json')).toBeTruthy();
  });
});
