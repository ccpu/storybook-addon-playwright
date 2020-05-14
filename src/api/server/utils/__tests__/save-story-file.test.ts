import { saveStoryFile } from '../save-story-file';
import { getStoryFileInfo } from '../get-story-file-info';
import * as jsonfile from 'jsonfile';

jest.mock('jsonfile', () => ({
  writeFile: jest.fn(),
}));

describe('saveStoryFile', () => {
  it('should save ', async () => {
    const fileInfo = getStoryFileInfo('./story.ts');
    await saveStoryFile(fileInfo, { 'story-id': {} });

    expect(jsonfile.writeFile).toHaveBeenCalledTimes(1);
  });
});
