import { isStoryJsonFile } from '../is-story-json-file';

describe('isStoryJsonFile', () => {
  it('should be valid', () => {
    expect(
      isStoryJsonFile('test.stories.playwright.json', 'test.stories.tsx'),
    ).toBeTruthy();
    expect(
      isStoryJsonFile('test.stories.playwright.json', 'test.stories.js'),
    ).toBeTruthy();
  });
  it('should not be valid', () => {
    expect(
      isStoryJsonFile('test1.stories.playwright.json', 'test.stories.tsx'),
    ).toBeFalsy();
  });

  it('should be valid if file names are strictly equal', () => {
    expect(
      isStoryJsonFile('test.stories.tsx', 'test.stories.tsx'),
    ).toBeTruthy();
  });
});
