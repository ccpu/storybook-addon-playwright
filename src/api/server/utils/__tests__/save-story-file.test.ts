import { saveStoryFile } from '../save-story-file';
import { getStoryPlaywrightFileInfo } from '../get-story-playwright-file-info';
import * as jsonfile from 'jsonfile';

jest.mock('jsonfile', () => ({
  writeFile: jest.fn(),
}));

describe('saveStoryFile', () => {
  it('should save ', async () => {
    const fileInfo = getStoryPlaywrightFileInfo('./story.ts');
    await saveStoryFile(fileInfo, { 'story-id': {} });

    expect(jsonfile.writeFile).toHaveBeenCalledTimes(1);
  });
});
