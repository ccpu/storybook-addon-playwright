import { getStoryFileInfo } from '../get-story-file-info';

describe('getStoryFileInfo', () => {
  it('should return file info', () => {
    const fileInfo = getStoryFileInfo('./stories/story.ts');
    expect(fileInfo.name).toBe('story.json');
    expect(fileInfo.path.endsWith('story.json')).toBeTruthy();
  });
});
