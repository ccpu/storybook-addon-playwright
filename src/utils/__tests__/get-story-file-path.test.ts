import { getStoryFilePath } from '../get-story-file-path';
import mockConsole from 'jest-mock-console';

jest.mock('../../utils/get-iframe.ts');

describe('getStoryFilePath', () => {
  it('should have filePath', () => {
    expect(getStoryFilePath('./story.ts', 'story-id')).toBe(
      'actual-relative-path',
    );
  });

  it('should not have filePath if story id not exist', () => {
    const restoreConsole = mockConsole();
    expect(getStoryFilePath('./story.ts', 'bad-story-id')).toBe(undefined);
    expect(console.warn).toHaveBeenCalledWith(
      "Unable to detect the relative path of './story.ts' for stories of id 'bad-story-id'",
    );
    restoreConsole();
  });

  it('should not have path when story component function name not matched', () => {
    const restoreConsole = mockConsole();
    expect(getStoryFilePath('./story-diff-func.ts', 'story-id')).toBe(
      undefined,
    );
    expect(console.warn).toHaveBeenCalledWith(
      "Unable to detect the relative path of './story-diff-func.ts' for stories of id 'story-id'",
    );
    restoreConsole();
  });

  it('should not have path when story component function instance not matched', () => {
    const restoreConsole = mockConsole();
    expect(getStoryFilePath('./story-same-func.ts', 'story-id')).toBe(
      undefined,
    );
    expect(console.warn).toHaveBeenCalledWith(
      `Unable to detect the relative path of './story-same-func.ts' for stories of id 'story-id'`,
    );
    restoreConsole();
  });
});
